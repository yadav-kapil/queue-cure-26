import { useState, useCallback } from "react";

const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch blogs");
      }
      setBlogs(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBlogById = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/blogs/${id}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch blog post");
      }
      setCurrentBlog(data.data);
      return data.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    blogs,
    currentBlog,
    isLoading,
    error,
    fetchBlogs,
    fetchBlogById,
  };
};

export default useBlogs;
