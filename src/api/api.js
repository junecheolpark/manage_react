import axios from "axios";

export const api = axios.create({
  // baseURL: 'http://localhost:8090',
});

let requestObject = {};

api.interceptors.request.use(  
  (config) => {
    if (config.method === 'post') {
      const key = `${config.url}$${JSON.stringify(config.params)}`;
      if (requestObject[key]) {
        // throw new Error('이전 작업 처리중입니다.\n잠시 후 다시 시도해주세요');
      } else {
        requestObject[key] = new Date();
      }
    }
    return config;
  }
);

api.interceptors.response.use(
  (response) => {
    if(response.data.status ===  200) {
      requestObject = {};
    }
    return response;
  }
)

// export const app_api = axios.create({
//   baseURL: 'https://api.example.com',
// });