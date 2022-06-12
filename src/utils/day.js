import dayjs from 'dayjs'
import Vue from 'vue'
// dayjs配置中文

import 'dayjs/locale/zh-cn' // 全局使用
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.locale('zh-cn')

dayjs.extend(relativeTime)

// console.log(dayjs().from(dayjs('1990-01-01')))

Vue.filter('relativeTime', value => {
  // return dayjs().to(dayjs(value))
  return dayjs().to(dayjs(value))
})
