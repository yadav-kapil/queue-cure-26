import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FiArrowLeft,
  FiUser,
  FiSearch,
  FiMail,
  FiArrowRight,
  FiGrid,
  FiVolume2,
  FiCheckSquare,
  FiShield,
  FiZap,
  FiFileText,
  FiChevronDown
} from "react-icons/fi";
import useBlogs from "../../../hooks/useBlogs";

const stripHtml = (html) => {
  if (!html) return "";
  const withoutStyle = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  const doc = new DOMParser().parseFromString(withoutStyle, "text/html");
  return doc.body.textContent || "";
};

const ChangelogPage = () => {
  const { blogs, isLoading, error, fetchBlogs } = useBlogs();
  const [activeFilter, setActiveFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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

  const getReadTime = (category) => {
    switch (category?.toLowerCase()) {
      case "announcement": return "3 min read";
      case "product update": return "4 min read";
      case "healthcare insight": return "5 min read";
      case "tips & best practices": return "3 min read";
      case "case study": return "6 min read";
      default: return "4 min read";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = activeFilter === "all" || blog.category?.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filters = [
    { name: "all", label: "All Posts", icon: FiGrid },
    { name: "Announcement", label: "Announcements", icon: FiVolume2 },
    { name: "Product Update", label: "Product Updates", icon: FiCheckSquare },
    { name: "Healthcare Insight", label: "Healthcare Insights", icon: FiShield },
    { name: "Tips & Best Practices", label: "Tips & Best Practices", icon: FiZap },
    { name: "Case Study", label: "Case Studies", icon: FiFileText },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            viewTransition
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors duration-200 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-850 to-indigo-950 rounded-3xl p-8 md:p-12 text-white mb-10 relative overflow-hidden shadow-lg shadow-indigo-950/15">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-7">
              <span className="inline-block bg-white/15 text-white/95 text-[10px] font-extrabold px-3 py-1 rounded-full tracking-wider uppercase">
                Blogs & Announcements
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mt-4 mb-3">
                Insights, Updates & <br />Stories from <span className="underline decoration-blue-300 decoration-wavy">Queue Cure</span>
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-xl leading-relaxed">
                Stay informed with the latest product updates, announcements, healthcare insights, and tips to run your clinic smarter.
              </p>
            </div>
             <div className="md:col-span-5 hidden md:block relative h-[220px] overflow-hidden select-none">
               <img
                 src="https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=600&auto=format&fit=crop&q=80"
                 alt="Vibrant 3D abstract shapes"
                 className="w-full h-full object-cover mix-blend-screen opacity-90 scale-105"
               />
             </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Filters + Blog Cards Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Search Box (Mobile only) */}
            <div className="relative w-full lg:hidden">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#315cf0] transition-all duration-200"
              />
            </div>

            {/* Filters bar */}
            
            {/* Desktop Filters (Hidden on Mobile) */}
            <div className="hidden sm:flex flex-wrap items-center gap-2 border-b border-slate-200/50 pb-5 overflow-x-auto scrollbar-none">
              {filters.map((filter) => {
                const Icon = filter.icon;
                const isActive = activeFilter.toLowerCase() === filter.name.toLowerCase();
                return (
                  <button
                    key={filter.name}
                    onClick={() => setActiveFilter(filter.name)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer capitalize border select-none whitespace-nowrap ${
                      isActive
                        ? "bg-[#315cf0] text-white border-[#315cf0] shadow-md shadow-blue-500/15"
                        : "bg-white text-slate-655 border-slate-200 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Filter Dropdown (Hidden on Desktop) */}
            <div className="sm:hidden relative w-full mb-4 z-20">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-700 shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    const activeFilterObj = filters.find(
                      (f) => f.name.toLowerCase() === activeFilter.toLowerCase()
                    ) || filters[0];
                    const ActiveIcon = activeFilterObj.icon;
                    return (
                      <>
                        <ActiveIcon className="size-4 text-[#315cf0]" />
                        <span>{activeFilterObj.label}</span>
                      </>
                    );
                  })()}
                </div>
                <FiChevronDown className={`size-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden divide-y divide-slate-100 animate-fadeIn">
                  {filters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeFilter.toLowerCase() === filter.name.toLowerCase();
                    return (
                      <button
                        key={filter.name}
                        onClick={() => {
                          setActiveFilter(filter.name);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 text-xs font-semibold transition-colors cursor-pointer ${
                          isActive
                            ? "bg-blue-50 text-[#315cf0]"
                            : "text-slate-650 hover:bg-slate-50 hover:text-slate-950"
                        }`}
                      >
                        <Icon className={`size-4 ${isActive ? "text-[#315cf0]" : "text-slate-400"}`} />
                        <span>{filter.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Blogs List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white border border-slate-200/55 rounded-[24px] p-3 flex flex-col space-y-4 animate-pulse">
                    <div className="w-full aspect-[4/3] rounded-[16px] bg-slate-100" />
                    <div className="p-2 space-y-4 flex-1 flex flex-col">
                      <div className="h-4 bg-slate-100 rounded w-1/4" />
                      <div className="h-6 bg-slate-100 rounded w-3/4" />
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-full" />
                        <div className="h-4 bg-slate-100 rounded w-5/6" />
                      </div>
                      <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between">
                        <div className="h-4 bg-slate-100 rounded w-1/3" />
                        <div className="h-4 bg-slate-100 rounded w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white border border-slate-200/60 rounded-[24px] shadow-sm">
                <p className="text-red-500 font-semibold">{error}</p>
                <button
                  onClick={fetchBlogs}
                  className="mt-4 px-6 py-2 bg-[#315cf0] text-white rounded-full font-semibold hover:bg-blue-700 transition cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200/50 rounded-[24px] shadow-sm">
                <p className="text-slate-500 font-semibold">No updates found for this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => {
                  const catStyle = getCategoryStyles(blog.category);
                  return (
                    <div key={blog._id} className="bg-white border border-slate-200/65 rounded-[24px] p-3 flex flex-col h-full hover:shadow-[0_16px_35px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 transition-all duration-300">
                      {/* Thumbnail Container */}
                      <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden border border-slate-200/50 mb-4 bg-slate-50">
                        {/* Thumbnail Image */}
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-350 select-none"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-350 font-bold text-sm select-none">Queue Cure</div>
                        )}

                        {/* Tag on top left */}
                        <span className={`absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border shadow-sm z-10 ${catStyle.badge}`}>
                          {blog.category}
                        </span>
                        
                        {/* Date on top right */}
                        <span className="absolute top-3.5 right-3.5 text-[9px] font-bold text-white bg-slate-900/65 backdrop-blur-[2px] px-2 py-0.5 rounded shadow-sm z-10">
                          {formatDate(blog.publishedAt)}
                        </span>
                      </div>

                      {/* Text Contents */}
                      <div className="flex-1 flex flex-col px-2 pb-2">
                        {/* Title */}
                        <h2 className="text-base font-bold text-slate-900 leading-snug mb-2 hover:text-[#315cf0] transition-colors duration-200 line-clamp-2">
                          <Link to={`/blog/${blog._id}`} viewTransition>{blog.title}</Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-4 line-clamp-2">
                          {stripHtml(blog.content)}
                        </p>

                        {/* Footer */}
                        <div className="border-t border-slate-100 pt-3 mt-auto flex items-center justify-between">
                          <div className="flex items-center text-slate-655">
                            <FiUser className="size-3.5 text-slate-400 mr-1.5" />
                            <span className="text-xs font-semibold">Kapil Yadav</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">
                            {getReadTime(blog.category)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search Box (Desktop only) */}
            <div className="relative w-full hidden lg:block">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Stay in the Loop Card */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
              <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <FiMail className="size-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Stay in the Loop</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Subscribe to get the latest updates, announcements, and insights delivered to your inbox.
              </p>
              
              {isSubscribed ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center text-xs font-semibold text-emerald-600 animate-fadeIn">
                  Subscribed successfully! 🎉
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#315cf0] focus:bg-white transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#315cf0] hover:bg-blue-700 text-white rounded-xl py-2 px-4 text-xs font-bold transition-all duration-200 cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Popular Topics Card */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Popular Topics</h3>
              <div className="space-y-2">
                {[
                  { name: "Announcement", label: "Announcements" },
                  { name: "Product Update", label: "Product Updates" },
                  { name: "Healthcare Insight", label: "Healthcare Insights" },
                  { name: "Tips & Best Practices", label: "Tips & Best Practices" },
                  { name: "Case Study", label: "Case Studies" }
                ].map((topic) => {
                  const count = blogs.filter((b) => b.category?.toLowerCase() === topic.name.toLowerCase()).length;
                  return (
                    <button
                      key={topic.name}
                      onClick={() => setActiveFilter(topic.name)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-slate-650 hover:text-slate-950 py-1.5 transition-colors group cursor-pointer"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">{topic.label}</span>
                      <span className="bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-[#315cf0] transition-colors">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Have a story to share? */}
            <div className="bg-gradient-to-br from-[#eff6ff] to-[#f3e8ff] border border-blue-100/50 rounded-2xl p-6">
              <h3 className="text-sm font-extrabold text-[#315cf0] mb-2">Have a story to share?</h3>
              <p className="text-xs text-slate-650 leading-relaxed mb-4">
                We'd love to feature your clinic's journey and success stories with our growing medical community.
              </p>
              <a
                href="mailto:support@queuecure.com"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#315cf0] hover:text-blue-800 group"
              >
                Get in touch
                <FiArrowRight className="group-hover:translate-x-0.5 transition-transform duration-250" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogPage;
