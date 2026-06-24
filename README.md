# Queue Cure

> **Smart Queue. Better Care.**
> A real-time clinic queue management platform connecting doctors, receptionists, and patients through a shared live queue, eliminating uncertainty in waiting experiences and reducing manual coordination.

---

## 🚀 Overview

**Queue Cure** transforms traditional clinic queue management into a transparent, connected, and real-time system. Instead of relying on paper tokens, verbal announcements, and manual display updates, Queue Cure provides live queue tracking, dynamic wait-time estimation, and instant synchronization across all stakeholders.

The platform ensures that doctors, receptionists, and patients always view the same queue state in real time.

---

## ⚠️ Problem Statement

Many clinics still depend on manual queue management systems:
* **Paper Token Distribution:** Patients receive physical tokens that are easily lost or mismanaged.
* **Verbal Announcements:** Receptionists must shout names or numbers, causing noise and missed turns.
* **Static Display Boards:** Display boards (if any) are updated manually and prone to delays.
* **Administrative Overload:** Receptionists spend excessive time answering repetitive questions about wait times.
* **Doctor Isolation:** Doctors lack visibility into the waiting room queue size and status in real-time.

**Queue Cure** solves these challenges by establishing a single synchronized source of truth for the entire clinic.

---

## ✨ Key Features

### 👨‍⚕️ Doctor Dashboard
* **Session Control:** Start, pause, or end clinic sessions.
* **Queue Management:** Call the next patient, skip unavailable patients, and track attendance.
* **Live Queue Status:** Monitor the remaining patient queue in real-time.
* **Analytics & History:** View past sessions, patient counts, and average consultation times.

### 👩‍💻 Receptionist Dashboard
* **Patient Registration:** Quickly register incoming patients with name, age, and phone number.
* **Token Generation:** Automatically assign a unique token number.
* **Live Session Tracking:** Monitor which doctors are active and track patient queue positions.
* **Status Updates:** Update patient statuses or cancel tokens as needed.

### 📱 Patient Tracking Interface
* **Personal Token Pass:** View assigned token details and current status.
* **Queue Position:** Check live number of patients ahead.
* **Dynamic Wait-Time:** View estimated waiting time based on active consultation history.
* **Live Updates:** Receive instant updates via Socket.IO without page refreshes.

---

## ⚡ Real-Time Synchronization & Architecture

Queue Cure leverages **Socket.IO** to ensure seamless, two-way communication between the server and all client dashboards.

### Request & Update Lifecycle
```
[User Action: e.g., Register Patient] 
         ↓
   [API Request]
         ↓
  [Express Backend]
         ↓
  [MongoDB Update]
         ↓
[Socket.IO Event Broadcast]
         ↓
[Connected Dashboards Update]
         ↓
    [UI Re-render]
```

### System Workflow
```
Doctor Starts Session
        ↓
Receptionist Joins Session
        ↓
Patient Registers & Gets Token
        ↓
Patient Monitors Live Queue & Wait Time
        ↓
Doctor Calls Next Patient (Socket Event)
        ↓
Consultation Completed
        ↓
Doctor Ends Session
```

---

## ⏱️ Dynamic Wait-Time Estimation

Queue Cure replaces arbitrary static wait times with a dynamic formula using live clinic performance data:

$$\text{Estimated Wait Time} = \text{Patients Ahead} \times \text{Average Consultation Time}$$

Where:
* **Patients Ahead:** Number of active patients ahead of the current patient in the queue.
* **Average Consultation Time:** A running average of completed consultations during the active session.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 19 (Vite)
* **Routing:** React Router v7
* **State Management:** React Context API
* **Styling:** Tailwind CSS v4 & React Icons
* **Animations:** Motion (Framer Motion v12)
* **Real-time:** Socket.IO Client

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js v5
* **Authentication:** JWT, Cookie Parser, Bcrypt.js
* **Validation:** Joi
* **Real-time:** Socket.IO Server

### Database
* **Database:** MongoDB & Mongoose

---

## ⚙️ Project Setup & Installation

Follow these steps to run **Queue Cure** locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/yadav-kapil/queue-cure-26.git
cd queue-cure-26
```

### 2. Configure Environment Variables

#### Backend (`/server/.env`)
Create a `.env` file inside the `server/` directory and configure the following variables:
```env
PORT=3003
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret"
CLIENT_URI=http://localhost:5173
COOKIE_SECRET="your_cookie_secret"
```

#### Frontend (`/client/.env`)
Create a `.env` file inside the `client/` directory:
```env
VITE_SERVER_URL=http://localhost:3003
VITE_SOCKET_URL=http://localhost:3003
VITE_DEMO_VIDEO_URL="your_demo_video_url"
```

### 3. Run the Backend Server
```bash
cd server
npm install
npm run dev # Starts server using nodemon on port 3003
```

### 4. Run the Frontend Client
Open a new terminal window:
```bash
cd client
npm install
npm run dev # Starts Vite app on http://localhost:5173
```

---

## 👨‍💻 Developed By

**Kapil Yadav**
* B.Tech CSE, IIEST Shibpur
* Queue Cure '26 Hackathon Submission 🚀

---
*Based on the Queue Cure Case Study & codebase specifications.*
