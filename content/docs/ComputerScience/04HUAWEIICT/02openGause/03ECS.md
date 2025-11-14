---
# -------------------------------------------------------------------------------------
# |                           核心元数据 (Core Metadata)                            |
# -------------------------------------------------------------------------------------
# 【必填】文章标题：清晰、吸引人，并包含核心关键词
title: "华为云鲲鹏ECS搭建openGauss：终极防错实践"
# 【必填】文章发布日期
date: 2025-11-12T10:00:00+08:00
# 【建议】文章最后修改日期：更新文章后，请手动更新此日期，以告知搜索引擎内容已更新

# 【必填】是否为草稿：发布前请務必设置为 false
draft: false
weight: 30

# -------------------------------------------------------------------------------------
# |                             SEO 与分享 (SEO & Sharing)                           |
# -------------------------------------------------------------------------------------
# 【核心SEO】文章描述：1-3句话，准确概括文章内容，包含关键词。会显示在搜索引擎结果中。
description: "本教程专为鲲鹏（ARM）学习者设计，提供了一套标准化的低成本配置方案。所有命令均采用绝对路径，确保您直接复制粘贴即可100%成功，彻底杜绝因环境不一致或路径错误导致的失败。手把手教您在华为云鲲鹏ECS上搭建 openGauss 学习环境。"
# 【建议SEO】文章关键词：针对本文的特定关键词，用逗号分隔
keywords: ["openGauss", "鲲鹏", "ARM", "数据库学习", "华为云ECS", "openEuler", "绝对路径", "防错教程", "gs_preinstall", "Cgroup", "rc.local", "performance.sh"]

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
| **规格** | **最新系列 · 2vCPUs\|8GiB** | 例如 **kc1.xlarge.2**，建议8G内存以获得更佳体验 |
| **镜像** | **公共镜像** | **`openEuler 20.03 64bit with ARM(40GB)`** |
| **主机名** | `opengauss` | 统一命名，方便后续配置 |
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

### 2. 连接服务器

复制ECS的 **公网IP地址**，使用SSH连接：
```bash
ssh root@<你的ECS公网IP>
```
输入 `yes` 和你设置的 `root` 密码，登录成功。

---

## 二、环境准备：配置系统并下载核心组件

在全新的系统上，我们需要进行一些基础配置和优化，以确保 openGauss 能够顺利安装和运行。

### 1. 设置系统字符集

统一的字符集是数据库稳定运行的基础。我们将系统默认语言环境设置为 `en_US.UTF-8`。

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

### 2. 切换 Python 版本

**步骤1：** 备份系统默认的 Python 2 链接。
```bash
mv /usr/bin/python /usr/bin/python.bak
```
**步骤2：** 创建一个新的软链接，将 `python` 命令指向系统已有的 Python 3。
```bash
ln -s /usr/bin/python3 /usr/bin/python
```

### 3. 下载 openGauss 安装包

**步骤1：** 创建一个专门用于存放 openGauss 安装包和配置文件的目录。
```bash
mkdir -p /opt/software/openGauss
```
**步骤2：** 赋予该目录适当的权限。
```bash
chmod 755 -R /opt/software
```
**步骤3：** 使用 `wget` 命令将 openGauss 安装包直接下载到我们创建的目录中。
```bash
wget -P /opt/software/openGauss https://opengauss.obs.cn-south-1.myhuaweicloud.com/5.0.1/arm/openGauss-5.0.1-openEuler-64bit-all.tar.gz
```

### 4. 系统优化与依赖安装 (关键防错步骤)

此步骤将提前完成所有系统配置和依赖安装，以防止后续 `gs_preinstall` 脚本因环境检查不通过而失败或挂起。

> **📖 为什么要这么做？**
> 我们将提前关闭透明大页（THP）、**禁用与 openGauss 冲突的系统默认配置**、优化内核参数、放宽资源限制，并安装所有必需的依赖包。这是保证安装成功的关键，也是生产部署的最佳实践。

**以 `root` 用户身份**，完整复制并执行以下命令块来完成所有优化：

```bash
# 1. 关闭并禁用透明大页 (THP)，并确保开机自启服务生效
echo 'never' > /sys/kernel/mm/transparent_hugepage/enabled
echo 'never' > /sys/kernel/mm/transparent_hugepage/defrag
cat >> /etc/rc.local <<EOF
if test -f /sys/kernel/mm/transparent_hugepage/enabled; then
   echo never > /sys/kernel/mm/transparent_hugepage/enabled
fi
if test -f /sys/kernel/mm/transparent_hugepage/defrag; then
   echo never > /sys/kernel/mm/transparent_hugepage/defrag
fi
EOF
chmod +x /etc/rc.local
systemctl enable rc-local.service
systemctl start rc-local.service

# 2. 【核心修复】禁用 openEuler 系统自带的、与 openGauss 冲突的内存参数设置
sed -i '/vm.min_free_kbytes/s/^/#/' /etc/profile.d/performance.sh

# 3. 优化内核网络与内存参数 (使用 openGauss 推荐值)
cat >> /etc/sysctl.conf <<EOF
net.ipv4.tcp_retries1 = 5
net.ipv4.tcp_syn_retries = 5
vm.min_free_kbytes = 1048576
EOF
sysctl -p

# 4. 提升系统资源限制
cat >> /etc/security/limits.conf <<EOF
* soft nofile 1000000
* hard nofile 1000000
* soft nproc unlimited
* hard nproc unlimited
EOF

# 5. 一次性安装所有必需的依赖包
yum install -y libaio* chrony libcgroup-tools gcc python3-devel

# 6. 启动并设置时间同步服务为开机自启
systemctl start chronyd
systemctl enable chronyd
```
> **✅ 预期输出：**
> 您会看到软件包的安装过程和各项服务的启动信息。执行完毕后，系统环境就已经为 openGauss 的安装做好了万全准备。

