<template>
  <van-icon
    :name="isCollected ? 'star' : 'star-o'"
    :class="{ collected: isCollected }"
    @click="onCollect"
    :loading="loading"
  />
</template>
<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  model: {
    prop: 'isCollected',
    event: 'update-is_collected'
  },
  props: {
    isCollected: {
      type: Boolean,
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
    async onCollect() {
      this.loading = true
      try {
        if (this.isCollected) {
          await deleteCollect()
        } else {
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('update-is_collected', !this.isCollected)
        this.$toast.success(!this.isCollected ? '收藏成功' : '取消收藏')
      } catch (err) {}
      this.loading = false
    }
  }
}
</script>
<style scoped lang='less'>
.collected {
  color: #ffa550 !important;
}
</style>
