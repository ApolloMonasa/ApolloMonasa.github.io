---
# -------------------------------------------------------------------------------------
# |                           核心元数据 (Core Metadata)                            |
# -------------------------------------------------------------------------------------
# 【必填】文章标题：清晰、吸引人，并包含核心关键词
title: "工作流介绍"
# 【必填】文章发布日期
date: 2025-10-25T12:45:07+08:00
# 【建议】文章最后修改日期：更新文章后，请手动更新此日期，以告知搜索引擎内容已更新
lastmod: 2025-10-25T12:45:07+08:00
# 【必填】文章作者：FixIt主题支持多种格式
# 格式一: 简单字符串
# author: "ApolloMonasa"
# 格式二: 包含链接和头像的复杂对象 (推荐)
# author:
#     - {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://i.ooxx.ooo/i/ZGM0M.jpg"}
#     - ApolloMonasa
# 【必填】是否为草稿：发布前请务必设置为 false
draft: false
weight: 10

# -------------------------------------------------------------------------------------
# |                             SEO 与分享 (SEO & Sharing)                           |
# -------------------------------------------------------------------------------------
# 【核心SEO】文章描述：1-3句话，准确概括文章内容，包含关键词。会显示在搜索引擎结果中。
description: ""
# 【建议SEO】文章关键词：针对本文的特定关键词，用逗号分隔
keywords: []
# 【可选SEO】自定义URL：用于创建更简洁或更具描述性的URL，不设置则根据标题自动生成
# slug: "custom-url-slug-for-this-post"
# 【核心分享】社交分享预览图 (og:image)：非常重要！推荐尺寸 1200x630。
# 如果不设置，将使用 params.toml 中定义的全局 images。
# 将图片放在 /static/images/posts/ 目录下，然后在这里引用。
images: [] # 例如: ["/images/posts/my-post-banner.png"]

# -------------------------------------------------------------------------------------
# |                            内容组织 (Taxonomies)                               |
# -------------------------------------------------------------------------------------
# 【必填】标签：可以有多个，用于内容聚合
tags: [] # 例如: ["Minecraft", "教程"]
# 【必填】分类：通常只有一个，用于内容归档
categories: [Portfolio] # 例如: ["模组开发"]
# 【可选】系列：将多篇文章组织成一个系列，自动生成上一篇/下一篇链接
# series: [] # 例如: ["NeoForge 开发系列"]

# -------------------------------------------------------------------------------------
# |                         FixIt 主题特定配置 (Theme-Specific)                     |
# -------------------------------------------------------------------------------------
# 是否开启评论
comment: true
# 是否显示目录
toc: true
# 文章封面图：显示在文章列表和文章顶部
featuredImage: "" # 例如: "/images/posts/my-post-cover.jpg"
---


### 团队协作工作流


这个流程的核心思想是：**在将你解题的代码合并到公共的基础分支前，先将基础分支的最新代码同步到你自己的解题分支，在本地解决所有可能存在的冲突。**

#### **第一步：开始新题目之前，同步基础分支**

每次准备开始解答一个新问题时，必须先确保你本地的 `competition-2025` 分支是最新版本，包含了其他队友已经完成并合并的代码。

```bash
# 1. 切换到你们的基础分支
git checkout competition-2025

# 2. 从远程仓库(origin)拉取最新的代码并合并到本地
git pull origin competition-2025
```

#### **第二步：为新题目创建并切换到个人分支**

基于最新的基础分支，为你要解答的题目创建一个新的分支。按照你的要求，我们使用 `pro-x` 的格式。比如，你要开始做第8题 `alias`，你的分支可以这样命名：

```bash
# 从最新的 competition-2025 分支创建新分支并立即切换过去
# 格式建议: <你的名字>-pro-<题号>-<题⽬名>
git checkout -b apollo-pro-8-alias
```

#### **第三步：在你的分支上解题和提交**

现在你可以在 `apollo-pro-8-alias` 分支上安心地编写代码了。建议在完成一个小的功能点后就进行一次提交。

```bash
# 编写代码...
# ...
# ...

# 添加你修改的文件到暂存区
git add .

# 提交你的修改，并写清楚提交信息
git commit -m "solve: pro-8 alias, complete alias feature"
```

#### **第四步：准备合并回基础分支（最关键的一步）**

当你完成了你的题目，准备将其合并到 `competition-2025` 时，**非常重要的一步**：先在本地处理掉可能与队友产生的代码冲突。

