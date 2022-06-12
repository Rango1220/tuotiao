// postcss.config.js
module.exports = {
  // 配置要使用的postcss插件
  plugins: {
    // 把px转换为rem
    // * 表示所有
    'postcss-pxtorem': {
      // lib-flexible的 rem适配方案:把一行分为10份,每份十分之一
      // rootValue应该设计为设计稿宽度的十分之一
      // 但是vant建议设置为37.5 因为van是基于375写的
      // 我们的设计稿宽度是750 所以使用设计稿的时候尺寸要除以二
      // 有没有更好的办法?
      // 如果是vant的样式,按照37.5转换.如果是我们自己的样式,按照75转换
      // rootValue支持数字/函数  函数可以动态处理返回值

      // 函数：动态计算返回

      // postcss-pxtorem 处理每个 CSS 文件的时候都会来调用这个函数
      // 它会把被处理的 CSS 文件相关的信息通过参数传递给该函数

      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],

      exclude: 'github-markdown'
    }
  }
}
