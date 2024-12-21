import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://alumni-server-${UNIQUE_ID}:3001/api/",
  withCredentials: true,
});



