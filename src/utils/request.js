// 单独封装请求axios
import axios from 'axios'
import { useUserStore } from '@/stores'
import { closeToast, showFailToast, showLoadingToast } from 'vant'
import 'vant/es/toast/style'
// 请求基础url
const baseurl = 'https://95ac-116-22-23-243.ngrok-free.app'
const baseapiurl = baseurl + '/api'

// axios实例
const axiosInstance = axios.create({
  baseURL: baseapiurl,
  timeout: 10000
})

// 添加拦截器
// 添加请求拦截器
axiosInstance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 请求前统一添加toast提示
    showLoadingToast({
      message: '请求中...',
      forbidClick: true, // 禁止触摸背景，可以当成节流来使用。
      duration: 20 * 1000 // toast展示最大时长（不要设置成0，无限不就卡死了?）
    })
    // 统一在请求前添加token
    config.headers['Authorization'] = useUserStore().token
    // 丢你妈的ngrok...
    config.headers['ngrok-skip-browser-warning'] = 'true'
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    // 添加统一处理非200状态码错误提示
    // console.log(response)
    const data = response.data
    // 后端返回的code字段非0表示不正常
    if (
      (response.status === 200 || response.status === 201) &&
      data.code === 0
    ) {
      closeToast()
      return data // (axios会多包装一层data，提前在响应前拦截并返回，减少后面需要resp.data.data之类的调用...)
    } else {
      showFailToast(data.message + 'what?' || '未知错误')
      return Promise.reject(data.message)
    }
  },
  function (error) {
    // 对响应错误做点什么
    showFailToast(error.response.data.message || '服务器异常')
    return Promise.reject(error)
  }
)

// 导出默认
export default axiosInstance
export { baseurl }
