import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => {
  // return axios.get(baseUrl)                      return just the promise obj
  const request = axios.get(baseUrl)            
  return request.then(response => response.data);  // return the 'data' field from the response of the fulfilled promise rather
}

const create = newObject => {
  // return axios.post(baseUrl, newObject)
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)   // return the 'data' field from the response of the fulfilled promise rather
}

const update = (id, newObject) => {
  // return axios.put(`${baseUrl}/${id}`, newObject)
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)   // return the 'data' field from the response of the fulfilled promise rather
}

export default { 
  // getAll: getAll, 
  // create: create, 
  // update: update 
  getAll, 
  create, 
  update 
}