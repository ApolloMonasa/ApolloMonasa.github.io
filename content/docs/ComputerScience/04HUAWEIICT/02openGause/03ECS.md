---
# -------------------------------------------------------------------------------------
# |                           核心元数据 (Core Metadata)                            |
# -------------------------------------------------------------------------------------
# 【必填】文章标题：清晰、吸引人，并包含核心关键词
title: "在ECS上部署openGauss数据库教程"
# 【必填】文章发布日期
date: 2025-11-13T10:00:00+08:00
# 【建议】文章最后修改日期：更新文章后，请手动更新此日期，以告知搜索引擎内容已更新
# 【必填】文章作者
# 【必填】是否为草稿：发布前请务必设置为 false
draft: false
weight: 30

# -------------------------------------------------------------------------------------
# |                             SEO 与分享 (SEO & Sharing)                           |
# -------------------------------------------------------------------------------------
# 【核心SEO】文章描述：1-3句话，准确概括文章内容，包含关键词。会显示在搜索引擎结果中。
description: "本教程详细指导您如何在华为云弹性云服务器（ECS）上，从零开始一步步部署和配置 openGauss 数据库。内容涵盖环境准备、系统配置、数据库安装以及基本的使用操作，帮助您快速上手 openGauss。"
# 【建议SEO】文章关键词：针对本文的特定关键词，用逗号分隔
keywords: ["openGauss", "数据库部署", "ECS", "openEuler", "华为云", "数据库教程"]
# 【核心分享】社交分享预览图 (og:image)：非常重要！推荐尺寸 1200x630。
images: []

# -------------------------------------------------------------------------------------
# |                            内容组织 (Taxonomies)                               |
# -------------------------------------------------------------------------------------
# 【必填】标签：可以有多个，用于内容聚合
tags: ["openGauss", "数据库", "教程", "ECS"]
# 【必填】分类：通常只有一个，用于内容归档
categories: ["数据库实践"]
# 【可选】系列：将多篇文章组织成一个系列，自动生成上一篇/下一篇链接
series: ["openGauss部署系列"]

# -------------------------------------------------------------------------------------
# |                         FixIt 主题特定配置 (Theme-Specific)                     |
# -------------------------------------------------------------------------------------
# 是否开启评论
comment: true
# 是否显示目录
toc: true
# 文章封面图：显示在文章列表和文章顶部
featuredImage: ""
---

**摘要：** 本文是一份详尽的实践指南，旨在帮助用户在华为云弹性云服务器（ECS）上成功部署 openGauss 数据库。我们将从零开始，涵盖从购买服务器、配置 openEuler 操作系统，到安装和初始化 openGauss，最后进行基本的数据库操作。每一步都有详细的命令和清晰的解释，确保您能顺利完成部署。

<!--more-->

## 零、准备工作

在开始之前，请确保您已经完成以下准备：

