import axios from 'axios';
// import { tokenConfig } from 'stores/UtilsActions';
import { server } from 'config';
// import config from '../config';

function getIRequestProp(isMultipart) {
  const serverUrl = server;
  const token = JSON.parse(localStorage.getItem('ot_access_id'));
  // const headers = tokenConfig();
  return {
    serverUrl: serverUrl,
    requestHeader: {
      'Content-Type': isMultipart
        ? 'multipart/form-data'
        : 'application/json',

      Authorization: `Bearer ${token}`,
    },
  };
}

async function get(url, parameter, isLocalServer) {
  const { serverUrl, requestHeader } = getIRequestProp();
  return axios.get(serverUrl + url, {
    params: parameter,
    headers: requestHeader,
  });
}

// async function post(url, body, isJsonServer, isMultipart) {
//   const {serverUrl, requestHeader} = getIRequestProp(isJsonServer, isMultipart);
//
//   return axios.post(serverUrl + url, body, {
//     headers: requestHeader
//   });
// }
// async function put(url, body, isJsonServer) {
//   const {serverUrl, requestHeader} = getIRequestProp(isJsonServer);
//   return axios.put(serverUrl + url, body, {
//     headers: requestHeader
//   });
// }
//
// async function patch(url, body, isJsonServer) {
//   const {serverUrl, requestHeader} = getIRequestProp(isJsonServer);
//   return axios.patch(serverUrl + url, body, {
//     headers: requestHeader
//   });
// }
//
// async function remove(url, body, isJsonServer) {
//   const {serverUrl, requestHeader} = getIRequestProp(isJsonServer);
//   return axios.delete(serverUrl + url, {
//     data: body,
//     headers: requestHeader
//   });
// }
const AxiosServices = {
  get,
  // post,
  // put,
  // patch,
  // remove
};

export default AxiosServices;
