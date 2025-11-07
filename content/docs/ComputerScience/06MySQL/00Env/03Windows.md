---
title: "Windows安装SQL
date: 2025-11-07T08:50:00+08:00
weight: 30
tags: ["SQL"]
---


## 官网下载安装包
Windows的安装最简便的就是通过[官网社区版下载地址](https://dev.mysql.com/downloads/)，下载安装包之后一路next就行，只需要设置一下root账户的登录密码，如果需要别的账户登录，也可以在安装导引中自行设置。

## choco安装
在CMD中执行以下命令：

```bash
choco install -y mysql
```