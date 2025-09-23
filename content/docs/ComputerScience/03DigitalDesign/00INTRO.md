---
# -------------------------------------------------------------------------------------
# |                           核心元数据 (Core Metadata)                            |
# -------------------------------------------------------------------------------------
# 【必填】文章标题：清晰、吸引人，并包含核心关键词
title: "数电简介"
# 【必填】文章发布日期
date: 2025-09-23T08:52:40+08:00
# 【建议】文章最后修改日期：更新文章后，请手动更新此日期，以告知搜索引擎内容已更新
lastmod: 2025-09-23T08:52:40+08:00
# 【必填】文章作者：FixIt主题支持多种格式
# 格式一: 简单字符串
# author: "ApolloMonasa"
# 格式二: 包含链接和头像的复杂对象 (推荐)
# author:
#     - {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://i.ooxx.ooo/i/ZGM0M.jpg"}
#     - ApolloMonasa
# 【必填】是否为草稿：发布前请务必设置为 false
draft: false

# -------------------------------------------------------------------------------------
# |                             SEO 与分享 (SEO & Sharing)                           |
# -------------------------------------------------------------------------------------
# 【核心SEO】文章描述：1-3句话，准确概括文章内容，包含关键词。会显示在搜索引擎结果中。
description: "简要介绍数电课程内容和重要性"
# 【建议SEO】文章关键词：针对本文的特定关键词，用逗号分隔
keywords: ["Verilog HDL", "数字电路", "数电", "数字电路设计"]
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
tags: ["计科", "数电"] # 例如: ["Minecraft", "教程"]
# 【必填】分类：通常只有一个，用于内容归档
categories: ["Docs"] # 例如: ["模组开发"]
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

**摘要：** 简要介绍数电课程内容和重要性

<!--more-->


### **课程学习导航 | Course Directory**

> [!DANGER] 特点
> 这门课虽然名字带电路，而且大部分老师会默认你拥有一些电路物理特性的知识，比如二极管三极管的功能特性，但是这门课学的是电路设计的逻辑方法，所以这一点也不必太过担心，但是，我们必须认识到现存大部分教材都是在编书而非写书，他们只是把知识罗列在你面前，不见得讲得很好或者编排地很好，以至于大部分没有任何经验的同学学习起来会感到非常抽象，作者的经验是先看一些网上的教程，博客当然推荐我这篇，视频资源还是推荐西电一个老师的课程，虽然B站上面的视频有少数残缺，但仔细找找还是能找全，并且哪怕没有看全，也不影响大局。==第一遍看，不求甚解，快速走完主线，你必须知道每个地方的知识都有什么作用，再去深入学习，方可事半功倍。==最后再跟着学校里老师的安排查漏补缺，以应付学校考试。

下面是这门课的全部章节目录，每个链接都会带你进入对应章节的“开篇导读”。建议按照顺序一步步来，把基础打牢固！

---
1.  **[第一章：数字系统与二进制数]({{< ref "/docs/ComputerScience/03DigitalDesign/1NumberSystemBinaryNumber/00Intro.md" >}})**
    > 一切的开始，带你进入 0 和 1 的世界。

2.  **[第二章：布尔代数与逻辑门]({{< ref "/docs/ComputerScience/03DigitalDesign/2BooleanAlgebraLogicGates/00Intro.md" >}})**
    > 这是我们设计电路的“数学语言”，是内功心法。

3.  **[第三章：门级电路化简]({{< ref "/docs/ComputerScience/03DigitalDesign/3SimplicationOfGateCircuits/00Intro.md" >}})**
    > 如何用最少的“积木”搭出同样功能的电路？省钱省地儿的艺术。

4.  **[第四章：组合逻辑电路]({{< ref "/docs/ComputerScience/03DigitalDesign/4CombinationLogic/00Intro.md" >}})**
    > 电路开始干正事了！加法器、编码器...各种实用模块登场。

5.  **[第五章：同步时序逻辑]({{< ref "/docs/ComputerScience/03DigitalDesign/5SynchronousSequentialLogic/00Intro.md" >}})**
    > **全书核心！** 电路开始拥有“记忆”，状态机的概念会在这里彻底讲明白。

6.  **[第六章：寄存器与计数器]({{< ref "/docs/ComputerScience/03DigitalDesign/6RegisterCounter/00Intro.md" >}})**
    > 时序逻辑最常见的两大应用，几乎所有数字系统里都有它们的身影。

7.  **[第七章：存储器与可编程逻辑器件]({{< ref "/docs/ComputerScience/03DigitalDesign/7MemoryAndPLD/00Intro.md" >}})**
    > 了解数据是如何存储的，并接触我们未来的“魔法棒”——FPGA。

8.  **[第八章：寄存器传输级设计]({{< ref "/docs/ComputerScience/03DigitalDesign/8RTLDesign/00Intro.md" >}})**
    > 进阶内容！教你从更高的抽象层次去思考和设计一个复杂的数字系统。

9.  **[第九章：实验：标准IC与FPGA]({{< ref "/docs/ComputerScience/03DigitalDesign/9ExperimentWithStandardICsAndFPGAs/00Intro.md" >}})**
    > 理论结合实践，动手环节！把前面学的东西在开发板上变成现实。

10. **[第十章：标准图形符号]({{< ref "/docs/ComputerScience/03DigitalDesign/10StandardGraphicSymbol/00Intro.md" >}})**
    > 附录性质，当你看到一些不认识的电路符号时，可以来这里查阅。