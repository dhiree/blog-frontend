import  { useState, useEffect } from 'react';
import axios from 'axios';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [postDetails, setPostDetails] = useState(null);

    const API_URL = 'http://localhost:5001/api/posts';

    // Fetch all posts
    useEffect(() => {
        axios.get(API_URL)
            .then((res) => setPosts(res.data))
            .catch((err) => setError('Failed to load posts',err));
    }, []);

    // Login functionality
    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5001/api/login', { username, password })
            .then((res) => {
                setToken(res.data.token);
                setError('');
            })
            .catch(() => setError('Invalid username or password'));
    };

    // Create a new post
    const handleCreatePost = (e) => {
        e.preventDefault();
        if (!token) {
            setError('You need to log in first');
            return;
        }
        axios.post(API_URL, { title, content }, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                setPosts([...posts, res.data]);
                setTitle('');
                setContent('');
                setError('');
            })
            .catch(() => setError('Failed to create post'));
    };

    // Fetch post details
    const fetchPostDetails = (id) => {
        axios.get(`${API_URL}/${id}`)
            .then((res) => setPostDetails(res.data))
            .catch(() => setError('Failed to fetch post details'));
    };

    return (
        <div className="App">
            <h1>Blog Platform</h1>

            {/* Login Form */}
            {!token ? (
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
            ) : (
                <p>Logged in successfully</p>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Post Creation Form */}
            {token && (
                <form onSubmit={handleCreatePost}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button type="submit">Create Post</button>
                </form>
            )}

            {/* Display Posts */}
            <div>
                <h2>All Posts</h2>
                {posts.map((post) => (
                    <div key={post.id} onClick={() => fetchPostDetails(post.id)}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>

            {/* Post Details */}
            {postDetails && (
                <div>
                    <h2>Post Details</h2>
                    <h3>{postDetails.title}</h3>
                    <p>{postDetails.content}</p>
                    <p>Created At: {new Date(postDetails.createdAt).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

export default Blog;
