---
title: "在华为云鲲鹏ARM主机上搭建openGauss数据库完整教程"
date: 2025-11-14T10:00:00+08:00
description: "本教程详细记录了从零开始，在华为云ECS（鲲鹏ARM架构）上安装和配置openGauss数据库的全过程，包括环境准备、Python版本切换、配置文件创建、安装执行，以及后续的Navicat远程连接配置。"
draft: false
weight: 30
---

## 一、准备云主机 (ECS)

在开始安装 openGauss 之前，您需要一台符合特定配置的华为云主机 (ECS)。请确保您的主机配置与下表严格一致，特别是 **区域** 和 **CPU架构**，这将直接影响后续步骤的成功与否。

### 表1-1 ECS 基础配置

| 配置选项 | 配置值 |
| :--- | :--- |
| **区域** | 华北-北京四 (推荐, 其他区域可能会导致无法选择openEuler公共镜像) |
| **计费模式** | 按需计费 (一定要选按需计费, 注意配置费用) |
| **CPU架构** | 鲲鹏计算 |
| **规格** | 最新系列 · 2vCPUs|4GiB |
| **镜像** | 公共镜像：<br> openEuler<br> openEuler-20.03-64bit-with-ARM(40GB) |

## 二、环境初始化与准备

在主机创建完毕后，我们需要以 `root` 用户身份登录，并进行一系列环境初始化操作。

### 1. 设置字符集参数 (1.3.2)

将各数据库节点的字符集设置为相同的字符集，可以在 `/etc/profile` 文件中添加 “export LANG=XXX” (XXX 为 Unicode 编码)。

**步骤1 ->** 在 `/etc/profile` 文件中添加 “`export LANG=en_US.UTF-8`”。
```bash
cat >>/etc/profile<<EOF
export LANG=en_US.UTF-8
EOF
```

**步骤2 ->** 输入如下命令，使配置修改生效。
```bash
source /etc/profile
```

### 2. 修改 python 版本并安装 libaio 包 (1.3.3)

之后安装过程中 openGauss 用户互信，openEuler 服务器需要用到 Python-3.7.x 命令，但是默认 Python 版本为 Python-2.7.x，所以需要切换 Python 版本。

**步骤1 ->** 备份 python 文件。
```bash
mv /usr/bin/python /usr/bin/python.bak
```

**步骤2 ->** 建立 Python3 软连接。
```bash
ln -s /usr/bin/python3 /usr/bin/python
```

**步骤3 ->** 验证 Python 版本。
```bash
python -V
```
预期显示如下，即为 Python 版本切换成功：
`Python 3.7.9` (或类似的版本号)

**步骤4 ->** Python 版本切换成功，后续安装需要 libaio 包，下载进行安装。
```bash
yum install libaio* -y
```

## 三、安装 openGauss 数据库

环境准备就绪，现在正式开始 openGauss 的安装流程。

### 1. 下载数据库安装包 (1.4.1)

**步骤1 ->** 以 root 用户登录待安装 openGauss 的主机，并按规划创建存放安装包的目录。
```bash
mkdir -p /opt/software/openGauss
chmod 755 -R /opt/software
```
> **注：**
> *   不建议把安装包的存放目录规划到 openGauss 用户的 home 目录或其子目录下，可能导致权限问题。
> *   openGauss 安装用户 omm 须具有 /opt/software/openGauss 目录的读写权限。

**步骤2 ->** 下载数据库安装包到安装目录。

切换到安装目录：
```bash
cd /opt/software/openGauss
```

使用 wget 下载安装包：
```bash
wget https://opengauss.obs.cn-south-1.myhuaweicloud.com/5.0.1/arm/openGauss-5.0.1-openEuler-64bit-all.tar.gz
```

### 2. 创建 XML 配置文件 (1.4.2)

安装 openGauss 前需要创建 XML 文件，用于告知 openGauss 如何部署。

**步骤1 ->** 切换到存放安装包的目录。
```bash
cd /opt/software/openGauss
```

**步骤2 ->** 创建 XML 配置文件，用于数据库安装。
```bash
vi clusterconfig.xml
```

