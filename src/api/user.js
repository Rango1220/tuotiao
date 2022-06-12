// 用户相关请求模块
import request from '@/utils/request'

export const login = (data) => {
  return request({
    method: 'POST',
    url: 'v1_0/authorizations',
    data: data
  })
}
export const getSmsCode = mobile => {
  return request({
    method: 'GET',
    url: `v1_0/sms/codes/${mobile}`
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: 'v1_0/user'
    // // 发送请求头数据
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取频道列表

export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: 'v1_0/user/channels'
  })
}

/**
 * 添加关注
 */
export const addFollow = userId => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: { userId }
  })
}

/**
 * 取消关注
 */
export const deleteFollow = userId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${userId}`
  })
}

// 获取用户个人资料

export const getUserProfile = target => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

// 更新用户资料

export const updateUserProfile = data => {
  return request({
    method: 'patch',
    url: '/v1_0/user/profile',
    data
  })
}

// 更新用户头像
export const updatePhoto = data => {
  return request({
    method: 'patch',
    url: 'v1_0/user/photo',
    data
  })
}
