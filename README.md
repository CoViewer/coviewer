# CoViewer

基于 **Nest.js** 的漫画等图片集合管理系统，提供 Web 前端、Android 客户端* 等多种客户端。

> *sooooooooooon

> 下面都是坑

## 计划功能

# 注

缩略图生成依赖 [`sharp`](https://sharp.pixelplumbing.com/) 包，此包依赖 `libvps`。

### 管理

- 存储支持:

    - 本机存储
    - WebDav
    - AList
    - 对象存储（S3）

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

## 特殊说明

### 关于漫画的创建与导入的逻辑

比如此时有如下路径结构的漫画

```
 demo
    |-- comic
        |-- Demo Comic 1
        |   |-- 0001.png
        |   |-- 0002.png
        |   |-- 0003.png
        |   |-- 0004.png
        |-- Demo Comic 2
            |-- 0001.png
            |-- 0002.png
            |-- 0003.png
            |-- 0004.png
```

其中

若欲从 `comic` 导入子目录下所有漫画（如 `Demo Comic 1` 和 `Demo Comic 2`），则应使用 `从父文件夹导入多个漫画`；

若欲批量导入 `Demo Comic 1` 和 `Demo Comic 2`，则应使用 `从文件夹导入多个漫画`；

而 `创建漫画` 则是新建一个空的项目。

### 关于标签

标签格式为 `name:value`，如 `artist:xxxx`、`translator:xxxx`、`language:Chinese` 等类似于 E-hentai 的标签。

### 关于元信息的权限控制

采用 **密码唯一** 的 **标签黑白名单** 规则集方案，如创建一个密码为 `93`，白名单标签 `male:males only` 的规则时，使用密码 `93` 登录后，只能查看该标签下的漫画。

### 关于缩略图

缩略图 id 和 图片 id 相同。