import http from './http'

export default {
  emailcode (data) {
    return http.post('/api/user/emailcode', data)
  },
  register (data) {
    return http.post('/api/user/register', data)
  },
  login (params) {
    return http.get('/api/user/login', params)
  },
  changepassword(data){
    return http.post('/api/user/changepassword', data)
  },
  gettsttoken(params){
    return http.get('/api/AliOss/gettsttoken', params)
  }
}