```bash
# 1. 确保你当前分支的所有修改都已提交
git status

# 2. 获取远程仓库的最新数据（但先不合并到当前分支）
git fetch origin

# 3. 将远程最新的 competition-2025 分支合并到你当前的解题分支 (apollo-pro-8-alias)
git merge origin/competition-2025
```

执行 `git merge` 命令后，可能会出现两种情况：
1.  **无冲突**：Git 自动完成合并，并生成一个合并提交。一切顺利！
2.  **有冲突**：终端会提示 `CONFLICT (content): Merge conflict in ...`。这时，你需要进入下一步，手动解决冲突。

#### **第五步：解决合并冲突（详细讲解）**

这是整个流程的核心难点，请仔细阅读。

**1. 找到冲突文件**

当冲突发生时，Git 会在文件中用特殊的标记符标出冲突的地方。你可以用 `git status` 命令查看哪些文件发生了冲突，它们会显示在 `Unmerged paths` 部分。

```
$ git status
On branch apollo-pro-8-alias
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   src/parser/SqlParser.java
```

**2. 理解冲突标记**

用你的代码编辑器（推荐使用 VS Code，它有非常好的冲突解决可视化工具）打开冲突文件 `src/parser/SqlParser.java`，你会看到类似下面的内容：

```java
public class SqlParser {
    // ... some code ...
<<<<<<< HEAD
    // 这是你（Apollo）在 apollo-pro-8-alias 分支上写的关于 alias 的代码
    private void handleAlias() {
        // ... apollo's implementation
    }
=======
    // 这是你队友已经合并到 competition-2025 分支的代码
    private void handleAlias() {
        // ... teammate's implementation
    }
>>>>>>> origin/competition-2025
    // ... more code ...
}
```

*   `<<<<<<< HEAD`：这部分到 `=======` 之间，是**你当前分支 (`apollo-pro-8-alias`) 的代码**。`HEAD` 指向你当前所在的分支。
*   `=======`：这是分隔符。
*   `=======`：这部分到 `>>>>>>> origin/competition-2025` 之间，是**你正在合并进来的分支 (`competition-2025`) 的代码**。

**3. 解决冲突**

你的任务就是**手动编辑**这块代码，和队友沟通或根据逻辑判断，决定最终要保留成什么样子。
*   **只保留你的代码**：删除 `=======` 到 `>>>>>>>` 的所有内容，以及所有特殊标记符。
*   **只接受别人的代码**：删除 `<<<<<<<` 到 `=======` 的所有内容，以及所有特殊标记符。
*   **合并两者的代码**：这是最常见的情况。你需要和队友讨论，或者自己判断如何将两部分代码逻辑整合在一起，形成最终正确的版本。然后删除所有的特殊标记符。

例如，经过讨论，你们决定采用一种结合方案：

```java
public class SqlParser {
    // ... some code ...
    // 这是讨论后最终确定的代码版本
    private void handleAlias() {
        // ... the final correct implementation
    }
    // ... more code ...
}
```
**重要**：解决完后，文件里**不能**再有 `<<<<<<<`, `=======`, `>>>>>>>` 这些标记。

**4. 标记为已解决并提交**

当你手动修改完所有冲突文件并保存后，需要告诉 Git 你已经解决了这些冲突。

```bash
# 1. 将你修改好的文件添加到暂存区，这代表你确认了解决方案
git add src/parser/SqlParser.java

# 2. 如果有多个冲突文件，重复上一步，直到所有冲突文件都被 add

# 3. 当所有冲突都解决并 add 后，执行 commit 来完成这次合并
# Git 会自动生成一个默认的 commit message，你直接保存即可
git commit
```
现在，你的 `apollo-pro-8-alias` 分支就既包含了你自己的解题代码，也包含了团队 `competition-2025` 分支的所有最新更新，并且所有冲突都已在你的本地解决完毕。

#### **第六步：推送你的分支并发起合并请求 (Pull Request)**

你的本地分支已经“干净”且是最新状态，现在可以推送到远程仓库了。

```bash
git push origin apollo-pro-8-alias
```

然后，去 GitHub 的项目页面，系统通常会自动提示你为 `apollo-pro-8-alias` 分支创建一个 **Pull Request (PR)**。点击创建，填写好标题和描述，指派你的队友进行代码审查。

#### **第七步：审查与合并**

队友审查你的代码，确认无误后，就可以通过网页上的 "Merge Pull Request" 按钮，将你的 `apollo-pro-8-alias` 分支正式合并到 `competition-2025` 分支中。

因为你之前已经在本地解决了所有冲突，所以这一步在网页上**不会**再有任何冲突，可以顺利合并。
