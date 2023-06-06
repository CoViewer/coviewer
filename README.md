# CoViewer

基于 **Nest.js** 的漫画等图片集合管理系统，提供 Web 前端、Android 客户端* 等多种客户端。

> *sooooooooooon

> 下面都是坑

## 注

缩略图生成依赖 [`sharp`](https://sharp.pixelplumbing.com/) 包，此包依赖 `libvps`。

## 计划功能

### 管理

- 存储支持:

    - 本机存储
    - 阿里云 OSS
    - 对象存储（S3）
    - WebDav
    - AList

- 添加 (导入) 支持: 

    - 通过 storage 目录导入
    - 通过 storage 目录批量导入
    - 通过 storage 目录自动监听导入
    - 通过上传压缩包导入
    - 通过上传压缩包批量导入
    - 手动新建并上传文件导入
    - 通过 APP 上传目录导入
    - 通过 APP 自动监听目录导入

- 信息与标签:

    - 缩略图、标题、作者、tag 等信息手动录入
    - e-hentai URL 导入
    - e-hentai 下载格式支持
    - EhViewer 下载格式支持

- 权限控制:

    - 类 AList 元数据
    - 用户

- 后台任务管理:

    - 缩略图生成
    - 上传同步

### 用户

- 体验优化:

    - 缩略图生成与使用
    - 未来页预加载
    - 阅读进度记忆 (登陆时为云同步，游客为本地记忆)

- 阅读器:

    - 手势支持
    - 快捷键支持 (APP，如音量键翻页)

> 更多问题详见 [**草稿**](DRAFT.md)