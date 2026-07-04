# YouTube 自动展开帖子与评论

自动点击 YouTube 帖子和评论区里的“了解详情 / Read more / Show more”按钮，直接显示完整内容。

## 功能

- 支持 YouTube 社区帖子内容自动展开。
- 支持 YouTube 评论内容自动展开。
- 支持 YouTube 单页应用路由切换、滚动加载、动态插入内容。
- 油猴菜单提供“自动展开：开 / 关”切换，默认开启。

## 安装

1. 安装脚本管理器：
   - [Tampermonkey](https://www.tampermonkey.net/)
   - [Violentmonkey](https://violentmonkey.github.io/)
2. 打开 [`youtube-auto-expand.user.js`](./youtube-auto-expand.user.js)。
3. 复制或导入到脚本管理器后刷新 YouTube 页面。

## 适配范围

- `https://www.youtube.com/*`
- `https://m.youtube.com/*`

脚本只会在帖子和评论容器内查找展开按钮，避免误点视频简介或评论回复列表的其它“显示更多”按钮。

## License

MIT
