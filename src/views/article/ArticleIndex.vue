<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      @click-left="$router.back()"
      left-arrow
      title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.art_id" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- :is-followed="article.is_followed"
            @update-is_followed="article.is_followed = $event" -->

          <follow-btn
            v-model="article.is_followed"
            :user-id="article.aut_id"
            class="follow-btn"
          />
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            :loading="followLoading"
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
            :loading="followLoading"
            round
            size="small"
            icon="plus"
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="articleContentRef"
        ></div>
        <van-divider>正文结束</van-divider>

        <article-comment
          @onload-success="totalCommentCount = $event.total_count"
          :source="article.art_id"
          :list="commentList"
          @update_list="commentList.push(...$event)"
        ></article-comment>

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            @click="isPostShow = true"
            round
            size="small"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="totalCommentCount" color="#777" />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          ></collect-article>
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <like-article
            v-model="article.attitude"
            :article-id="article.art_id"
          ></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论 -->
        <van-popup v-model="isPostShow" closeable position="bottom">
          <comment-post
            @post-success="onPostSuccess"
            :target="article.art_id"
          ></comment-post>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { addFollow, deleteFollow } from '@/api/user'
import FollowBtn from '@/components/follow-btn/follow-btn'
import CollectArticle from '@/components/collect-article/collect-article'
import LikeArticle from '@/components/like-article/like-article'
import ArticleComment from '@/views/article/article-comments/article-comment'
import CommentPost from '@/views/article/article-comments/comment-post'
// import { ImagePreview } from 'vant'
// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   startPosition: 1,
//   onClose() {
//     console.log('onclose')
//   }
// })

export default {
  name: 'ArticleIndex',
  components: {
    FollowBtn,
    CollectArticle,
    LikeArticle,
    ArticleComment,
    CommentPost
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      article: {},
      loading: true,
      errStatus: 0,
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false,
      commentList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      try {
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
        console.log(data)
        setTimeout(() => {
          this.previewImage()
        }, 0)
        // this.$nextTick(this.previewImage())
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        console.log('err', err)
      }
      this.loading = false
    },
    previewImage() {
      console.log(this.$refs.articleContentRef)
      // const articleContent = this.$refs.articleContentRef
      // const imgs = articleContent.querySelector('img')
      // console.log(imgs)
    },
    async onFollow() {
      this.followLoading = true
      try {
        if (this.article.is_followed) {
          await deleteFollow(this.article.aut_id)
        } else {
          await addFollow(this.article.aut_id)
        }
        this.article.is_followed = !this.article.is_followed
      } catch (err) {
        let message = 'caozuoshibai'
        if (err.response && err.response.status === 400) {
          message = "you can't focus yourself~"
        }
        this.$toast(message)
      }
      this.followLoading = false
    },
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false

      // 将发布的内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    /deep/ .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
