<template>
  <div class="search-container">
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      @search="onSearch"
      :search-text="searchText"
      v-else-if="searchText"
    />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history
      @delete-history="searchHistories.splice($event, 1)"
      @clear-search-histories="searchHistories = []"
      :search-histories="searchHistories"
      @search="onSearch($event)"
      v-else
    />
    <!-- /搜索历史记录 -->
  </div>
</template>
<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data() {
    return {
      searchText: '',
      isResultShow: false,

      searchHistories: getItem('search-histories') || []
    }
  },
  watch: {
    searchHistories(val) {
      // 同步到本地存储
      setItem('search-histories', val)
    }
  },
  methods: {
    onSearch(val) {
      this.searchText = val

      // 存储历史记录
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>
<style scoped lang='less'>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
