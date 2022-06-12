<template>
  <van-icon
    :name="isLiked === 1 ? 'good-job' : 'good-job-o'"
    :class="{ liked: isLiked === 1 }"
    @click="onLike"
    :loading="loading"
  />
</template>
<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  model: {
    prop: 'isLiked',
    event: 'update-id_liked'
  },
  props: {
    isLiked: {
      type: Number,
      required: true
    },
    articleId: {
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
    async onLike() {
      // 两个作用：1、交互提示 2、防止网络慢用户连续不断的点击按钮请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      this.loading = true
      try {
        if (this.isLiked === 1) {
          await deleteLike(this.articleId)
          this.$emit('update-id_liked', -1)
          this.$toast.success('取消点赞')
        } else {
          await addLike(this.articleId)
          this.$emit('update-id_liked', 1)
          this.$toast.success('点赞成功')
        }
      } catch (err) {}
      this.loading = false
    }
  }
}
</script>
<style scoped lang='less'>
.liked {
  color: #e5645f !important;
}
</style>
