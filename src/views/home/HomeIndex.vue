<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>

    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :key="channel.id"
        v-for="channel in channels"
        :title="channel.name"
      >
        <article-list :channel="channel"></article-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isEditChannelShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      class="edit-channel-popup"
      v-model="isEditChannelShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <channel-edit
        @add-channel="channels.push($event)"
        @update-active="onUpdateActive($event)"
        @delete-channel="onDeleteChannel"
        :my-channels="channels"
        :active-index="active"
      ></channel-edit>
    </van-popup>
    <!-- /频道编辑 -->
  </div>
</template>
<script>
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { getUserChannels } from '@/api/user'
import { getItem } from '@/utils/storage'
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  components: { ArticleList, ChannelEdit },
  data() {
    return {
      active: 0,
      channels: [], // 频道列表
      isEditChannelShow: false
    }
  },
  created() {
    this.loadChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadChannels() {
      try {
        let channels = []
        if (this.user) {
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          const localCHannels = getItem('TOUTIAO_CHANNELS')
          if (localCHannels) {
            channels = localCHannels
          } else {
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdateActive(index, isEditChannelShow = true) {
      this.active = index
      this.isEditChannelShow = isEditChannelShow
    },
    onDeleteChannel(index) {
      // console.log(channel)
      // console.log(index)
      this.channels.splice(index, 1)
    }
  }
}
</script>
<style scoped lang='less'>
.home-container {
  padding-bottom: 100px;
  padding-top: 174px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/.channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      width: 66px;
      height: 82px;
      justify-content: center;
      align-items: center;
      background: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
