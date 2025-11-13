---
# -------------------------------------------------------------------------------------
# |                           核心元数据 (Core Metadata)                            |
# -------------------------------------------------------------------------------------
# 【必填】文章标题：清晰、吸引人，并包含核心关键词
title: "华为云鲲鹏ECS搭建openGauss"
# 【必填】文章发布日期
date: 2025-11-12T10:00:00+08:00
# 【建议】文章最后修改日期：更新文章后，请手动更新此日期，以告知搜索引擎内容已更新
# 【必填】文章作者
# 【必填】是否为草稿：发布前请務必设置为 false
draft: false
weight: 30

# -------------------------------------------------------------------------------------
# |                             SEO 与分享 (SEO & Sharing)                           |
# -------------------------------------------------------------------------------------
# 【核心SEO】文章描述：1-3句话，准确概括文章内容，包含关键词。会显示在搜索引擎结果中。
description: "本教程专为鲲鹏（ARM）学习者设计，提供了一套标准化的低成本配置方案。所有命令均采用绝对路径，确保您直接复制粘贴即可成功，杜绝因当前目录错误导致的失败。手把手教您在华为云鲲鹏ECS上搭建 openGauss 学习环境。"
# 【建议SEO】文章关键词：针对本文的特定关键词，用逗号分隔
keywords: ["openGauss", "鲲鹏", "ARM", "数据库学习", "华为云ECS", "openEuler", "绝对路径", "防错教程"]

# -------------------------------------------------------------------------------------
# |                            内容组织 (Taxonomies)                               |
# -------------------------------------------------------------------------------------
# 【必填】标签：可以有多个，用于内容聚合
tags: ["openGauss", "数据库", "教程", "ECS", "鲲鹏", "ARM"]
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
---

**摘要：** 这是一份专为探索鲲鹏（ARM）生态的数据库学习者量身定制的、**终极防错**的行动手册。我们将严格遵循一套标准化的鲲鹏云服务器配置，并且**所有命令行都使用绝对路径**，这意味着您无需关心当前在哪个目录下，只需完整地复制粘贴命令，就能100%成功部署openGauss。

<!--more-->

## 零、学习环境规划：鲲鹏 ARM 架构

| 配置选项 | 标准配置值 | 说明 |
| :--- | :--- | :--- |
| **区域** | **华北-北京四** | 推荐，确保能找到指定的 openEuler 镜像 |
| **计费模式** | **按需计费** | 学习必备，用完即删，成本最低 |
| **CPU架构** | **鲲鹏计算** | **核心！本次实践基于 ARM 架构** |
| **规格** | **最新系列 · 2vCPUs\|4/8GiB** | 例如 **kc1.large.2**，满足学习所需 |
| **镜像** | **公共镜像** | **`openEuler 20.03 64bit with ARM(40GB)`** |
| **主机名** | `opengauss-dev` | 统一命名，方便后续配置 |
| **网络** | vpc-default | 使用默认即可 |
| **安全组** | default | 使用默认组，但**需要我们手动修改** |
| **公网IP** | 现在购买，按流量计费 | 5Mbps 带宽足够学习使用 |

## 一、创建标准化的鲲鹏云服务器 (ECS)

### 1. 购买 ECS 实例（请严格按此配置）

