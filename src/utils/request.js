import axios from "axios";
import store from "@/store/index";
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false,
  timeout: 25000
});

service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== "20000") {
      store.commit("snackbar/SHOW_MESSAGE", {
        color: "error",
        text: res.message
      });
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
