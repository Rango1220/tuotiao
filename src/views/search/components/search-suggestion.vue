<template>
  <div class="search-suggestion">
    <van-cell
      :key="i"
      v-for="(sug, i) in suggestions"
      icon="search"
      @click="$emit('search', sug)"
    >
      <div slot="title" v-html="'' || highlight(sug, searchText)"></div>
    </van-cell>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { getSearchSuggestion } from '@/api/search'
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  components: {},
  data() {
    return {
      suggestions: []
    }
  },
  computed: {},
  watch: {
    searchText: {
      // handler(value) {
      //   this.loadSearchSuggestion(value)
      // },
      handler: debounce(function (value) {
        this.loadSearchSuggestion(value)
      }, 300),
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestion(q) {
      try {
        const { data } = await getSearchSuggestion(q)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('fail')
      }
    },
    highlight(text, keyword) {
      const hlstr = `<span class="active">${this.searchText}</span>`
      const reg = new RegExp(keyword, 'gi')
      const res = text.replace(reg, hlstr)
      if (res) {
        return res
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