1.  登录[华为云控制台](https://console.huaweicloud.com/)，进入“**弹性云服务器 ECS**” -> “**购买弹性云服务器**”。
2.  **请严格按照上方的“标准配置值”进行选择**，特别注意：
    *   **CPU架构**：选择“**鲲鹏计算**”。
    *   **镜像**：选择 `openEuler 20.03 64bit with ARM(40GB)`。
    *   **高级选项 (必填)**：展开“**高级选项**”，在“**主机名**”字段中，准确输入 `opengauss`。
    *   **登录凭证**：选择“**密码**”，设置一个你能记住的 `root` 用户密码。



### 3. 连接服务器

复制ECS的 **公网IP地址**，使用SSH连接：
```bash
ssh root@<你的ECS公网IP>
```
输入 `yes` 和你设置的 `root` 密码，登录成功。

---

好的，遵命。我已经将我们之前的所有操作步骤，严格按照您提供的“终极防错版”和“绝对路径”原则，整合成了一份详尽的、可直接发布的安装指导书。

---

## 二、环境准备：配置系统并下载核心组件

在全新的系统上，我们需要进行一些基础配置，以确保 openGauss 能够顺利安装和运行。

### 1. 设置系统字符集

统一的字符集是数据库稳定运行的基础。我们将系统默认语言环境设置为 `en_US.UTF-8`。

> **📖 为什么要这么做？**
> 数据库对字符编码非常敏感。统一设置为 UTF-8 可以避免因编码不一致导致的乱码、数据损坏或安装失败等问题。

**步骤1：** 使用 `root` 用户执行以下命令，将字符集配置追加到系统全局配置文件中。

```bash
cat >> /etc/profile <<EOF
export LANG=en_US.UTF-8
EOF
```

**步骤2：** 立即生效该配置。
```bash
source /etc/profile
```

### 2. 切换 Python 版本并安装依赖

openGauss 的安装脚本需要 Python 3 环境，而 openEuler 20.03 系统默认的 `python` 命令指向 Python 2。我们需要将其切换为 Python 3，并安装一个核心依赖包 `libaio`。

> **📖 为什么需要切换 Python？**
> `gs_preinstall` 和 `gs_install` 等核心安装脚本是使用 Python 3 编写的。如果系统默认 `python` 命令指向版本 2，脚本将无法执行。`libaio` 则是 Linux 下的一个异步 I/O 库，是数据库高性能读写的关键依赖。

**步骤1：** 备份系统默认的 Python 2 链接。
```bash
mv /usr/bin/python /usr/bin/python.bak
```

**步骤2：** 创建一个新的软链接，将 `python` 命令指向系统已有的 Python 3。
```bash
ln -s /usr/bin/python3 /usr/bin/python
```

**步骤3：** 验证 Python 版本是否切换成功。
```bash
python -V
```
> **✅ 预期输出：**
> 如果您看到类似 `Python 3.7.9` 的输出，证明切换成功。

**步骤4：** 使用 yum 安装 `libaio` 依赖包。
```bash
yum install libaio* -y
```

### 3. 下载 openGauss 安装包

**步骤1：** 创建一个专门用于存放 openGauss 安装包和配置文件的目录。
```bash
mkdir -p /opt/software/openGauss
```
> **💡 防错提示：**
> 我们将所有与安装相关的文件都放在 `/opt/software/openGauss` 目录下，这是一种规范的做法，便于管理。不建议将其放在 `/root` 或其他用户的主目录下，以避免权限问题。

**步骤2：** 赋予该目录适当的权限。
```bash
chmod 755 -R /opt/software
```

**步骤3：** 使用 `wget` 命令将 openGauss 安装包直接下载到我们创建的目录中。
```bash
wget -P /opt/software/openGauss https://opengauss.obs.cn-south-1.myhuaweicloud.com/5.0.1/arm/openGauss-5.0.1-openEuler-64bit-all.tar.gz
```
> **💡 防错提示：**
> 这里我们使用了 `wget` 的 `-P` 参数，它能确保文件被精确地下载到指定目录 `/opt/software/openGauss`，从而避免了因当前所在路径不正确而导致的下载位置错误。


## 三、核心部署：配置、初始化与安装

这是整个过程中最核心的部分。我们将创建配置文件，初始化环境，并最终安装数据库。

### 1. 创建 XML 配置文件

安装脚本需要一个 XML 文件来了解我们的部署计划，例如主机名、IP地址、安装路径等。

> **⚠️ 注意：IP 地址获取**
> 在接下来的配置中，我们需要使用您 ECS 的 **私有 IP 地址**，而不是公网 IP。请在华为云 ECS 控制台的实例详情页找到它，通常是 `192.168.x.x` 或 `10.x.x.x` 的形式。

**步骤1：** 创建并使用 `vi` 编辑器打开配置文件。
```bash
vi /opt/software/openGauss/clusterconfig.xml
```

**步骤2：** 按下 `i` 键进入插入模式，然后**完整复制**下面的 XML 内容，粘贴到您的 SSH 终端中。

> **请务必将下面的 `192.168.0.58` 替换为您自己 ECS 的真实私有 IP 地址！**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ROOT>
    <CLUSTER>
        <PARAM name="clusterName" value="dbCluster" />
        <PARAM name="nodeNames" value="opengauss" />
        <PARAM name="backIp1s" value="192.168.0.58" />
        <PARAM name="gaussdbAppPath" value="/opt/gaussdb/app" />
        <PARAM name="gaussdbLogPath" value="/var/log/gaussdb" />
        <PARAM name="gaussdbToolPath" value="/opt/huawei/wisequery" />
        <PARAM name="corePath" value="/opt/opengauss/corefile" />
        <PARAM name="clusterType" value="single-inst"/>
    </CLUSTER>
    <DEVICELIST>
        <DEVICE sn="1000001">
            <PARAM name="name" value="opengauss"/>
            <PARAM name="azName" value="AZ1"/>
            <PARAM name="azPriority" value="1"/>
            <PARAM name="backIp1" value="192.168.0.58"/>
            <PARAM name="sship1" value="192.168.0.58"/>
            <!--dbnode-->
            <PARAM name="dataNum" value="1"/>
            <PARAM name="dataPortBase" value="26000"/>
            <PARAM name="dataNode1" value="/gaussdb/data/db1"/>
        </DEVICE>
    </DEVICELIST>
</ROOT>
```

**步骤3：** 按下 `Esc` 键退出插入模式，然后输入 `:wq` 并回车，保存并退出文件。

### 2. 初始化安装环境 (gs_preinstall)

这一步将创建 openGauss 的专用运行用户 `omm`，并配置好环境。

**步骤1：** 解压之前下载的两个核心压缩包到指定目录。
```bash
tar -zxvf /opt/software/openGauss/openGauss-5.0.1-openEuler-64bit-all.tar.gz -C /opt/software/openGauss
tar -zxvf /opt/software/openGauss/openGauss-5.0.1-openEuler-64bit-om.tar.gz -C /opt/software/openGauss
```
> **💡 防错提示：**
> 我们使用 `tar` 的 `-C` 参数来确保文件解压到正确的 `/opt/software/openGauss` 目录下。

**步骤2：** **以 `root` 用户**执行预安装脚本。
```bash
python /opt/software/openGauss/script/gs_preinstall -U omm -G dbgrp -X /opt/software/openGauss/clusterconfig.xml
```

**步骤3：** 根据提示完成交互。
1.  当看到 `Are you sure you want to create the user[omm] and create trust for it (yes/no)?` 时，输入 `yes` 并回车。
2.  当看到 `Please enter password for cluster user.` 时，输入您为 `omm` 用户设置的密码（例如：`openGauss@123`，**建议自定义并牢记**）。**输入时屏幕无任何显示，这是正常现象**，输完直接回车。
3.  再次输入相同的密码进行确认。

> **✅ 预期输出：**
> 当您看到 `Preinstallation succeeded.` 时，表示环境初始化成功。

### 3. 执行安装 (gs_install)

万事俱备，只欠东风！现在我们将切换到 `omm` 用户，执行最终的安装命令。

**步骤1：** **以 `root` 用户**为脚本目录授权，确保 `omm` 用户有权执行。
```bash
chmod -R 755 /opt/software/openGauss/script
```

**步骤2：** 从 `root` 用户切换到 `omm` 用户。
```bash
su - omm
```
> 你的命令行提示符现在应该从 `[root@opengauss ~]#` 变为了 `[omm@opengauss ~]$`。

**步骤3：** **以 `omm` 用户**执行安装脚本。
```bash
/opt/software/openGauss/script/gs_install -X /opt/software/openGauss/clusterconfig.xml --gsinit-parameter="--encoding=UTF8" --dn-guc="max_process_memory=4GB" --dn-guc="shared_buffers=256MB" --dn-guc="bulk_write_ring_size=256MB" --dn-guc="cstore_buffers=16MB"
```

**步骤4：** 根据提示设置数据库密码。
1.  当看到 `Please enter password for database:` 时，输入数据库管理员（`omm`）的密码。**此密码用于连接数据库，可以与上一步的操作系统用户 `omm` 密码不同**。请务必设置一个强密码并牢记。
2.  再次输入相同的密码进行确认。

> **✅ 预期输出：**
> 脚本会自动完成所有安装和配置。当您在最后看到 `Successfully installed application.` 和 `end deploy.` 时，恭喜您，openGauss 数据库已成功部署在您的鲲鹏服务器上！

## 四、验证与后续

### 1. 验证安装状态
您可以 `omm` 用户下，使用 `gs_om` 工具来查看集群状态。
```bash
gs_om -t status --detail
```
如果看到 `cluster state` 为 `Normal`，则表示一切正常。

如果不正常，就运行以下指令手动启动一下。
```bash
gs_om -t start
```
### 2. 连接数据库
使用 `gsql` 命令连接到您的数据库进行操作。
```bash
gsql -d postgres -p 26000
```
输入您在“执行安装”步骤中设置的数据库密码，即可进入数据库命令行。

至此，您已经拥有了一个完全由自己亲手搭建的、运行在鲲鹏 ARM 架构上的 openGauss 数据库学习环境。尽情探索吧！


---
## 如何使用Navicat连接

### **第一步：配置 openGauss，允许远程连接**

我们需要修改两个核心配置文件，告诉 openGauss：“请接收来自外部的连接请求”。

**这些操作都必须以 `omm` 用户执行。** 如果您当前是 `root` 用户，请先切换：
`su - omm`

#### 1. 修改 `pg_hba.conf` (访问控制文件)

这个文件决定了**谁**可以从**哪里**连接。

*   **编辑文件：**
    ```bash
    vi /gaussdb/data/db1/pg_hba.conf
    ```
*   **添加规则：**
    在 `vi` 编辑器中，按 `G` 跳转到文件末尾，然后按 `o` 新起一行进入编辑模式。添加下面这**一整行**内容：
    ```
    host    all             all             0.0.0.0/0               sha256
    ```
    > **📖 这行配置的含义是：**
    > *   `host`：允许通过 TCP/IP 网络连接。
    > *   `all` (第一个)：允许连接到**所有**数据库。
    > *   `all` (第二个)：允许**所有**用户连接。
    > *   `0.0.0.0/0`：允许来自**任何IP地址**的连接。
    > *   `sha256`：连接时需要使用密码进行验证。

*   **保存退出：**
    按 `Esc` 键，然后输入 `:wq` 并回车。

#### 2. 修改 `postgresql.conf` (主配置文件)

这个文件决定了数据库在服务器的**哪个网络地址**上监听连接。

*   **编辑文件：**
    ```bash
    vi /gaussdb/data/db1/postgresql.conf
    ```
*   **修改监听地址：**
    在 `vi` 中，输入 `/listen` 并回车，快速定位到 `listen_addresses` 这一行。
    找到 `#listen_addresses = 'localhost'`，将其修改为：
    ```
    listen_addresses = '*'
    ```
    > **📖 修改说明：**
    > *   去掉行首的 `#` 注释符。
    > *   将 `'localhost'` 修改为 `'*'`，意思是让数据库在服务器的所有网络接口上监听，而不仅仅是本地。

*   **保存退出：**
    按 `Esc` 键，然后输入 `:wq` 并回车。

---

### **第二步：重启 openGauss 服务使配置生效**

配置修改后，必须重启数据库才能加载新的设置。

**继续以 `omm` 用户**执行以下命令：
```bash
# 停止数据库服务
gs_om -t stop

# 启动数据库服务
gs_om -t start
```
看到 `Successfully started cluster.` 即表示重启成功。

---

### **第三步：配置华为云安全组（防火墙）**

这是最关键也最容易被忽略的一步！云服务器自带一个网络防火墙（安全组），默认只开放了 SSH 的 22 端口。我们需要手动放行数据库的 `26000` 端口。

1.  **登录华为云控制台**，进入“弹性云服务器 ECS”。
2.  找到您的 `opengause` 实例，点击实例名称进入详情页。
3.  选择“**安全组**”标签页，然后点击当前绑定的安全组名称（例如 `Sys-default`)。
4.  在安全组规则页面，点击“**更改规则**”。
5.  在“**入方向规则**”下，点击“**添加规则**”。
6.  按照下图所示进行配置：
    *   **优先级**：保持默认 `1` 即可。
    *   **策略**：选择 `允许`。
    *   **协议端口**：选择 `TCP`，然后在后面输入 `26000`。
    *   **源地址**：输入 `0.0.0.0/0` (允许任何IP访问，方便学习)。
    *   **描述**：填写一个方便自己记忆的名字，如 `openGauss-26000`。
7.  点击“**确定**”保存规则。



---

### **第四步：配置 Navicat 连接**

现在，所有通道都已打通，可以在 Navicat 中创建连接了。

1.  打开 Navicat，点击“连接”，选择 **“PostgreSQL”** (openGauss 兼容 PostgreSQL 协议)。
2.  在弹出的连接设置窗口中，填写以下信息：
    *   **常规**
        *   **主机**：您ECS的 **公网IP地址**。
        *   **端口**：`26000`
        *   **初始数据库**：`postgres` (这是一个默认存在的数据库)
        *   **用户名**：`omm`
        *   **密码**：您在**执行`gs_install`时**为数据库设置的那个密码。
        *   **保存密码**：勾选。
3.  点击左下角的“**测试连接**”。
4.  如果看到“**连接成功**”的提示，就大功告成了！点击“确定”保存连接。

现在，您就可以通过 Navicat 方便地管理和操作您的 openGauss 数据库了。