**步骤3 ->** 输入 `i` 进入 INSERT 模式，添加文本如下。
> **注意：** 下方的配置已根据您的主机名 `opengauss` 和内网IP `192.168.0.99` 进行了预设。请直接复制粘贴全部内容。
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ROOT>
    <CLUSTER>
        <PARAM name="clusterName" value="dbCluster" />
        <PARAM name="nodeNames" value="opengauss" />
        <PARAM name="backIp1s" value="192.168.0.99" />
        <PARAM name="gaussdbAppPath" value="/opt/gaussdb/app" />
        <PARAM name="gaussdbLogPath" value="/var/log/gaussdb" />
        <PARAM name="gaussdbToolPath" value="/opt/huawei/wisequery" />
        <PARAM name="corePath" value="/opt/opengauss/corefile" />
        <PARAM name="clusterType" value="single-inst" />
    </CLUSTER>
    <DEVICELIST>
        <DEVICE sn="1000001">
            <PARAM name="name" value="opengauss"/>
            <PARAM name="azName" value="AZ1"/>
            <PARAM name="azPriority" value="1"/>
            <PARAM name="backIp1" value="192.168.0.99"/>
            <PARAM name="sshIp1" value="192.168.0.99"/>
            <!--dbnode-->
            <PARAM name="dataNum" value="1"/>
            <PARAM name="dataPortBase" value="26000"/>
            <PARAM name="dataNode1" value="/gaussdb/data/db1" />
        </DEVICE>
    </DEVICELIST>
</ROOT>
```

**步骤4 ->** 点击 `Esc` 退出 INSERT 模式，然后输入 `:wq` 后回车退出编辑并保存文本。

### 3. 初始化安装环境 (1.4.3)

在执行安装前，需要运行安装前置脚本 `gs_preinstall`，准备好安装用户及环境。

**步骤 1 ->** 修改 performance.sh 文件。
使用 vi 打开文件 “/etc/profile.d/performance.sh”：
```bash
vi /etc/profile.d/performance.sh
```
输入 “`i`”，进入 INSERT 模式。用 `#` 注释 `sysctl -w vm.min_free_kbytes=112640 &>/dev/null` 这行内容，并将下列内容复制粘贴到文件末尾：
```bash
CPUNO=`cat /proc/cpuinfo|grep processor|wc -l`
export GOMP_CPU_AFFINITY=0-$[CPUNO - 1]

#sysctl -w vm.min_free_kbytes=112640 &>/dev/null
sysctl -w vm.dirty_ratio=60 &>/dev/null
sysctl -w kernel.sched_autogroup_enabled=0 &>/dev/null
```
按 “`Esc`” 键，退出 INSERT 模式，接着输入 “`:wq`” 后回车，保存退出。

**步骤 2 ->** 在安装包所在的目录下，解压安装包。
```bash
cd /opt/software/openGauss
tar -zxvf openGauss-5.0.1-openEuler-64bit-all.tar.gz
tar -zxvf openGauss-5.0.1-openEuler-64bit-om.tar.gz
```

**步骤 3 ->** 切换到 `gs_preinstall` 命令所在目录。
```bash
cd /opt/software/openGauss/script/
```

**步骤 4 ->** 采用交互模式执行预安装脚本。
```bash
python gs_preinstall -U omm -G dbgrp -X /opt/software/openGauss/clusterconfig.xml
```
在执行过程中，根据提示选择是否创建互信，填写 **`yes`**。然后按提示为新创建的 `omm` 用户设置密码。
> **说明：** 输入密码时，屏幕上不会有任何反馈，这是正常的Linux安全机制。

成功后显示为 `Preinstallation succeeded.`。

### 4. 执行安装 (1.4.4)

执行前置脚本准备好 openGauss 安装环境之后，按照启动安装过程部署 openGauss。

**步骤 1 ->** 修改文件权限 (以 `root` 用户执行)。
```bash
chmod -R 755 /opt/software/openGauss/script
```

**步骤 2 ->** 切换到 `omm` 用户。
```bash
su - omm
```

**步骤 3 ->** 使用 `gs_install` 安装 openGauss (以 `omm` 用户执行)。
```bash
gs_install -X /opt/software/openGauss/clusterconfig.xml --gsinit-parameter="--encoding=UTF8" --dn-guc="max_process_memory=4GB" --dn-guc="shared_buffers=256MB" --dn-guc="bulk_write_ring_size=256MB" --dn-guc="cstore_buffers=16MB"
```
在执行过程中，用户需根据提示输入数据库管理员 `omm` 用户的密码，密码需满足一定的复杂度要求（至少8位，包含大写、小写、数字、特殊字符中的三类）。请牢记此密码。

显示 `Successfully installed application.` 即为安装成功。

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
2.  找到您的 `opengauss` 实例，点击实例名进入详情页。
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
