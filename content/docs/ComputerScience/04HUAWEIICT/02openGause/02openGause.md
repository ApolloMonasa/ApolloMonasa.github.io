---
# -------------------------------------------------------------------------------------
# |                           核心元数据 (Core Metadata)                            |
# -------------------------------------------------------------------------------------
# 【必填】文章标题：清晰、吸引人，并包含核心关键词
title: "在 openEuler 上安装 openGauss 数据库"
# 【必填】文章发布日期
date: 2025-11-02T00:55:29+08:00
# 【建议】文章最后修改日期：更新文章后，请手动更新此日期，以告知搜索引擎内容已更新
lastmod: 2025-11-02T00:55:29+08:00
# 【必填】文章作者：FixIt主题支持多种格式
# 【必填】是否为草稿：发布前请务必设置为 false
draft: false
# 【建议】文章权重：数字越大，在列表中越靠后。用于系列文章排序。
weight: 20

# -------------------------------------------------------------------------------------
# |                             SEO 与分享 (SEO & Sharing)                           |
# -------------------------------------------------------------------------------------
# 【核心SEO】文章描述：1-3句话，准确概括文章内容，包含关键词。会显示在搜索引擎结果中。
description: "继上一篇虚拟机网络配置教程后，本篇将手把手指导你在准备好的 openEuler 系统上，一步步完成 openGauss 数据库的安装与初始化，搭建一个稳定可靠的数据库学习与开发环境。"
# 【建议SEO】文章关键词：针对本文的特定关键词，用逗号分隔
keywords: ["openGauss", "数据库安装", "openEuler", "Linux", "Database", "DevOps"]
# 【可选SEO】自定义URL：用于创建更简洁或更具描述性的URL，不设置则根据标题自动生成
slug: "opengauss-installation-on-openeuler"
# 【核心分享】社交分享预览图 (og:image)：非常重要！推荐尺寸 1200x630。
# 如果不设置，将使用 params.toml 中定义的全局 images。
# 将图片放在 /static/images/posts/ 目录下，然后在这里引用。
images: ["/images/posts/opengauss-installation-banner.png"]

# -------------------------------------------------------------------------------------
# |                            内容组织 (Taxonomies)                               |
# -------------------------------------------------------------------------------------
# 【必填】标签：可以有多个，用于内容聚合
tags: ["openGauss", "Database", "Linux", "openEuler", "DevOps"]
# 【必填】分类：通常只有一个，用于内容归档
categories: ["技术教程"]
# 【可选】系列：将多篇文章组织成一个系列，自动生成上一篇/下一篇链接
series: ["虚拟机 DevOps 环境搭建"]

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

## 前言

在上一篇 [《虚拟机安装和配置(网卡篇)》](../01vm) 中，我们已经成功搭建了一个网络稳定的 openEuler 虚拟机环境。现在，是时候在上面建造我们的核心应用了——**openGauss 数据库**。

本教程将承接上文，指导你在这台配置好的虚拟机上，从零开始完整地安装和初始化 openGauss 数据库。我们将遵循官方推荐的最佳实践，确保安装过程清晰、顺畅。

**准备工作：**
*   一个已按上篇教程配置好双网卡的 openEuler 虚拟机。
*   使用 `root` 用户通过 SSH 登录到虚拟机（推荐使用 `192.168.170.130` 这个稳定的内部 IP）。

---

## 第一步：操作系统环境准备

在正式安装之前，我们需要对操作系统进行一些必要的配置，为 openGauss 的稳定运行扫清障碍。

#### 1. 关闭防火墙

在学习和开发环境中，为了避免复杂的端口配置问题，我们通常会先关闭防火墙。

```bash
# 停止防火墙服务
systemctl stop firewalld.service
# 禁止防火墙开机自启
systemctl disable firewalld.service
```
{{< admonition type="tip" title="生产环境提示" >}}
在生产环境中，不应直接关闭防火墙，而是应该精确地开放 openGauss 需要的端口（如 `26000`）。
{{< /admonition >}}

#### 2. 设置字符集与环境变量

配置统一的字符集和 openGauss 需要的环境变量。

