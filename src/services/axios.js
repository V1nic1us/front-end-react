import axios from 'axios';

const url = process.env.REACT_APP_API_URL;
const token = process.env.REACT_APP_TOKEN;

export default axios.create({
  baseURL: url,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
