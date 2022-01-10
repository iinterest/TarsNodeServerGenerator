# Tars Node Server Generator

这是一个 Node Web 服务的脚手架工具，通过该工具可以快速生成一套具备读取 Tars 配置、写 Tars 日志、集成前端工程化工具的 Express Web 服务。

## 一、安装
```
npm install tars-node-server-generator -g
```

Tarsns 生成的项目依赖 [nodemon](https://nodemon.io/) 工具，如果没有安装过请执行：

```
npm install nodemon -g
```
注：nodemon 是一个文件监控工具，当被监控文件发生变化时会自动重启该 Node 服务，相关配置可以在`nodemon.json`中修改。

## 二、创建及启动工程

### 默认工程
---

```
tarsns create <ProjectName>
```

运行命令后会生成以下目录及文件：

```
<ProjectName>/
    ├── lib/
    │ ├── configLoader.js
    │ └── logger.js
    ├── public/
    ├── routers/
    │ ├── home.js
    │ └── index.js
    ├── views/
    │ ├── error.ejs
    │ └── index.ejs
    ├── .gitignore
    ├── app.js
    ├── nodemon.json
    ├── package.json
    ├── server.js
    └── <ProjectName>.conf
```
### 注意事项：
* 项目名称：`<ProjectName>` 必须与 Tars 服务名称一致，手动修改`<ProjectName>` 会导致程序运行错误。
* 程序端口：Tarsns 生成的项目默认端口为`4000`，可以在`package.json`的`config.port`字段中进行修改。

### Tars协议服务
---

```
tarsns create <ProjectName> --tars <AppName>
```

运行命令后会生成以下目录及文件：

```
<ProjectName>/
    ├── <ProjectName>.conf
    ├── app.js
    ├── lib
    │   ├── configLoader.js
    │   ├── error.js
    │   └── logger.js
    ├── nodemon.json
    ├── package.json
    ├── proxy
    ├── server.conf
    └── tars
        └── <ProjectName>.tars
```

### 注意事项：
* 项目名称：`<AppName>`为应用名称，`<ProjectName>` 为服务名称，必须与 Tars 应用和服务名称一致，手动修改`<ProjectName>` 会导致程序运行错误。
* 程序端口：Tarsns 生成的项目默认端口为`14009`，可以在`server.conf`文件中进行修改。

## 四、其它问题

生成项目使用了 ES6 语法，IDEA、WebStorm 等 IDE 需要设置下语言支持：
`Preferences > Languages & Frameworks > JavaScript > JavaScript language version` 设置为 `ECMAScript 6` 即可。

帮助命令：

```
Tarsns -h
```