1.  **一台弹性云服务器 (ECS)**：您需要一台已经购买并正在运行的 ECS 实例。本教程以 **openEuler** 操作系统为例。若没有请前往[华为云官网购买](https://developer.huaweicloud.com)。
2.  **Root 权限**：您需要拥有对这台服务器的 root 用户访问权限，以便执行系统级配置。

## 一、配置 openEuler 操作系统环境

一个干净且配置正确的操作系统环境是数据库稳定运行的基石。我们将进行字符集、Python 版本和依赖包的配置。

### 1. 设置系统字符集

**目的**：统一系统和数据库的字符集为 `UTF-8`，这是国际通用的编码标准，可以有效避免因编码问题导致的乱码。

**步骤 1：修改配置文件**

执行以下命令，将 `export LANG=en_US.UTF-8` 这行配置追加到系统全局配置文件 `/etc/profile` 的末尾。

```bash
cat >>/etc/profile<<EOF
export LANG=en_US.UTF-8
EOF
```

**步骤 2：使配置立即生效**

运行 `source` 命令来重新加载配置文件，让刚才的修改在当前会话中立即生效，无需重启服务器。

```bash
source /etc/profile
```

### 2. 修改 Python 版本并安装依赖包

**目的**：openGauss 的安装脚本和部分工具依赖于 Python 3.7.x 版本，而 openEuler 系统可能默认使用 Python 2.x。同时，需要安装 `libaio` 这个关键的库，它为数据库提供了高效的异步 I/O (Asynchronous I/O) 支持，对性能至关重要。

**步骤 1：切换到工作目录并备份**

首先进入 `/usr/bin` 目录，并将系统默认的 `python` 命令进行备份。这是一个好习惯，方便在出现问题时恢复。

```bash
cd /usr/bin
mv python python.bak
```

**步骤 2：建立新的软链接**

创建一个新的软链接，将 `python` 命令指向系统中的 `python3`。

```bash
ln -s python3 /usr/bin/python
```

**步骤 3：验证 Python 版本**

检查 `python` 命令现在是否指向了正确的版本。

```bash
python -V
```

您应该能看到类似 `Python 3.7.9` 的输出，表示切换成功。

**步骤 4：安装 `libaio` 依赖包**

使用 `yum` 包管理器安装 `libaio`。如果不安裝，后续的安装过程会因缺少依赖而失败。

```bash
yum install libaio -y
```

## 二、安装 openGauss 数据库

环境准备就绪，现在我们正式开始安装 openGauss。

### 1. 下载数据库安装包

**目的**：获取 openGauss 的安装文件。

**步骤 1：创建安装目录**

以 `root` 用户身份，创建一个专门用于存放 openGauss 软件和安装包的目录。规范的目录结构有助于后续的管理和维护。

```bash
mkdir -p /opt/software/openGauss
chmod 755 -R /opt/software
```

**步骤 2：下载安装包**

切换到新创建的目录，并使用 `wget` 命令从官方源下载安装包。

```bash
cd /opt/software/openGauss
wget https://opengauss.obs.cn-south-1.myhuaweicloud.com/5.0.1/arm/openGauss-5.0.1-openEuler-64bit-all.tar.gz
```
> **注意**：请根据您的服务器架构（ARM 或 x86）和期望的版本，从 openGauss 官网社区获取最新的下载链接。

### 2. 创建 XML 配置文件

**目的**：`clusterconfig.xml` 文件是 openGauss 安装的核心。它像一份蓝图，告诉安装程序如何在服务器上部署数据库集群，包括节点信息、IP 地址、数据目录、日志目录等所有关键配置。

**步骤 1：创建并编辑 XML 文件**

在安装包所在目录下，使用 `vi` 或 `vim` 创建一个名为 `clusterconfig.xml` 的文件。

```bash
vi clusterconfig.xml
```

**步骤 2：填入配置内容**

按 `i`键进入插入模式，将下面的 XML 内容粘贴进去。

{{< admonition warning "请务必修改！" >}}
请务必将下方 XML 中的 **`ecs-c9bf`** 替换为您的 **ECS 主机名**，并将 **`192.168.0.58`** 替换为您的 **ECS 私有 IP 地址**。这是最容易出错的地方，如果填错，安装将百分之百失败！
{{< /admonition >}}

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ROOT>
    <!-- cluster information -->
    <CLUSTER>
        <PARAM name="clusterName" value="dbCluster" />
        <PARAM name="nodeNames" value="ecs-c9bf" />
        <PARAM name="backIp1s" value="192.168.0.58"/>
        <PARAM name="gaussdbAppPath" value="/opt/gaussdb/app" />
        <PARAM name="gaussdbLogPath" value="/var/log/gaussdb/app" />
        <PARAM name="gaussdbToolPath" value="/opt/gaussdb/tool" />
        <PARAM name="corePath" value="/opt/opengauss/corefile" />
        <PARAM name="clusterType" value="single-inst" />
    </CLUSTER>
    <!-- dbnode information -->
    <DEVICELIST>
        <DEVICE sn="1000001">
            <PARAM name="name" value="ecs-c9bf"/>
            <PARAM name="azName" value="AZ1"/>
            <PARAM name="azPriority" value="1"/>
            <PARAM name="backIp1" value="192.168.0.58"/>
            <PARAM name="sshIp1" value="192.168.0.58"/>
            <!-- dbnode -->
            <PARAM name="dataNum" value="1"/>
            <PARAM name="dataPortBase" value="26000"/>
            <PARAM name="dataNode1" value="/gaussdb/data/db1"/>
        </DEVICE>
    </DEVICELIST>
</ROOT>
```

填写完毕后，按 `Esc` 键退出插入模式，然后输入 `:wq` 并回车，保存并退出文件。

### 3. 初始化安装环境

**目的**：执行 `gs_preinstall` 预安装脚本。这个脚本会自动完成一系列复杂的准备工作，包括：
*   检查系统环境是否满足安装要求。
*   创建专门用于管理数据库的系统用户 `omm`。
*   设置用户组和必要的系统参数。
*   在节点间建立互信，即使是单机部署也需要此步骤。

**步骤 1：修改性能优化脚本（可选但推荐）**

openGauss 提供了一个性能脚本，用于调整内核参数。

```bash
vi /etc/profile.d/performance.sh
```

按 `i` 进入插入模式，添加以下内容来优化内存管理：

```bash
sysctl -w vm.min_free_kbytes=112640 &> /dev/null
```

保存并退出 (`:wq`)。

**步骤 2：解压安装包**

```bash
tar -zxvf openGauss-5.0.1-openEuler-64bit-all.tar.gz
```
解压后，您会看到一个 `script` 子目录，预安装脚本就在其中。

**步骤 3：执行预安装脚本**

```bash
cd /opt/software/openGauss/script
python gs_preinstall -U omm -G dbgrp -X /opt/software/openGauss/clusterconfig.xml
```
*   `-U omm`: 指定要创建的操作系统用户名为 `omm`。
*   `-G dbgrp`: 指定用户组为 `dbgrp`。
*   `-X ...`: 指定我们刚刚创建的 XML 配置文件路径。

在执行过程中，系统会提示您：
1.  `Are you sure you want to create the user [omm] and create trust for it? (yes/no)?` -> 输入 `yes` 并回车。
2.  `Please enter password for cluster user:` -> 输入 `omm` 用户的密码，例如 `openGauss@123`。**请记住此密码**。
3.  `Please enter password for cluster user again:` -> 再次输入相同的密码。

如果看到 `Successfully set finish flag.` 和 `Preinstallation succeeded.` 字样，恭喜您，预安装成功！

### 4. 执行安装

**目的**：调用 `gs_install` 脚本，根据 XML 文件的配置，真正开始安装数据库实例。

**步骤 1：修改脚本权限**

为 `script` 目录下的所有脚本赋予可执行权限。

```bash
chmod 755 /opt/software/openGauss/script/*
```

**步骤 2：切换到 `omm` 用户**

**这是一个非常重要的安全实践！** 绝不能使用 `root` 用户来安装和管理数据库。必须切换到刚才创建的 `omm` 用户。

```bash
su - omm
```

**步骤 3：执行安装命令**

现在，以 `omm` 用户的身份执行安装脚本。

```bash
gs_install -X /opt/software/openGauss/clusterconfig.xml --gsinit-parameter="--encoding=UTF8" --dn-guc="max_process_memory=4GB" --dn-guc="shared_buffers=256MB" --dn-guc="bulk_write_ring_size=256MB" --dn-guc="cstore_buffers=16MB"
```

*   `-X ...`: 再次指定 XML 配置文件。
*   `--gsinit-parameter` 及 `--dn-guc`: 用于在初始化数据库时传入参数，如设置编码为 `UTF8`、配置内存大小等。

执行过程中，会提示您设置数据库管理员密码。
*   `Please enter password for database:` -> 输入数据库密码，例如 `GaussDB@123`。**这个密码是用于连接数据库的，请务必记住，并保证其复杂性。**
*   `Please repeat for database:` -> 再次输入数据库密码。

当您看到 `Successfully installed application.` 和 `end deploy.` 时，代表 openGauss 数据库已成功安装！

## 三、数据库基本使用

安装完成后，让我们来连接数据库并执行一些基本操作。

### 1. 检查数据库状态

**所有数据库操作都应在 `omm` 用户下进行。**

**步骤 1：切换用户（如果当前不是）**

```bash
su - omm
```

**步骤 2：查看集群状态**

```bash
gs_om -t status
```

如果 `cluster_state` 显示为 `Normal`，表示集群运行正常。

### 2. 连接数据库

**步骤 1：启动数据库（如果未启动）**

通常安装后会自动启动，如果状态不正常，可以手动启动。

```bash
gs_om -t start
```

**步骤 2：使用 gsql 客户端连接**

`gsql` 是 openGauss 的命令行客户端。

```bash
gsql -d postgres -p 26000 -r
```

*   `-d postgres`: 连接到默认的 `postgres` 数据库。
*   `-p 26000`: 连接到 XML 中配置的端口。
*   `-r`: 以只读方式连接（这是一个好习惯，防止误操作）。

成功连接后，您会看到 `openGauss=>` 提示符。

### 3. 创建用户和数据库

**目的**：实践中，我们通常不会直接使用默认的管理员账户进行业务操作。而是为不同的应用创建专用的用户和数据库。

**步骤 1：创建新用户**

创建一个名为 `joe` 的用户，密码为 `Bigdata@123`。

```sql
CREATE USER joe WITH PASSWORD "Bigdata@123";
```

**步骤 2：创建新数据库**

创建一个名为 `db_tpcc` 的新数据库，并指定所有者为 `joe`。

```sql
CREATE DATABASE db_tpcc OWNER joe;
```

**步骤 3：退出当前连接**

输入 `\q` 并回车，退出 `postgres` 用户的连接。

### 4. 使用新用户进行操作

**步骤 1：使用新用户连接新数据库**

```bash
gsql -d db_tpcc -p 26000 -U joe -W Bigdata@123
```
*   `-U joe`: 指定用户为 `joe`。
*   `-W Bigdata@123`: 提示输入密码（这里直接提供了密码，实际生产中更推荐省略 `-W` 参数，让系统交互式地提示输入密码，更安全）。

连接成功后，提示符会变为 `db_tpcc=>`。

**步骤 2：创建 SCHEMA 并设置搜索路径**

```sql
CREATE SCHEMA joe AUTHORIZATION joe;
SET search_path TO joe;
```

**步骤 3：创建表、插入数据并查询**

```sql
-- 创建一个简单的表
CREATE TABLE mytable (firstcol int);

-- 插入一条数据
INSERT INTO mytable VALUES (100);

-- 查询数据
SELECT * FROM mytable;
```

您应该能看到查询结果 `100`。

## 四、总结

恭喜您！至此，您已经成功在 ECS 上完成了 openGauss 数据库的部署，并掌握了创建用户、数据库、表以及增删改查等基本操作。您现在可以基于此环境进行更深入的学习和开发了。如果暂时不使用数据库，可以执行 `gs_om -t stop` 命令来安全地关闭它。
