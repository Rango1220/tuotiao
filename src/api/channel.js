import request from '@/utils/request'

export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

// 添加用户频道

export const addUserChannel = (channel) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: { channels: [channel] }
  })
}

export const deleteUserChannel = (channel) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channel.id}`

  })
}
