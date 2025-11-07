---
title: "Mac安装SQL
date: 2025-11-07T08:50:00+08:00
weight: 10
tags: ["SQL"]
---

## 推荐使用homebrew包管理器安装

### 安装
```bash

brew install mysql
```
### 启动
Mac是默认不会自动启动的，需要手动启动。
```bash
mysql.server start
```

### 设置开机自启动(可选/推荐)
```bash
brew services start mysql
```

### 连接/登录
```bash
mysql -u root -p
```

`-u root`指的是使用root账户，`-p`是使用密码登录。

提示输入密码，直接回车即可，Mac中使用homebrew安装的MySQL默认无密码。

如果看到`mysql>`，就说明已经成功连接。

## MySQL Workbench用户图形界面工具

自行去[官网](https://www.mysql.com)下载。

## 其他GUI工具

- [Dbeaver](https://www.dbeaver.io)【开源】

- [Navicat](https://www.navicat.com/en/)【收费】