import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle, Send, Plus, Image, User, Loader2, X, Calendar, Clock, ThumbsUp } from "lucide-react";
import Footer from './Footer';
import Header from './Header';

const DiscussionPage = () => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [newPostContent, setNewPostContent] = useState("");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openComments, setOpenComments] = useState(null); 

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://deployment-mcmr.onrender.com/api/v1/post/get-posts", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(`https://deployment-mcmr.onrender.com/api/v1/post/like/${postId}`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]) return;
    try {
      await axios.post(`https://deployment-mcmr.onrender.com/api/v1/post/comment/${postId}`, {
        text: commentText[postId],
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setCommentText({ ...commentText, [postId]: "" });
      fetchPosts();
    } catch (error) {
      console.error("Error commenting:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsSubmitting(true);
    try {
      await axios.post("https://deployment-mcmr.onrender.com/api/v1/post/create", {
        content: newPostContent,
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setNewPostContent("");
      setIsCreatingPost(false);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleComments = (postId) => {
    setOpenComments(openComments === postId ? null : postId);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto p-4 pt-8 pb-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Discussions</h1>
            <p className="text-gray-500 mt-1">Join the conversation with our community</p>
          </div>
          <button 
            onClick={() => setIsCreatingPost(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus size={18} />
            <span className="font-medium">New Post</span>
          </button>
        </div>

        {/* Posts */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={30} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600 font-medium">Loading discussions...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mb-4 text-gray-400">
              <MessageCircle size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No discussions yet</h3>
            <p className="text-gray-500 mb-6">Be the first to start a conversation!</p>
            <button 
              onClick={() => setIsCreatingPost(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 transition-all duration-200 shadow-md"
            >
              <Plus size={18} />
              <span className="font-medium">Create Post</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{post.user.name}</div>
                      <div className="flex items-center text-xs text-gray-500 gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {post.createdAt ? formatDate(post.createdAt) : "Recent"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="cursor-pointer" onClick={() => toggleComments(post._id)}>
                    <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
                  </div>

                  {/* Like and Comment Buttons */}
                  <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => handleLike(post._id)} 
                      className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                        post.likes.length > 0 ? "text-blue-600 hover:bg-blue-50" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <ThumbsUp size={18} className={post.likes.length > 0 ? "fill-blue-600" : ""} /> 
                      <span>{post.likes.length}</span>
                    </button>
                    <button 
                      onClick={() => toggleComments(post._id)} 
                      className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                        openComments === post._id ? "text-blue-600 hover:bg-blue-50" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <MessageCircle size={18} className={openComments === post._id ? "fill-blue-600" : ""} /> 
                      <span>{post.comments.length}</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {openComments === post._id && (
                  <div className="bg-gray-50 p-5 border-t border-gray-100">
                    <h3 className="font-medium text-gray-700 mb-3">
                      {post.comments.length > 0 
                        ? `${post.comments.length} Comment${post.comments.length > 1 ? 's' : ''}` 
                        : 'No comments yet'}
                    </h3>
                    
                    {post.comments.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {post.comments.map((comment, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white">
                                <User size={14} />
                              </div>
                              <span className="font-medium text-sm text-gray-800">{comment.user.name}</span>
                            </div>
                            <p className="text-gray-700 text-sm pl-9">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white shrink-0">
                        <User size={16} />
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText[post._id] || ""}
                          onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                          className="w-full border border-gray-200 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <button
                          onClick={() => handleComment(post._id)}
                          disabled={!commentText[post._id]}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors ${
                            !commentText[post._id] ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Post Modal */}
        {isCreatingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Post</h2>
                <button 
                  onClick={() => setIsCreatingPost(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <textarea 
                value={newPostContent} 
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full border border-gray-200 rounded-xl p-4 min-h-[150px] mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-none"
              />
              <div className="flex justify-between items-center">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Image size={20} />
                  <span className="font-medium">Add Image</span>
                </button>
                <button 
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || isSubmitting}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                    !newPostContent.trim() || isSubmitting ? "opacity-50 cursor-not-allowed" : "shadow-md hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span className="font-medium">Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DiscussionPage;