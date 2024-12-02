import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts';

export const fetchPosts = () => axios.get(API_URL);
export const createPost = (data, token) =>
    axios.post(API_URL, data, { headers: { Authorization: `Bearer ${token}` } });
export const fetchPost = (id) => axios.get(`${API_URL}/${id}`);
export const login = (credentials) => axios.post('http://localhost:5000/api/login', credentials);
