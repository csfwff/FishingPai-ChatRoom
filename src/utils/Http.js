import axios from 'axios';

let baseUrl = 'https://pwl.icu/';


axios.defaults.timeout = 20000;

export default function request(url, data,config) {
  return axios.post(baseUrl + url, data,config )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      return error;
    });
}