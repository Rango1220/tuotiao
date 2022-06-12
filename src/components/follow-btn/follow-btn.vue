<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    :loading="loading"
    @click="onFollow"
    size="small"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    @click="onFollow"
    type="info"
    color="#3296fa"
    :loading="loading"
    round
    size="small"
    icon="plus"
    >关注</van-button
  >
</template>
<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowBtn',
  model: {
    prop: 'isFollowed',
    event: 'update-is_followed'
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onFollow() {
      this.loading = true
      try {
        if (this.isFollowed) {
          await deleteFollow(this.userId)
        } else {
          await addFollow(this.userId)
        }
        // this.article.is_followed = !this.article.is_followed
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        let message = 'caozuoshibai'
        if (err.response && err.response.status === 400) {
          message = "you can't focus yourself~"
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>
<style scoped lang='less'>
</style>
