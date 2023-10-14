import request from '@/utils/request'

// 添加邀请
export const inviteAddService = (data) => {
  return request.post('/invite/create/', data)
}

// 获取访客列表
export const inviteListService = (data) => {
  return request.get('/invite/', {
    params: { ...data }
  })
}

// 获取邀请详情
export const inviteDetailService = (invite_id) => {
  return request.get(`/invite/${invite_id}/`)
}

// 修改邀请
export const inviteUpdateService = (invite_id, data) => {
  return request.put(`/invite/${invite_id}/update/`, data)
}