```bash
# 依次执行以下命令，将环境变量追加到 /etc/profile 文件中
cat >> /etc/profile << EOF
export LANG=en_US.UTF-8
EOF

cat >> /etc/profile << EOF
export packagePath=/opt/software/openGauss
EOF

cat >> /etc/profile << EOF
export LD_LIBRARY_PATH=\$packagePath/script/gspylib/clib:\$LD_LIBRARY_PATH
EOF

# 让配置立即生效
source /etc/profile

# 验证变量是否生效
echo $LD_LIBRARY_PATH
# 预期输出: /opt/software/openGauss/script/gspylib/clib:
```

#### 3. 关闭 Swap 交换分区

数据库是对 I/O 性能非常敏感的应用。当物理内存不足时，操作系统会使用硬盘上的 Swap 分区，这将导致性能急剧下降。因此，通常建议关闭 Swap。

```bash
# 临时关闭 Swap
swapoff -a
# 永久关闭：编辑 /etc/fstab 文件，注释掉包含 swap 的那一行（可选）
```

#### 4. 安装依赖包

openGauss 的运行依赖于一些基础库，我们使用 `yum` 进行安装。

```bash
yum install libaio* -y
yum install libnsl* -y
```

#### 5. 设置默认 Python 版本

openGauss 的安装脚本依赖 Python 3。我们需要确保系统中的 `python` 命令指向的是 `python3`。

```bash
# 创建软链接
ln -s /usr/bin/python3 /usr/bin/python

# 验证版本
python -V
# 预期输出: Python 3.x.x
```
---

## 第二步：创建配置文件与下载安装包

#### 1. 创建安装目录

我们将所有与安装相关的文件都放在 `/opt/software/openGauss` 目录下。

```bash
mkdir -p /opt/software/openGauss
cd /opt/software/openGauss
```

#### 2. 创建 XML 配置文件

openGauss 使用 XML 文件来定义集群的配置信息，这是整个安装过程的“蓝图”。

```bash
# 创建并编辑配置文件
vi clusterconfig.xml
```

将以下内容**复制并粘贴**到 `clusterconfig.xml` 文件中。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ROOT>
    <!-- openGauss整体信息 -->
    <CLUSTER>
        <PARAM name="clusterName" value="dbCluster" />
        <PARAM name="nodeNames" value="db1" /> <!-- 主机名，请根据实际情况修改 -->
        <PARAM name="backIp1s" value="192.168.170.130"/> <!-- 内部通信IP，使用我们的仅主机IP -->
        <PARAM name="gaussdbAppPath" value="/opt/gaussdb/app" />
        <PARAM name="gaussdbLogPath" value="/var/log/gaussdb" />
        <PARAM name="gaussdbToolPath" value="/opt/huawei/wisequery" />
        <PARAM name="corePath" value="/opt/opengauss/corefile"/>
        <PARAM name="clusterType" value="single-inst"/>
    </CLUSTER>
    <!-- 每台服务器上的节点部署信息 -->
    <DEVICELIST>
        <!-- node1上的节点部署信息 -->
        <DEVICE sn="1000001">
            <PARAM name="name" value="db1"/> <!-- 主机名，与上面保持一致 -->
            <PARAM name="azName" value="AZ1"/>
            <PARAM name="azPriority" value="1"/>
            <!-- 如果服务器只有一个网卡可用，将backIP1和sshIP1配置成同一个IP -->
            <PARAM name="backIp1" value="192.168.170.130"/> <!-- 内部通信IP -->
            <PARAM name="sshIp1" value="192.168.170.130"/> <!-- SSH管理IP -->

            <!--dbnode-->
            <PARAM name="dataNum" value="1"/>
            <PARAM name="dataPortBase" value="26000"/>
            <PARAM name="dataNode1" value="/gaussdb/data/db1"/>
        </DEVICE>
    </DEVICELIST>
</ROOT>
```

{{< admonition type="warning" title="配置关键点" >}}
-   `nodeNames` 和 `DEVICE` 中的 `name`: 应该与你的虚拟机主机名一致。你可以使用 `hostname` 命令查看。
-   `backIp1s`, `backIp1`, `sshIp1`: **全部使用我们在上一篇教程中配置的“仅主机”网络 IP**，即 `192.168.170.130`。这是确保安装脚本能正确通信的关键。
-   记得删除中文注释避免编码类错误
{{< /admonition >}}

#### 3. 下载并解压安装包

```bash
# 切换到安装目录
cd /opt/software/openGauss

