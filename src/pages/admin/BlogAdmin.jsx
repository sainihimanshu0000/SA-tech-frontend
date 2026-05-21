import React, { useState, useEffect } from 'react';
import { 
  IoAdd, IoCreate, IoTrash, IoEye, IoClose,
  IoDocument, IoCalendar, IoPerson, IoSearch,
  IoCheckmarkCircle, IoAlert, IoTime, IoRefresh,
  IoCloudUpload
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import {
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '../../api/blogAPI';

const BLOG_CATEGORIES = [
  'Farming Tips',
  'Subsidy',
  'Technology',
  'Solar',
  'Organic',
  'Success Stories'
];

export default function BlogAdmin() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    image: '',
    author: user?.name || 'Admin',
    isPublished: false,
    featured: false
  });

  // Fetch all blog posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogPosts({ 
        limit: 50,
        showAll: 'true'
      });
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.content || !formData.category) {
      toast.error('Please fill all required fields');
      return;
    }

    // Process tags
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);

    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      category: formData.category,
      tags: tagsArray,
      image: formData.image,
      author: formData.author || user?.name || 'Admin',
      isPublished: formData.isPublished,
      featured: formData.featured || false
    };

    console.log('Submitting post data:', postData);

    try {
      if (editingPost) {
        await updateBlogPost(editingPost._id, postData);
        toast.success('Blog post updated successfully!');
      } else {
        await createBlogPost(postData);
        toast.success('Blog post created successfully!');
      }
      
      setShowForm(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save blog post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      category: post.category || '',
      tags: post.tags?.join(', ') || '',
      image: post.image || '',
      author: post.author || user?.name || 'Admin',
      isPublished: post.isPublished || false,
      featured: post.featured || false
    });
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deleteBlogPost(postId);
      toast.success('Blog post deleted successfully!');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete blog post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      image: '',
      author: user?.name || 'Admin',
      isPublished: false,
      featured: false
    });
  };

  const getStatusBadge = (isPublished) => {
    return isPublished 
      ? 'bg-green-100 text-green-700' 
      : 'bg-yellow-100 text-yellow-700';
  };

  const togglePublish = async (post) => {
    try {
      await updateBlogPost(post._id, { 
        ...post, 
        isPublished: !post.isPublished 
      });
      toast.success(`Post ${!post.isPublished ? 'published' : 'unpublished'} successfully!`);
      fetchPosts();
    } catch (error) {
      toast.error('Failed to update post status');
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
            <p className="text-gray-500 mt-1">Create and manage your blog posts</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchPosts}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
            >
              <IoRefresh /> Refresh
            </button>
            <button
              onClick={() => {
                setEditingPost(null);
                resetForm();
                setShowForm(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <IoAdd /> New Post
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts by title, category or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Blog Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter blog title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Category</option>
                      {BLOG_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (Short Description)
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Brief description of the post..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content * (HTML supported)
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="10"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                    placeholder="Write your blog content here... You can use HTML tags"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={formData.image} 
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100?text=Error';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="farming, organic, tips"
                  />
                </div>

                {/* Settings */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="isPublished"
                          checked={!formData.isPublished}
                          onChange={() => setFormData(prev => ({ ...prev, isPublished: false }))}
                          className="w-4 h-4 text-gray-600"
                        />
                        <span className="text-sm">Draft</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="isPublished"
                          checked={formData.isPublished}
                          onChange={() => setFormData(prev => ({ ...prev, isPublished: true }))}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm">Published</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    id="featured"
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Feature this post (show on homepage)
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPost(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blog Posts Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6">Title</th>
                    <th className="text-left py-4 px-6">Category</th>
                    <th className="text-left py-4 px-6">Author</th>
                    <th className="text-left py-4 px-6">Status</th>
                    <th className="text-left py-4 px-6">Date</th>
                    <th className="text-left py-4 px-6">Views</th>
                    <th className="text-left py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map(post => (
                    <tr key={post._id} className="border-t hover:bg-gray-50 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {post.image && (
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">{post.title}</p>
                            <p className="text-sm text-gray-500">{post.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-1">
                          <IoPerson className="text-gray-400" /> {post.author}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(post.isPublished)}`}>
                            {post.isPublished ? 'Published' : 'Draft'}
                          </span>
                          <button
                            onClick={() => togglePublish(post)}
                            className={`p-1 rounded transition ${
                              post.isPublished 
                                ? 'text-yellow-600 hover:bg-yellow-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={post.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {post.isPublished ? <IoTime /> : <IoCheckmarkCircle />}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {post.views || 0}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Post"
                          >
                            <IoEye size={18} />
                          </a>
                          <button
                            onClick={() => handleEdit(post)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Edit Post"
                          >
                            <IoCreate size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Post"
                          >
                            <IoTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <IoDocument className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">No blog posts found</p>
                <button
                  onClick={() => {
                    setEditingPost(null);
                    resetForm();
                    setShowForm(true);
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Create Your First Post
                </button>
              </div>
            )}

            {/* Summary */}
            {filteredPosts.length > 0 && (
              <div className="border-t px-6 py-4 bg-gray-50 text-sm text-gray-500">
                Showing {filteredPosts.length} of {posts.length} total posts
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}