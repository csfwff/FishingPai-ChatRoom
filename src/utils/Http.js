import axios from 'axios';

let baseUrl = 'https://pwl.icu/';


axios.defaults.timeout = 20000;
axios.defaults.withCredentials = true;

export default function request(url, data, config, cookie) {

  // axios.interceptors.request.use(function (config) {
  //   console.warn("request config:", config);
  //   config.headers.Cookie = cookie;
  //   return config;
  // }, function (error) {
  //   return Promise.reject(error);
  // })

  return axios.post(baseUrl + url, data, config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      return error;
    });
}