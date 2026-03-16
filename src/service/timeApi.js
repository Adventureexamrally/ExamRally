// api/timeApi.js
import Api from './Api'; // Your configured axios instance or API client

export const fetchUtcNow = () => {
  return Api.get('/utc-now')
    .then(response => {
      const globalDate = new Date(response.data.utc_datetime);
      return globalDate;
    });
};
