import axios from 'axios'
import {
  Message,
  Loading
} from 'element-ui'
import _ from 'lodash'
var apiServe = require('../request/apiServe')

// loading对象
let loading
// 当前正在请求的数量
let needLoadingRequestCount = 0

function showLoading() {
  // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
  // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
  if (needLoadingRequestCount === 0 && !loading) {
    loading = Loading.service({
      lock: true,
      text: 'Loading...',
      background: 'rgba(192, 192, 192, 0.5)',
      target: 'body'
    })
  }
  needLoadingRequestCount++
}
// 隐藏loading
function hideLoading() {
  needLoadingRequestCount--
  needLoadingRequestCount = Math.max(needLoadingRequestCount, 0) // 做个保护
  if (needLoadingRequestCount === 0) {
    // 关闭loading
    toHideLoading()
  }
}
// 防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
var toHideLoading = _.debounce(() => {
  loading.close()
  loading = null
}, 500)
// axios封装formdata
export const axiosFormData = async ({
  url,
  data
}) => {
  axios.interceptors.request.use(config => {
    showLoading()
    return config
  }, error => {
    hideLoading()
    Message.error('请求超时!')
    Promise.reject(error)
  })

  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    switch (response.data.code) {
      case 401301:
        Message.error('邮箱格式错误!')
        break
      case 401302:
        Message.error('密码格式错误!')
        break
      case 401510:
        Message.error('邮箱或密码不正确!')
        break
    }
    hideLoading()
    return response;
  }, function (error) {
    hideLoading()
    /** *** 接收到异常响应的处理开始 *****/
    if (error && error.response) {
      // 1.公共错误处理
      // 2.根据响应码具体处理
      switch (error.response.status) {
        case 400:
          Message.error('错误请求!')
          break
        case 401:
          Message.error('未授权，请重新登录!')
          break
        case 403:
          Message.error('拒绝访问!')
          break
        case 404:
          Message.error('请求错误,未找到该资源!')
          break
        case 405:
          Message.error('请求方法未允许!')
          break
        case 408:
          Message.error('请求超时!')
          break
        case 500:
          Message.error('服务器端出错!')
          break
        case 501:
          Message.error('网络未实现!')
          break
        case 502:
          Message.error('网络错误!')
          break
        case 503:
          Message.error('服务不可用!')
          break
        case 504:
          Message.error('网络超时!')
          break
        case 505:
          Message.error('http版本不支持该请求!')
          break
        default:
          Message.error(error.response.status)
      }
    } else {
      // 超时处理
      if (JSON.stringify(error).includes('timeout')) {
        Message.error('服务器响应超时，请刷新当前页!')
      }
      Message.error('连接服务器失败!')
    }

    Message.error(error)
    console.log('error:', error)
    /** *** 处理结束 *****/
    // 如果不需要错误处理，以上的处理过程都可省略
    return Promise.resolve(error.response)
  });

  let results = await axios({
    method: 'post',
    url: process.env.NODE_ENV === 'development' ? `/dev${url}` : `${apiServe.prodServe}${url}`,
    data,
    headers: {
      'authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
  return results
}