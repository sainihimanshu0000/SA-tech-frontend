import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  IoArrowBack, IoTime, IoPerson, IoCalendar,
  IoHeart, IoHeartOutline, IoChatbubble, IoShare,
  IoLogoWhatsapp, IoLogoTwitter, IoLogoFacebook,
  IoCopy, IoCheckmarkCircle
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getBlogPostBySlug, getRelatedPosts, likeBlogPost, addBlogComment } from '../api/blogAPI';

export default function BlogPost() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await getBlogPostBySlug(slug);
      setPost(response.data);
      setComments(response.data.comments || []);
      
      // Check if user liked this post
      if (user && response.data.likes?.includes(user._id)) {
        setLiked(true);
      }
      
      // Fetch related posts
      if (response.data._id) {
        const related = await getRelatedPosts(response.data._id);
        setRelatedPosts(related.data || []);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      await likeBlogPost(post._id);
      setLiked(!liked);
      setPost(prev => ({ 
        ...prev, 
        likes: liked 
          ? prev.likes.filter(id => id !== user._id) 
          : [...(prev.likes || []), user._id] 
      }));
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const response = await addBlogComment(post._id, { 
        content: comment,
        userName: user.name 
      });
      setComments([response.data, ...comments]);
      setComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog post not found</h2>
          <Link 
            to="/blog" 
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition-colors"
        >
          <IoArrowBack /> Back to Blog
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Image */}
          {post.image && (
            <div className="relative h-96 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {post.featured && (
                <span className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Featured
                </span>
              )}
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-2">
                <IoCalendar className="text-green-600" /> 
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span className="flex items-center gap-2">
                <IoPerson className="text-green-600" /> 
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <IoTime className="text-green-600" /> 
                {post.readTime || '5'} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <div className="text-xl text-gray-600 mb-8 italic border-l-4 border-green-600 pl-6">
                {post.excerpt}
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-green-600 mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${tag}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-8 border-t">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    liked 
                      ? 'text-red-600 bg-red-50' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {liked ? <IoHeart className="text-xl" /> : <IoHeartOutline className="text-xl" />}
                  <span>{post.likes?.length || 0}</span>
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <IoChatbubble className="text-xl" /> 
                  <span>{comments.length}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition relative"
                >
                  {copied ? <IoCheckmarkCircle className="text-xl text-green-600" /> : <IoShare className="text-xl" />}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <IoLogoWhatsapp className="text-xl" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <IoLogoTwitter className="text-xl" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <IoLogoFacebook className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

          {/* Comment Form */}
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isAuthenticated ? "Share your thoughts..." : "Please login to comment"}
              disabled={!isAuthenticated}
              rows="4"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
            <button
              type="submit"
              disabled={!isAuthenticated || !comment.trim()}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {comment.userName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{comment.userName || 'Anonymous'}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(related => (
                <Link 
                  key={related._id} 
                  to={`/blog/${related.slug}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
                >
                  {related.image && (
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={related.image} 
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(related.publishedAt || related.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}