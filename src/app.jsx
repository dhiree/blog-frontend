import  { useState, useEffect } from 'react';
import { fetchPosts, createPost, login } from './api'

const App = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Fetch posts when the component loads
    useEffect(() => {
        if (token) {
            fetchPosts()
                .then((res) => setPosts(res.data))
                .catch((err) => setError('Failed to load posts',err));
        }
    }, [token]);

    const handleLogin = (e) => {
        e.preventDefault();
        login({ username, password })
            .then((res) => {
                setToken(res.data.token); 
                setError('');
            })
            .catch((err) => setError('Failed to login',err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!token) {
            setError('You need to log in first');
            return;
        }
        createPost({ title, content }, token)
            .then((res) => setPosts([...posts, res.data]))
            .catch((err) => setError('Failed to create post',err));
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
                <form onSubmit={handleSubmit}>
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
                {posts.map((post) => (
                    <div key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
