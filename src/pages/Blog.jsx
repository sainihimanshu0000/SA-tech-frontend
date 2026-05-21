import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IoTime, IoPerson, IoArrowForward, IoSearch,
  IoCalendar, IoEye, IoFilter
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { getAllBlogPosts } from '../api/blogAPI';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchPosts();
  }, [pagination.page, selectedCategory]);
  useEffect(() => {
  const checkPosts = async () => {
    try {
      const response = await getAllBlogPosts({ limit: 100, showAll: 'true' });
      console.log('📊 All posts in database:', response.data);
      console.log('📝 Available slugs:', response.data.map(p => ({
        title: p.title,
        slug: p.slug,
        isPublished: p.isPublished
      })));
    } catch (error) {
      console.error('Error checking posts:', error);
    }
  };
  
  checkPosts();
}, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined
      };
      
      const response = await getAllBlogPosts(params);
      const postsData = response.data || [];
      setPosts(postsData);
      
      // Extract unique categories
      const uniqueCategories = ['all', ...new Set(postsData.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 1
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchPosts();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">AgroMart Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Latest farming tips, subsidy updates, and success stories from farmers like you
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white min-w-[180px]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <IoFilter /> Apply Filters
            </button>
          </form>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <article key={post._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
                  {post.image && (
                    <Link to={`/blog/${post.slug}`} className="block h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    </Link>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <IoCalendar /> {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <IoPerson /> {post.author || 'Admin'}
                      </span>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-green-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all group"
                      >
                        Read More <IoArrowForward className="group-hover:translate-x-1 transition" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="mt-4 text-green-600 hover:text-green-700 font-semibold"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}