## 三、核心部署：配置、初始化与安装

### 1. 创建 XML 配置文件

> **⚠️ 注意：IP 地址获取**
> 在接下来的配置中，我们需要使用您 ECS 的 **私有 IP 地址**，而不是公网 IP。请在华为云 ECS 控制台的实例详情页找到它。

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

**步骤1：** 解压之前下载的两个核心压缩包到指定目录。
```bash
tar -zxvf /opt/software/openGauss/openGauss-5.0.1-openEuler-64bit-all.tar.gz -C /opt/software/openGauss
tar -zxvf /opt/software/openGauss/openGauss-5.0.1-openEuler-64bit-om.tar.gz -C /opt/software/openGauss
```

**步骤2：** **以 `root` 用户**执行预安装脚本。
```bash
/opt/software/openGauss/script/gs_preinstall -U omm -G dbgrp -X /opt/software/openGauss/clusterconfig.xml
```

**步骤3：** 根据提示完成交互。
1.  当看到 `Are you sure you want to create the user[omm]...` 时，输入 `yes` 并回车。
2.  当看到 `Please enter password for cluster user.` 时，输入您为 `omm` 用户设置的密码（例如：`openGauss@123`）。
3.  再次输入相同的密码进行确认。

> **✅ 预期输出：**
> 由于我们已提前完成所有系统优化，此脚本将顺利执行。当您看到 `Preinstallation succeeded.` 时，表示环境初始化成功。

### 3. 执行安装 (gs_install)

**步骤1：** **以 `root` 用户**为脚本目录授权，确保 `omm` 用户有权执行。
```bash
chmod -R 755 /opt/software/openGauss/script
```

**步骤2：** 从 `root` 用户切换到 `omm` 用户，并为其安装 Python 依赖。
```bash
su - omm
pip3 install netifaces --user
```
> **💡 提示：** 您的命令行提示符现在应该从 `[root@opengauss ~]#` 变为了 `[omm@opengauss ~]$`。

**步骤3：** **以 `omm` 用户**执行安装脚本。
```bash
/opt/software/openGauss/script/gs_install -X /opt/software/openGauss/clusterconfig.xml --gsinit-parameter="--encoding=UTF8" --dn-guc="max_process_memory=6GB" --dn-guc="shared_buffers=1GB" --dn-guc="bulk_write_ring_size=256MB" --dn-guc="cstore_buffers=16MB"
```
> **💡 提示：** 上述内存配置适用于 8GB 内存的ECS。如果您的ECS是4GB内存，请使用 `max_process_memory=2GB` 和 `shared_buffers=256MB`。

**步骤4：** 根据提示设置数据库密码。
1.  当看到 `Please enter password for database:` 时，输入数据库管理员（`omm`）的密码。
2.  再次输入相同的密码进行确认。

> **✅ 预期输出：**
> 脚本会自动完成所有安装和配置。当您在最后看到 `Successfully installed application.` 时，恭喜您，openGauss 数据库已成功部署在您的鲲鹏服务器上！

## 四、验证与后续

### 1. 验证安装状态
您可以 `omm` 用户下，使用 `gs_om` 工具来查看集群状态。
```bash
gs_om -t status --detail
```
如果看到 `cluster state` 为 `Normal`，则表示一切正常。如果不正常，可尝试手动启动：`gs_om -t start`

### 2. 连接数据库
使用 `gsql` 命令连接到您的数据库进行操作。
```bash
gsql -d postgres -p 26000
```
输入您在“执行安装”步骤中设置的数据库密码，即可进入数据库命令行。

至此，您已经拥有了一个完全由自己亲手搭建的、运行在鲲鹏 ARM 架构上的 openGauss 数据库学习环境。尽情探索吧！

---

## 如何使用 Navicat 连接 openGauss

在成功安装 openGauss 之后，我们通常希望使用 Navicat 这样的图形化工具进行数据库管理。默认情况下，出于严格的安全考虑，数据库是与外部网络隔离的。本指南将引导您完成所有必要步骤，安全地打通外部连接。

### 第一步：调整 openGauss 核心配置

首先，我们需要调整 openGauss 的核心配置，允许它接收来自外部网络的连接请求。

**⚠️注意：** 以下所有服务器操作都必须以 `omm` 用户执行。如果您当前是 `root` 用户，请先切换：`su - omm`

#### 1. 配置 `pg_hba.conf` (客户端认证文件)