# 使用 wget 下载 openGauss 5.0.1 安装包
wget https://opengauss.obs.cn-south-1.myhuaweicloud.com/5.0.1/x86_openEuler_2203/openGauss-5.0.1-openEuler-64bit-all.tar.gz

# 解压第一层
tar -zxvf openGauss-5.0.1-openEuler-64bit-all.tar.gz

# 解压第二层（OM工具包）
tar -zxvf openGauss-5.0.1-openEuler-64bit-om.tar.gz

# 赋予权限
chmod 755 -R /opt/software
```

---

## 第三步：执行安装与初始化

安装过程分为两步：预安装（root用户）和正式安装（omm用户）。

#### 1. 执行预安装脚本

`gs_preinstall` 脚本会自动创建数据库管理员用户 `omm`，配置互信，并检查环境是否满足要求。

```bash
# 进入脚本目录
cd /opt/software/openGauss/script

# 以 root 用户执行预安装
./gs_preinstall -U omm -G dbgrp -X /opt/software/openGauss/clusterconfig.xml
```

在执行过程中，系统会提示：
1.  `Are you sure you want to create the user[omm] and create trust for it (yes/no)?` -> 输入 `yes` 回车。
2.  `Please enter password for cluster user.` -> 输入 `omm` 用户的密码（例如：`openGauss@123`），密码要求复杂性。
3.  `Please enter password for cluster user again.` -> 再次输入密码确认。

当看到 `Preinstallation succeeded.` 时，表示预安装完成。

#### 2. 初始化数据库

为了确保所有环境配置生效，建议先重启一下虚拟机。

```bash
init 6
```

虚拟机重启后，重新用 `root` 用户 SSH 登录，然后切换到 `omm` 用户来执行最终的安装。

```bash
# 赋予权限（重启后可能需要）
chmod 755 -R /opt/software

# 切换到 omm 用户
su - omm

# 进入脚本目录
cd /opt/software/openGauss/script

# 执行安装命令（这是一整行命令）
./gs_install -X /opt/software/openGauss/clusterconfig.xml --gsinit-parameter="--encoding=UTF8"  --dn-guc="max_process_memory=2GB" --dn-guc="shared_buffers=128MB" --dn-guc="bulk_write_ring_size=128MB" --dn-guc="cstore_buffers=16MB"
```
{{< admonition type="info" title="内存参数说明" >}}
-   `--dn-guc` 用于设置数据库的 GUC 参数（Grand Unified Configuration）。
-   `max_process_memory`: 数据库节点可用的最大内存，应小于你的虚拟机内存。
-   `shared_buffers`: 共享内存大小，是影响性能的关键参数。
-   以上参数是针对内存较小（如2GB-4GB）的虚拟机的示例，请根据实际情况调整。
{{< /admonition >}}

执行过程中，系统会提示：
1.  `Please enter password for database:` -> 设置数据库**超级用户 `omm` 的密码**（可以和系统 `omm` 用户密码相同，如 `openGauss@123`）。
2.  `Please repeat for database:` -> 再次输入确认。

当看到 `Successfully installed application.` 时，恭喜你，openGauss 已经成功安装并启动了！

---

## 第四步：验证与清理

#### 1. 验证数据库连接

作为 `omm` 用户，我们可以直接登录数据库进行验证。

```bash
# 使用 gsql 客户端连接，端口号是 XML 中定义的 26000
gsql -d postgres -p 26000

# 成功连接后，会看到 openGauss=# 提示符
# 查看所有数据库
openGauss=# \l
# 退出客户端
openGauss=# \q
```

#### 2. 清理安装包

安装完成后，安装包文件可以被清理以节省磁盘空间。

```bash
# 切换回 root 用户
exit

# 进入安装目录
cd /opt/software/openGauss/

# 删除压缩包
rm -rf openGauss-5.0.1-openEuler-64bit-all.tar.gz
rm -rf openGauss-5.0.1-openEuler-64bit-om.tar.gz
```

---

## 总结

至此，你已经在一个网络环境稳定可靠的 openEuler 虚拟机上，成功部署了一套单机版的 openGauss 数据库。从基础的操作系统配置到核心的数据库初始化，每一步都为后续的学习和开发打下了坚实的基础。

现在，你可以开始探索 openGauss 的世界了：创建用户、建立表、学习 SQL、进行性能测试等等。这个环境将是你可靠的实验伙伴。
