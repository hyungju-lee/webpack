class MyWebpackPlugin {
    apply(compiler) {
        // 플러그인이 종료되었을 때 실행되는 함수
        // compiler.hooks.done.tap('My Plugin', stats => {
        //     console.log('MyPlugin: done');
        // })

        compiler.plugin('emit', (compilation, callback) => { // compiler.plugin()
            const source = compilation.assets['main.js'].source();

            compilation.assets['main.js'].source = () => {
               const banner = [
                   '/**',
                   ' * 이것은 BannerPlugin이 처리한 결과입니다.',
                   ' * Build Date: 2019-10-10',
                   ' */'
               ].join('\n');
               return banner + '\n\n' + source;
            }

            callback();
        })
    }
}

module.exports = MyWebpackPlugin;