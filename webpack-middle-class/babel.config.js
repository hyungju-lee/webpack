module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    chrome: '79', // 크롬 79까지 지원하는 코드를 만든다
                    ie: '11'
                },
                useBuiltIns: 'usage', // entry, false
                corejs: {
                    version: 2 // 최신버전 3
                }
            }
        ]
    ]
}