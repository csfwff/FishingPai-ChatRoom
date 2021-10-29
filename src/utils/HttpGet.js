import axios from 'axios';

let baseUrl = 'https://pwl.icu/';

axios.defaults.timeout = 20000;

export default function request(url, data) {
  return axios.get(baseUrl + url, data )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      return error;
    });
}