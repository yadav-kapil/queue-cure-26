import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Utility to export history session logs as CSV or PDF.
 * @param {Array} history - The history session log array from API.
 * @param {string} role - The current user's role ('doctor' or 'receptionist').
 * @param {string} format - Export format: 'csv' or 'pdf'.
 */
export const exportHistory = (history, role, format = 'csv') => {
  if (!history || history.length === 0) return;

  const formatTime = (dateStr) => {
    if (!dateStr) return "--:--";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getDuration = (start, end) => {
    if (!start || !end) return "--";
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const diffMins = Math.max(0, Math.floor(diffMs / 60000));
    return `${diffMins} min`;
  };

  const staffColumnLabel = role === "doctor" ? "Receptionist" : "Doctor";
  const dateStamp = new Date().toISOString().split("T")[0];

  // Extract associated staff ID from the first available session
  const firstSession = history.find((item) => item.session)?.session
  const staffId =
    role === "doctor"
      ? (firstSession?.receptionistId?._id || firstSession?.receptionistId || 'rec')
      : (firstSession?.doctorId?._id || firstSession?.doctorId || 'doc')

  // Format: doctor_consultant_{staffId}_{date} or receptionist_consultant_{staffId}_{date}
  const fileName = `${role}_consultant_${staffId}_${dateStamp}`

  const getStaffName = (session) =>
    role === "doctor"
      ? session.receptionistId?.fullName || "None Assigned"
      : session.doctorId
        ? `Dr. ${session.doctorId.fullName.replace(/^Dr\.\s*/i, "")}`
        : "Doctor";

  // Build flat row data shared by both formats
  const sessionRows = history
    .map((item) => {
      const session = item.session;
      if (!session) return null;

      const sessionDate = new Date(session.startedAt).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );
      const staffName = getStaffName(session);
      const patients =
        item.queue?.patients?.filter(
          (p) => p.consultationEndedAt || p.skipped,
        ) || [];

      return {
        sessionDate,
        staffName,
        startTime: formatTime(session.startedAt),
        endTime: formatTime(session.endedAt),
        patients: patients.map((p) => ({
          token: `#${p.tokenNumber}`,
          name: p.name,
          mobile: p.mobile || "N/A",
          duration: p.consultationEndedAt
            ? getDuration(p.consultationStartedAt, p.consultationEndedAt)
            : "--",
          status: p.skipped ? "Skipped" : "Completed",
          finishedAt: p.consultationEndedAt
            ? formatTime(p.consultationEndedAt)
            : "--:--",
        })),
      };
    })
    .filter(Boolean);

  if (format === "csv") {
    const headers = [
      "Session Date",
      staffColumnLabel,
      "Token",
      "Patient Name",
      "Mobile",
      "Duration",
      "Status",
      "Finished At",
    ];

    const rows = sessionRows.flatMap(({ sessionDate, staffName, patients }) =>
      patients.map((p) => [
        sessionDate,
        staffName,
        p.token,
        p.name,
        p.mobile,
        p.duration,
        p.status,
        p.finishedAt,
      ]),
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${fileName}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (format === 'pdf') {
      const titleRole = role === 'doctor' ? 'Doctor' : 'Receptionist'
      const exportDate = new Date().toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
      })

      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
      const pageW = doc.internal.pageSize.getWidth()

      // ── Header ──────────────────────────────────────────────────────────────
      doc.setFillColor(36, 89, 255)
      doc.rect(0, 0, pageW, 48, 'F')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(255, 255, 255)
      doc.text(`${titleRole} — Consultation Logs`, 32, 30)

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(200, 215, 255)
      doc.text(`Exported on ${exportDate}`, 32, 42)

      let cursorY = 64

      sessionRows.forEach(({ sessionDate, staffName, startTime, endTime, patients }, idx) => {
        // ── Session label bar ────────────────────────────────────────────────
        if (cursorY > doc.internal.pageSize.getHeight() - 80) {
          doc.addPage()
          cursorY = 32
        }

        doc.setFillColor(248, 251, 255)
        doc.roundedRect(24, cursorY, pageW - 48, 28, 4, 4, 'F')
        doc.setDrawColor(229, 234, 244)
        doc.roundedRect(24, cursorY, pageW - 48, 28, 4, 4, 'S')

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(7, 18, 47)
        doc.text(`Session ${idx + 1}  ·  ${sessionDate}`, 34, cursorY + 17)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(100, 116, 139)
        doc.text(`${startTime} – ${endTime}`, 34, cursorY + 26)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(36, 89, 255)
        doc.text(`${staffColumnLabel}: ${staffName}`, pageW - 32, cursorY + 19, { align: 'right' })

        cursorY += 34

        // ── Patient table ────────────────────────────────────────────────────
        const tableRows = patients.length
          ? patients.map((p) => [p.token, p.name, p.mobile, p.duration, p.status, p.finishedAt])
          : [['—', 'No consultations in this session.', '', '', '', '']]

        autoTable(doc, {
          startY: cursorY,
          margin: { left: 24, right: 24 },
          head: [['Token', 'Patient Name', 'Mobile', 'Duration', 'Status', 'Finished At']],
          body: tableRows,
          styles: {
            fontSize: 9,
            cellPadding: { top: 6, bottom: 6, left: 10, right: 10 },
            textColor: [17, 24, 39],
            lineColor: [241, 245, 249],
            lineWidth: 0.5,
          },
          headStyles: {
            fillColor: [240, 245, 255],
            textColor: [100, 116, 139],
            fontStyle: 'bold',
            fontSize: 8,
          },
          alternateRowStyles: { fillColor: [248, 250, 255] },
          didParseCell(data) {
            if (data.section === 'body' && data.column.index === 4) {
              const val = data.cell.raw
              if (val === 'Completed') data.cell.styles.textColor = [22, 163, 74]
              if (val === 'Skipped')   data.cell.styles.textColor = [220, 38, 38]
              data.cell.styles.fontStyle = 'bold'
            }
          },
        })

        cursorY = doc.lastAutoTable.finalY + 20
      })

      // ── Page numbers ─────────────────────────────────────────────────────
      const totalPages = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(148, 163, 184)
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageW - 32,
          doc.internal.pageSize.getHeight() - 16,
          { align: 'right' }
        )
      }

      doc.save(`${fileName}.pdf`)
  }
};


