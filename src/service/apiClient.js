import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7117/api"
});

apiClient.interceptors.request.use((config) => {
  config.headers["TokenAuthorization"] = "BIUSHDFSDF823747234WBJDFSDFA8888738B"

  return config;
});

export default apiClient;