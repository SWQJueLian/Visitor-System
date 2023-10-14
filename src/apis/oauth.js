import request from '@/utils/request'

// 获取企业微信ouath授权链接
export const wxWorkGetOAuthURLService = () => {
  return request.get('/oauth/wxwork/')
}

// 获取登录用户信息
export const wxWorkEmployeeInfoService = (code) => {
  return request.get(`/oauth/wxwork/userinfo/`, {
    params: { code }
  })
}
