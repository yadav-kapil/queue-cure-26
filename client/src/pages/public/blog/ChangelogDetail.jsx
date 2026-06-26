import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { FiArrowLeft, FiUser } from "react-icons/fi";
import useBlogs from "../../../hooks/useBlogs";

const ChangelogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBlog, isLoading, error, fetchBlogById } = useBlogs();

  useEffect(() => {
    fetchBlogById(id);
  }, [id, fetchBlogById]);

  const getCategoryStyles = (category) => {
    switch (category?.toLowerCase()) {
      case "announcement":
        return {
          badge: "bg-blue-50 text-blue-600 border-blue-100/60",
          bg: "bg-[#eef2ff]"
        };
      case "product update":
        return {
          badge: "bg-emerald-50 text-emerald-600 border-emerald-100/60",
          bg: "bg-[#f0fdf4]"
        };
      case "healthcare insight":
        return {
          badge: "bg-purple-50 text-purple-600 border-purple-100/60",
          bg: "bg-[#faf5ff]"
        };
      case "tips & best practices":
        return {
          badge: "bg-orange-50 text-orange-600 border-orange-100/60",
          bg: "bg-[#fff7ed]"
        };
      case "case study":
        return {
          badge: "bg-cyan-50 text-cyan-600 border-cyan-100/60",
          bg: "bg-[#ecfeff]"
        };
      default:
        return {
          badge: "bg-slate-50 text-slate-650 border-slate-200",
          bg: "bg-slate-50"
        };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors duration-200 mb-8 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
          Back to all updates
        </Link>

        {isLoading ? (
          <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 md:p-10 space-y-6 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-10 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/3" />
            <div className="h-64 bg-slate-100 rounded-[16px]" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 rounded" />
              <div className="h-4 bg-slate-100 rounded" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white border border-slate-200/60 rounded-[24px] shadow-sm">
            <p className="text-red-500 font-semibold">{error}</p>
            <Link
              to="/blog"
              className="mt-4 inline-block px-6 py-2 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition"
            >
              Back to Updates
            </Link>
          </div>
        ) : !currentBlog ? (
          <div className="text-center py-16 bg-white border border-slate-200/55 rounded-[24px] shadow-sm">
            <p className="text-slate-500 font-semibold">Post not found.</p>
            <Link
              to="/blog"
              className="mt-4 inline-block px-6 py-2 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition"
            >
              Back to Updates
            </Link>
          </div>
        ) : (
          <article className="bg-white border border-slate-200/60 rounded-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.02)] overflow-hidden">
            {currentBlog.coverImage && (
              <div className="w-full h-64 md:h-96 overflow-hidden relative border-b border-slate-100 bg-slate-50">
                <img
                  src={currentBlog.coverImage}
                  alt={currentBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-10">
              {/* Category & Date Row */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${getCategoryStyles(currentBlog.category).badge}`}>
                  {currentBlog.category}
                </span>
                {currentBlog.version && (
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200/40">
                    {currentBlog.version}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-semibold ml-auto">
                  {formatDate(currentBlog.publishedAt)}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
                {currentBlog.title}
              </h1>

              <div className="flex items-center gap-1.5 mb-6 text-slate-650">
                <FiUser className="size-4 text-slate-400 mr-0.5" />
                <span className="text-xs font-semibold">Kapil Yadav</span>
              </div>

              <div className="border-t border-slate-100 my-6" />

              <div
                className="prose prose-slate max-w-none text-slate-650 leading-relaxed text-sm md:text-base space-y-4"
                onClick={(e) => {
                  const anchor = e.target.closest("a");
                  if (anchor) {
                    const href = anchor.getAttribute("href");
                    if (href && href.startsWith("/") && !href.startsWith("//")) {
                      e.preventDefault();
                      navigate(href);
                    }
                  }
                }}
                dangerouslySetInnerHTML={{ __html: currentBlog.content }}
              />
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default ChangelogDetail;
