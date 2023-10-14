import request from '@/utils/request'

// 添加邀请
export const inviteAddService = (data) => {
  return request.post('/invite/create/', data)
}
