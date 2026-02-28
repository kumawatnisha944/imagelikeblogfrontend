import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "./App.css";

function App() {
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [subs, setSubs] = useState(0);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const currentUser = name;

  // ❤️ Like
  const handleLike = async () => {
    if (!post) return; // ⭐ crash prevent

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/post/like/${post._id}`,
      );
      setLikes(res.data.likes);
    } catch (err) {
      console.log(err);
    }
  };

  // 👎 Dislike
  const handleDislike = async () => {
    if (!post) return;

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/post/dislike/${post._id}`,
    );

    setDislikes(res.data.dislikes);
  };

  // 📤 REAL Share (mobile) + copy fallback (PC)
  const handleShare = async () => {
    if (!post) return;

    const shareData = {
      title: "Nature Image Post",
      text: "Check out this post!",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/post/share/${post._id}`,
      );

      setShares(res.data.shares);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔔 Subscribe
  const handleSubscribe = async () => {
    if (!post) return;

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/post/subscribe/${post._id}`,
    );

    setSubs(res.data.subscribers);
  };

  // 💬 Add Comment
  const addComment = async () => {
    if (!post) return;
    if (name === "" || comment === "") {
      alert("Enter name & comment");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/post/comment/${post._id}`,
        {
          name: name,
          text: comment,
        },
      );

      setComments(res.data.comments);
      setComment("");
    } catch (err) {
      console.log(err);
    }
  };

  // 🗑 Delete Comment
  const deleteComment = async (commentId) => {
    if (!post) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/post/comment/${post._id}/${commentId}`,
      );

      setComments(res.data.comments);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/post`);
      setPost(res.data);
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      setShares(res.data.shares);
      setSubs(res.data.subscribers);
      setComments(res.data.comments); // ⭐ important
    };

    fetchPost();
  }, []);

  // ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
  // LOADING GUARD (VERY IMPORTANT)
  if (!post) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading post...
      </h2>
    );
  }
  // ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
  return (
    <div className="container">
      <div className="post">
        <div className="user">
          <img src="https://i.pravatar.cc/50" alt="profile" />
          <h3>Nature Image</h3>
        </div>

        {/* IMPORTANT: img self-closing in React */}
        <img className="post-img" src={post?.image} alt="nature" />

        <div className="actions">
          <button onClick={handleLike}>❤️ {likes}</button>
          <button onClick={handleDislike}>👎 {dislikes}</button>
          <button onClick={handleShare}>📤 {shares}</button>
          <button onClick={handleSubscribe}>🔔 {subs}</button>
        </div>

        <div className="comment-box">
          <h3>Comments</h3>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="post-btn" onClick={addComment}>
            Post
          </button>

          <div className="comments">
            {comments &&
              comments.map((c) => (
                <div key={c._id} className="single-comment">
                  <div className="comment-top">
                    <span>
                      <b>{c.name}:</b> {c.text}
                    </span>

                    {c.name === currentUser && (
                      <button
                        className="delete-btn"
                        onClick={() => deleteComment(c._id)}
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
