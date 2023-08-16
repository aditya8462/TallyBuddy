import axios from 'axios';
// const ServerURL = 'https://campusshala.com:3018';
const ServerURL ='http://31.220.109.117:5000'
// const ServerURL =
//   'https://7ca4-2405-201-3015-c0ae-f9c2-43e4-5174-2ac8.ngrok.io';

const getData = async url => {
  try {
    console.log(url);
    var response = await axios.get(`${ServerURL}/${url}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    if (error?.response?.data) {
      return error.response.data;
    }
    return {status: false};
  }
};

const getToken = async url => {
  var response = await fetch(`${ServerURL}/admin/getToken`);
  var result = await response.json();
  return result.token;
};

const isValidAuth = async url => {
  try {
    var token = await getToken();
   
    var response = await fetch(`${ServerURL}/admin/isUserAuth`, {
      headers: {authorization: token},
    });
    var result = await response.json();
    return result;
  } catch (e) {
    return null;
  }
};

const postDataAxios = async (url, body) => {
  try {
    var response = await axios.post(`${ServerURL}/${url}`, body, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    console.log(response.data);
    var result = await response.data;
    return result;
  } catch (error) {
    console.log(error.response.data);

    return false;
  }
};

const postData = async (url, body) => {
  try {
    console.log(body);
    var response = await axios.post(`${ServerURL}/${url}`, body);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);

    return false;
  }
};

const putData = async (url, body) => {
  try {
    console.log(url,body);
    var response = await axios.put(`${ServerURL}/${url}`, body);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response);

    return false;
  }
};

const putDataAxios = async (url, body) => {
  try {
    console.log(url);
    var response = await axios.put(`${ServerURL}/${url}`, body, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);

    return false;
  }
};

const deleteData = async (url, body) => {
  try {
    console.log(url);
    var response = await axios.delete(`${ServerURL}/${url}`, body);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);

    return false;
  }
};

export {
  ServerURL,
  postData,
  getData,
  isValidAuth,
  postDataAxios,
  putData,
  deleteData,
  putDataAxios,
};
