---
# -------------------------------------------------------------------------------------
# |                           核心元数据 (Core Metadata)                            |
# -------------------------------------------------------------------------------------
# 【必填】文章标题：清晰、吸引人，并包含核心关键词
title: "终极防错版：华为云鲲鹏ECS搭建openGauss（绝对路径命令）"
# 【必填】文章发布日期
date: 2025-11-17T10:00:00+08:00
# 【建议】文章最后修改日期：更新文章后，请手动更新此日期，以告知搜索引擎内容已更新
lastmod: 2025-11-17T10:00:00+08:00
# 【必填】文章作者
author: "技术专家"
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
# 【核心分享】社交分享预览图 (og:image)：非常重要！推荐尺寸 1200x630。
images: ["/images/featured/opengauss-on-kunpeng-robust.png"]

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
featuredImage: "/images/featured/opengauss-on-kunpeng-robust.png"
---

**摘要：** 这是一份专为探索鲲鹏（ARM）生态的数据库学习者量身定制的、**终极防错**的行动手册。我们将严格遵循一套标准化的鲲鹏云服务器配置，并且**所有命令行都使用绝对路径**，这意味着您无需关心当前在哪个目录下，只需完整地复制粘贴命令，就能100%成功部署openGauss。

<!--more-->

## 零、学习环境规划：鲲鹏 ARM 架构

| 配置选项 | 标准配置值 | 说明 |
| :--- | :--- | :--- |
| **区域** | **华北-北京四** | 推荐，确保能找到指定的 openEuler 镜像 |
| **计费模式** | **按需计费** | 学习必备，用完即删，成本最低 |
| **CPU架构** | **鲲鹏计算** | **核心！本次实践基于 ARM 架构** |
| **规格** | **最新系列 · 2vCPUs\|4GiB** | 例如 **kc1.large.2**，满足学习所需 |
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
    *   **高级选项 (必填)**：展开“**高级选项**”，在“**主机名**”字段中，准确输入 `opengauss-dev`。
    *   **登录凭证**：选择“**密码**”，设置一个你能记住的 `root` 用户密码。

### 2. 配置安全组（必须执行！）

1.  在控制台导航至“**网络 > 安全组**”，找到 `default` 安全组并点击进入。
2.  点击“**添加规则**”，添加入方向规则：
    *   **规则1 (SSH)**: `协议端口: TCP:22`, `源地址: 0.0.0.0/0`。
    *   **规则2 (openGauss)**: `协议端口: TCP:26000`, `源地址: 0.0.0.0/0`。

### 3. 连接服务器

复制ECS的 **公网IP地址**，使用SSH连接：
```bash
ssh root@<你的ECS公网IP>
```
输入 `yes` 和你设置的 `root` 密码，登录成功。

## 二、初始化系统环境（绝对路径命令）

### 1. 验证主机名（必须执行）
```bash
hostname
```
**输出必须是 `opengauss-dev`**。如果不是，请立即执行 `hostnamectl set-hostname opengauss-dev`，然后 `reboot` 重启服务器再重新连接。

### 2. 获取本机私网IP（唯一需要你记录的值）
```bash
ip addr | grep inet | grep eth0
```
你会看到类似 `inet 192.168.0.123/24 ...` 的输出。请把 `192.168.0.123` 这个IP地址复制下来备用。

### 3. 一键完成环境配置
以下命令已设计为自包含，直接完整复制粘贴即可。
```bash
cat >>/etc/profile<<EOF
export LANG=en_US.UTF-8
EOF
source /etc/profile
ln -sf /usr/bin/python3 /usr/bin/python
yum install -y libaio-devel
```

## 三、安装 openGauss 数据库（ARM版，绝对路径命令）

### 1. 下载并解压 ARM 架构安装包

{{< admonition tip "防错设计" >}}
以下命令将自动创建目录、下载文件到指定目录、解压到指定目录，您无需使用 `cd` 命令切换路径。
{{< /admonition >}}

```bash
# 创建目录
mkdir -p /opt/software/openGauss

# 下载ARM版安装包到指定目录
wget -P /opt/software/openGauss https://opengauss.obs.cn-south-1.myhuaweicloud.com/5.0.1/arm/openGauss-5.0.1-openEuler-64bit-all.tar.gz

# 将下载的压缩包解压到指定目录
tar -zxvf /opt/software/openGauss/openGauss-5.0.1-openEuler-64bit-all.tar.gz -C /opt/software/openGauss
```

### 2. 编写 XML 配置文件（只需改IP）