此文件定义了访问策略：谁可以从哪里、以何种方式连接。

*   **编辑文件：**
    ```bash
    vi /gaussdb/data/db1/pg_hba.conf
    ```
*   **添加远程访问规则：**
    在 `vi` 编辑器中，按 `G` 跳转到文件末尾，再按 `o` 新起一行进入编辑模式。添加下面这**一整行**内容：
    ```
    host    all             all             0.0.0.0/0               sha256
    ```
    > **📖 规则解读：**
    > *   `host`：允许通过 TCP/IP 网络连接。
    > *   `all` (数据库): 允许连接到**所有**数据库。
    > *   `all` (用户): 允许**所有**用户进行连接尝试。
    > *   `0.0.0.0/0`：允许来自**任何IP地址**的客户端连接。
    > *   `sha256`：连接时必须使用密码进行验证。

*   **保存并退出：** 按 `Esc` 键，然后输入 `:wq` 并回车。

#### 2. 配置 `postgresql.conf` (数据库主配置文件)

此文件定义了数据库服务监听的网络接口。

*   **编辑文件：**
    ```bash
    vi /gaussdb/data/db1/postgresql.conf
    ```
*   **修改监听地址：**
    在 `vi` 中，输入 `/listen` 并回车，快速定位到 `listen_addresses` 所在行。将其修改为：
    ```
    listen_addresses = '*'
    ```
    > **📖 修改解读：**
    > *   去掉行首可能存在的 `#` 注释符。
    > *   将 `'localhost'` 修改为 `'*'`，代表在服务器的**所有网络接口**上进行监听，而不仅仅是本地回环地址。

*   **保存并退出：** 按 `Esc` 键，输入 `:wq` 并回车。

---

### 第二步：重启 openGauss 服务以应用新配置

任何配置文件的更改，都需要通过重启服务来使其生效。

**继续以 `omm` 用户**执行以下命令：
```bash
# 停止数据库集群
gs_om -t stop

# 启动数据库集群
gs_om -t start
```
> ✅ **验证：** 看到 `Successfully started cluster.` 即表示重启成功。

---

### 第三步：配置云服务器防火墙（安全组）

这是打通外部访问的“最后一公里”，也是最容易被遗忘的一步。我们需要在华为云的防火墙中，为数据库的 `26000` 端口放行。

1.  登录**华为云控制台**，进入“弹性云服务器 ECS”。
2.  找到您的 `opengause` 实例，点击实例名进入详情页。
3.  选择“**安全组**”标签页，点击当前绑定的安全组名称 (如 `Sys-default`)。
4.  在安全组规则页面，选择“**入方向规则**”，然后点击“**添加规则**”。
5.  **创建新规则：**
    *   **优先级**：`1` (保持默认)
    *   **策略**：`允许`
    *   **协议端口**：`TCP`，端口填 `26000`
    *   **源地址**：`0.0.0.0/0` (允许任何IP访问，方便学习测试)
    *   **描述**：`openGauss-26000-port` (方便识别)
6.  点击“**确定**”保存规则。

---

### 第四步：创建专用的远程登录用户

**这是最关键的一步！** 出于极致的安全设计，openGauss **禁止**安装时创建的“初始用户”（即 `omm`）从外部网络直接登录。因此，我们必须创建一个新的管理员用户，专门用于远程连接。

1.  **在服务器上本地登录数据库：**
    以 `omm` 用户身份，执行 `gsql` 命令进入数据库。
    ```bash
    gsql -d postgres -p 26000
    ```
    系统会提示输入密码，请输入您**安装时为 `omm` 设置的数据库密码**。

2.  **创建新用户并授权：**
    成功登录后，您会看到 `postgres=#` 提示符。请执行以下SQL命令来创建新用户。
    > 💡 **请务必修改**下面的 `navicat_user` 和 `123abc!!!` 为您自己的设定！

    ```sql
    CREATE USER navicat_user WITH PASSWORD '123abc!!!' SYSADMIN;
    ```
    > **📖 命令解读：**
    > *   `CREATE USER navicat_user`：创建一个名为 `navicat_user` 的新用户。
    > *   `WITH PASSWORD '...'`：为该用户设置一个健壮的密码。
    > *   `SYSADMIN`：授予该用户系统管理员权限，使其能执行管理任务。

3.  **退出数据库客户端：** 创建成功后，输入 `\q` 并回车。

---

### 第五步：配置 Navicat 并成功连接

现在，所有准备工作都已就绪。

1.  打开 Navicat，点击“连接” -> **“PostgreSQL”**。
2.  在连接设置窗口中，填写如下信息：
    *   **主机**：您ECS的 **公网IP地址**。
    *   **端口**：`26000`
    *   **初始数据库**：`postgres`
    *   **用户名**：`navicat_user` (**注意：** 是您刚刚创建的新用户，不是`omm`！)
    *   **密码**：`123abc!!!` (您为新用户设定的密码)
3.  点击“**测试连接**”。

如果一切顺利，您将看到梦寐以求的“**连接成功**”提示！点击“确定”保存，开始您的 openGauss 图形化管理之旅。