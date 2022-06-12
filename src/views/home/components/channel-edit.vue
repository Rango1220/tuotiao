<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        size="mini"
        round
        type="danger"
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="gird-item"
        v-for="(channel, index) in myChannels"
        :key="channel.id"
        :text="channel.name"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fixChannels.includes(channel.id)"
          name="clear"
          slot="icon"
        ></van-icon>
        <span
          class="text"
          :class="{ active: index === activeIndex }"
          slot="text"
          >{{ channel.name }}</span
        >
      </van-grid-item>
    </van-grid>
    <van-cell title="频道推荐" :border="false"></van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        class="gird-item"
        v-for="(channel, index) in recommendChannels"
        icon="plus"
        :key="index"
        @click="onAddChannel(channel)"
      >
        <span class="text" slot="text">{{ channel.name }}</span></van-grid-item
      >
    </van-grid>
  </div>
</template>
<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [],
      isEdit: false,
      fixChannels: [0] // 固定频道不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels() {
      const channels = []
      this.allChannels.forEach((channel) => {
        const ret = this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
        if (!ret) {
          channels.push(channel)
        }
      })
      return channels
    }
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {}
    },
    async onAddChannel(channel) {
      this.$emit('add-channel', channel)
      // this.myChannels.push(channel)

      if (this.user) {
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('保存失败 请稍后重试')
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        if (this.fixChannels.includes(index)) {
          return
        }
        this.$emit('delete-channel', index)
        if (index <= this.activeIndex) {
          this.$emit('update-active', this.activeIndex - 1, true)
        }
        this.deleteChannel(channel)
      } else {
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录
          await deleteUserChannel()
        } else {
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败 请稍后重试')
      }
    }
  }
}
</script>
<style scoped lang='less'>
.channel-edit {
  padding-top: 85px;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  .gird-item {
    width: 160px;
    height: 86px;

    /deep/ .van-grid-item__content {
      white-space: nowrap;
      background-color: #f5f5f6;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 28px;

        margin-top: 0;
      }
      .active {
        color: #f85959;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .gird-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .gird-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