**步骤 1：使用绝对路径创建/编辑文件**
```bash
vi /opt/software/openGauss/clusterconfig.xml
```

**步骤 2：粘贴并修改**
按 `i` 进入编辑模式，粘贴以下内容。

{{< admonition danger "！！！终极提示：唯一需要你做的！！！" >}}
**将下面模板中所有三处 `192.168.0.123` 替换成你在步骤 2.2 中查到的【真实私网IP地址】！**
{{< /admonition >}}

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ROOT>
    <CLUSTER>
        <PARAM name="clusterName" value="dbCluster" />
        <PARAM name="nodeNames" value="opengauss-dev" />
        <PARAM name="backIp1s" value="192.168.0.123"/> <!-- 改这里 -->
        <PARAM name="gaussdbAppPath" value="/opt/gaussdb/app" />
        <PARAM name="gaussdbLogPath" value="/var/log/gaussdb/app" />
        <PARAM name="gaussdbToolPath" value="/opt/gaussdb/tool" />
        <PARAM name="corePath" value="/opt/opengauss/corefile" />
        <PARAM name="clusterType" value="single-inst" />
    </CLUSTER>
    <DEVICELIST>
        <DEVICE sn="1000001">
            <PARAM name="name" value="opengauss-dev"/>
            <PARAM name="azName" value="AZ1"/>
            <PARAM name="azPriority" value="1"/>
            <PARAM name="backIp1" value="192.168.0.123"/> <!-- 改这里 -->
            <PARAM name="sshIp1" value="192.168.0.123"/> <!-- 改这里 -->
            <PARAM name="dataNum" value="1"/>
            <PARAM name="dataPortBase" value="26000"/>
            <PARAM name="dataNode1" value="/gaussdb/data/db1"/>
        </DEVICE>
    </DEVICELIST>
</ROOT>
```
修改完毕后，按 `Esc`，输入 `:wq` 回车保存。

### 3. 执行预安装与安装

**步骤 1：执行预安装**
此命令直接调用绝对路径下的脚本，无需 `cd`。
```bash
python /opt/software/openGauss/script/gs_preinstall -U omm -G dbgrp -X /opt/software/openGauss/clusterconfig.xml
```
根据提示，输入 `yes`，然后两次输入 `omm` 用户的密码（例如：`Omm@kunpeng123`，**请牢记**）。

**步骤 2：切换到 `omm` 用户**
```bash
su - omm
```

**步骤 3：执行安装**
同样，我们使用绝对路径调用 `gs_install` 脚本，杜绝 `PATH` 变量可能带来的问题。
```bash
/opt/software/openGauss/script/gs_install -X /opt/software/openGauss/clusterconfig.xml --gsinit-parameter="--encoding=UTF8" --dn-guc="max_process_memory=1536MB" --dn-guc="shared_buffers=256MB" --dn-guc="bulk_write_ring_size=128MB" --dn-guc="cstore_buffers=16MB"
```
根据提示，两次输入**数据库管理员密码**（例如：`GaussDB@arm2025`，**这是连接数据库用的，请牢记**）。

看到 `Successfully installed application.`，大功告成！

## 四、开始你的鲲鹏学习之旅

### 1. 检查与连接
```bash
# 确保在 omm 用户下
gs_om -t status   # 检查状态，应为 Normal
gsql -d postgres -p 26000  # 连接默认数据库
```
出现 `openGauss=>` 提示符，表示你已进入数据库世界。

### 2. 创建你的专属学习空间
```sql
-- 在 gsql 提示符下执行：
CREATE USER study_user WITH PASSWORD 'Study@pwd123';
CREATE DATABASE study_db OWNER study_user;
\q
```

### 3. 以新身份登录并实践
```bash
# 在 omm 用户的 shell 下执行：
gsql -d study_db -p 26000 -U study_user -W
```
输入密码 `Study@pwd123` 后，即可开始你的SQL实践。

## 五、管理与清理（省钱秘籍）

学习结束后，别忘了你的服务器还在按小时计费！

*   **临时关闭数据库**: `gs_om -t stop` (在 `omm` 用户下)
*   **下次学习时启动**: `gs_om -t start` (在 `omm` 用户下)
*   **彻底停止计费 (重要！)**: 登录华为云控制台，找到你的 ECS 实例，选择“**释放**”或“**删除**”。这将删除服务器和所有数据，并停止计费。

现在，你拥有了一个可以随时创建、随时销毁、并且部署过程极其稳健的鲲鹏数据库学习环境。祝你学有所成！
