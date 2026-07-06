# YouTube 自动展开帖子与评论

[![安装脚本](https://img.shields.io/badge/安装脚本-Greasy%20Fork-red.svg?style=for-the-badge&logo=tampermonkey)](https://greasyfork.org/scripts/585509)
[![Greasy Fork Version](https://img.shields.io/greasyfork/v/585509?style=for-the-badge&label=版本)](https://greasyfork.org/scripts/585509)
[![Greasy Fork Installs](https://img.shields.io/greasyfork/dt/585509?style=for-the-badge&label=总安装量)](https://greasyfork.org/scripts/585509)
[![Greasy Fork Rating](https://img.shields.io/greasyfork/rating-count/585509?style=for-the-badge&label=评分数)](https://greasyfork.org/scripts/585509/feedback)
[![GitHub](https://img.shields.io/badge/GitHub-源码-blue.svg?style=for-the-badge&logo=github)](https://github.com/codertesla/ytb-more-button)
[![License](https://img.shields.io/github/license/codertesla/ytb-more-button?style=for-the-badge&label=License)](LICENSE)

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
2. 打开 [Greasy Fork 安装页](https://greasyfork.org/scripts/585509)。
3. 点击安装后刷新 YouTube 页面。

## 相关 YouTube 脚本

| 脚本 | 说明 | 安装 |
| --- | --- | --- |
| YouTube 自动展开帖子与评论 | 自动展开 YouTube 帖子和评论区里的“了解详情 / Read more / Show more”。 | [Greasy Fork](https://greasyfork.org/scripts/585509) |
| YouTube 播放速度增强 | 解锁 YouTube 2.0x 倍速上限，并保存一个全局默认播放速度。 | [Greasy Fork](https://greasyfork.org/scripts/585659) |

## 适配范围

- `https://www.youtube.com/*`
- `https://m.youtube.com/*`

脚本只会在帖子和评论容器内查找展开按钮，避免误点视频简介或评论回复列表的其它“显示更多”按钮。

## License

MIT
