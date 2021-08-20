module.exports = {
  chainWebpack: config => {
    // firebase-loader の設定
    config.module.rule('firebase')
      .test(/firebase-config\.json$/)
      .use('firebase-config')
      .loader('./firebase-config-loader')
      .end()
    // ts-loader の設定
    config.module.rule('type-script')
      .test(/\.tsx?$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({ transpileOnly: true, appendTsSuffixTo: [/\.vue$/] })
      .end()
  },
  pages: {
    index: {
      entry: 'src/main.js', // エントリーポイントとなるjs
      template: 'public/index.html', // テンプレートのHTML
      filename: 'index.html' // build時に出力されるファイル名
    },
    subscreen: {
      entry: 'src/subscreen/main.js',
      template: 'public/subscreen.html',
      filename: 'subscreen/index.html'
    }
  }
}
