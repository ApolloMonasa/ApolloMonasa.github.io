---
# -------------------------------------------------------------------------------------
# |                           核心元数据 (Core Metadata)                            |
# -------------------------------------------------------------------------------------
# 【必填】文章标题：清晰、吸引人，并包含核心关键词
title: "游戏项目简介及计划"
# 【必填】文章发布日期
date: 2025-10-22T19:46:23+08:00
# 【建议】文章最后修改日期：更新文章后，请手动更新此日期，以告知搜索引擎内容已更新
lastmod: 2025-10-22T19:46:23+08:00
# 【必填】文章作者：FixIt主题支持多种格式
# 格式一: 简单字符串
# author: "ApolloMonasa"
# 格式二: 包含链接和头像的复杂对象 (推荐)
# author:
#     - {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://i.ooxx.ooo/i/ZGM0M.jpg"}
#     - ApolloMonasa
# 【必填】是否为草稿：发布前请务必设置为 false
draft: false
weight: 

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

## 说在前面

好的现在由我来简单介绍一下我们这个项目，这个项目的特点据说是如下几点：


*   **项目名称:** ==唐三彩烧制小游戏==[sky]
*   **项目类型:** 第一人称、快节奏反应类小游戏 Demo
*   **核心玩法:** 在限定时间内，从多个窑炉中正确取出烧制完成的唐三彩工艺品。
*   **项目背景与灵感:** 本项目的设计灵感源于任天堂Switch平台游戏《超级马力欧：空前盛会》(Mario Party Superstars) 中的第89号关卡 **[新鲜出炉！面包店](https://www.bilibili.com/video/BV19neAzNEYf/)**。我们将复刻其核心的“在正确时机取物”的玩法机制，并将其主题包装为中国传统工艺“唐三彩”的烧制过程。
- 项目目标：实现一款第一人称的唐三彩烧制小游戏demo，要求在正确的时间取出唐三彩单品。
    - 必做项
        *   **引擎版本:** 使用 **Unreal Engine 5.5或更高版本** 进行开发。
        *   **核心玩法实现:** 完成核心玩法的单机版本。玩家能够以第一人称视角，在场景中与多个窑炉互动，在唐三彩烧制完成的瞬间将其取出以得分。
        *   **基础UI界面:** 至少包含以下界面：
            *   入口菜单 (开始游戏、退出游戏)
            *   局内计分/计时界面
        *   **跨平台交付:** 成功打包并交付可在 **PC** 和 **Android** 两个平台上流畅运行的游戏版本。

    - 加分项
        - 丰富游戏机制
            *   **游戏深度:** 引入难度等级、本地/在线排行榜、局内随机道具或增益/减益技能。
            *   **多人互动:** 实现分屏对战或基础的联机对战功能。
            *   **沉浸感提升:**
                *   **交互反馈:** 增强操作手感，加入手柄振动、空间音效等。
                *   **视听表现:** 提升渲染效果、动画流畅度和音效质量。
                *   **创新输入:** 尝试将动态捕捉、面部捕捉或语音识别作为游戏输入方式。
        - 拓展或深入UE功能
            *   **脚本化:** 引入 **UnLua** 插件，使用 `lua` 脚本实现部分游戏逻辑（如道具效果、UI逻辑等）。
            *   **框架应用:** 尝试使用 **GAS (Gameplay Ability System)** 框架来管理技能或道具系统。
            *   **高级功能:** 深入应用行为树 (AI)、动画蒙太奇、骨骼动画、物理模拟等。
            *   **专业音频:** 接入 **Wwise** 音频中间件，实现更复杂的音频管理方案。
        - 自研便捷开发工具流
            *   **自动化:** 编写脚本，实现一键化打包流程。
            *   **配置化:** 创建数据驱动的配置工具（如使用数据表格），用于便捷地调整关卡参数、道具属性、技能效果等。
            *   **程序化生成:** 探索使用程序化生成技术来创建关卡布局或资源。
            *   **资源管理:** 研究UE的资源热更新（打补丁）流程。
- 评分标准
    - 完成必做项即合格
    - 加分项的完成度比数量更重要
    - 游戏体验评判相对主观，非特殊情况下这部分相对分差不会很大
- 团队构成:三人开发小组，均为游戏开发初学者，其中一位成员具备部分Android开发经验。
- 学习资料
    - [Unreal Engine官方网站](https://dev.epicgames.com/community/unreal-engine/learning)
    - B站、Youtube教程
    - [UE官方wiki](https://unrealcommunity.wiki/)作查阅资料用
    - [Tencent UnLua](https://github.com/Tencent/UnLua)拓展学习
- 分工建议
    - 程序相关：游戏主流程框架、局内玩法开发、UI开发、游戏打包
    - 资源相关：音乐、音效、2D美术、3D美术、动作、特效、善用社区资源
    - 游戏测试
    - 游戏设计(建议省略)

---

## 正式开始
那么以下是一个为期8周（约两个月）的详细学习与开发计划。本计划专为三位零基础开发者设计，旨在从入门到完成《唐三彩烧制小游戏》的demo。

### 核心理念与心态准备

1.  **版本控制：** 正式开发之后就要使用版本控制工具**Git**并使用 GitHub 平台。**每天工作结束前必须提交（Commit/Push）代码**，这能防止灾难性地丢失进度。
2.  **沟通：** 每天开一个5分钟短会，同步进度和遇到的问题。使用微信群保持沟通。
3.  **先完成，再完美：** 初期不要纠结于美术细节或代码的完美。使用方块和球体作为占位符，先把核心玩法跑通。
4.  **分工不分家：** 虽然有分工，但大家都在同一个项目里。遇到困难时，另外两人应主动提供帮助或一起研究。

### 推荐核心教程
#### 视频资源
*   [**补充0**](https://www.bilibili.com/video/BV1Cd4y1V7G5)，优点是中文讲解，缺点是版本老旧以及学习目的不同，建议作为科普来看
*   **补充1:** [**Unreal Sensei (Virtus Learning Hub)** 的 **"Unreal Engine 5 Beginner Tutorial - How to Make a Game!"**](https://www.bilibili.com/video/BV19a4y1f7tR)
*   **补充2:** [**How to Create a Game in Unreal Engine 5 - UE5 Beginner Tutorial**](https://www.bilibili.com/video/BV1V34y1G7eQ)
#### 官方文档资源
-   [**推荐学习路径**](https://dev.epicgames.com/community/learning/paths/OR/welcome-to-game-development)，优点是和我们的目标重叠度高(简介中写道：“欢迎来到游戏开发”学习路径是那些想要直接使用虚幻引擎进行游戏开发的人的理想起点。你将学习虚幻引擎的基础知识，并探索一些游戏开发所需的基本技能。)，缺点是中文翻译蹩脚或不全，版本也落后。
-   [**参考文档**](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/unreal-engine-5-5-documentation?application_version=5.5)


---

> [!DANGER]+ 注意！
> 以下内容皆为AI生成，大家大可不必太在意，==建议结合[**主教程**](https://www.bilibili.com/video/BV1Cd4y1V7G5)和[**推荐学习路径**](https://dev.epicgames.com/community/learning/paths/OR/welcome-to-game-development)决定你的学习路径==[teal]，其他的我们多多交流。

### **详细开发计划 (8周)**

**团队角色预设 (从第三周开始分工):**

*   **队员A (Gameplay & Player):** 负责玩家角色、输入控制、交互逻辑、镜头。
*   **队员B (Systems & Game Logic):** 负责游戏核心规则、状态管理、计时/计分、窑炉逻辑。
*   **队员C (Environment & Android):** 负责场景搭建、美术/音效资源整合、UI实现、后期打包优化。

---

### **第一阶段：全员基础入门 (第1-2周)**

**目标：** 全员同步学习，以主推视频教程为核心，掌握UE5最基础的操作和蓝图思想。

| 周数 | 日期 | 学习/实践任务 (全员) | 主要参考资源 |
| :--- | :--- | :--- | :--- |
| **Week 1** | **Day 1-3** | **学习:** 观看 [**主教程**](https://www.bilibili.com/video/BV1Cd4y1V7G5) 的 P1-P5。 <br> **实践:** 1. 安装UE5.5，建立Git仓库。2. 创建 "TangSancaiGame" 项目(第一人称模板)。3. 熟练掌握视图操作、Actor的创建与变换。 | **主:** 主教程 P1-P5 <br> **辅:** [官方参考文档](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/unreal-engine-5-5-documentation?application_version=5.5) - `构建虚拟世界` 章节 |
| | **Day 4-7** | **学习:** 继续观看 [**主教程**](https://www.bilibili.com/video/BV1Cd4y1V7G5) P6-P10，重点理解蓝图Actor、组件、事件图和变量。 <br> **实践:** 1. 创建 `BP_Kiln` (窑炉)蓝图Actor。2. 在 `BP_Kiln` 中添加一个Cube组件。3. 通过`Event Tick`让这个Cube旋转。 | **主:** 主教程 P6-P10 <br> **辅:** [官方学习路径](https://dev.epicgames.com/community/learning/paths/OR/welcome-to-game-development) - `蓝图基础` 模块 |
| **Week 2**| **Day 8-11**| **学习:** 继续观看 [**主教程**](https://www.bilibili.com/video/BV1Cd4y1V7G5) P11-P15，重点学习碰撞、触发器、输入系统。 <br> **实践:** 1. 设置增强输入，将 `E` 键绑定为交互。2. 在角色蓝图中实现按`E`键打印字符串。3. 创建一个触发盒，当玩家进入时打印信息。 | **主:** 主教程 P11-P15 <br> **辅:** [Unreal Sensei 教程](https://www.bilibili.com/video/BV19a4y1f7tR) (关于输入的章节) |
| | **Day 12-14**| **学习:** 快速浏览 [**Unreal Sensei 教程**](https://www.bilibili.com/video/BV19a4y1f7tR) 前半部分，了解一个完整小游戏的制作流程。 <br> **实践:** **阶段性任务** - 搭建一个包含玩家、地面和几个 `BP_Kiln` 实例的基础测试关卡。 | **主:** [Unreal Sensei 教程](https://www.bilibili.com/video/BV19a4y1f7tR) <br> **辅:** [官方学习路径](https://dev.epicgames.com/community/learning/paths/OR/welcome-to-game-development) |

---

### **第二阶段：核心玩法原型开发 (第3-4周)**

**目标：** 开始分工，结合多个教程和文档，搭建游戏的核心玩法框架。

| 周数 | 日期 | 队员A (Gameplay) | 队员B (Systems) | 队员C (Environment) |
| :--- | :--- | :--- | :--- | :--- |
| **Week 3**| **Day 15-18**| **任务:** 实现射线检测。从玩家摄像机发射射线，判断正对着哪个物体，并给物体加上高亮效果(Outline)。<br>**资源:** B站搜索“UE5 射线检测 高亮”。 | **任务:** 在`BP_Kiln`中创建枚举变量`E_KilnState`来管理状态。创建自定义事件来控制状态切换。<br>**资源:** [主教程](https://www.bilibili.com/video/BV1Cd4y1V7G5) (蓝图变量部分)。 | **任务:** 搭建基础场景。用方块确定窑炉、墙壁、操作台的位置，设置基础灯光。<br>**资源:** [Unreal Sensei教程](https://www.bilibili.com/video/BV19a4y1f7tR) (关卡搭建部分)。 |
| | **Day 19-21**| **任务:** 实现交互逻辑。当射线命中`BP_Kiln`且按下`E`键时，调用其身上的交互函数。<br>**资源:** [官方学习路径](https://dev.epicgames.com/community/learning/paths/OR/welcome-to-game-development) (蓝图通信)。 | **任务:** 实现窑炉状态机。使用定时器(Timer)控制状态从“烧制中”到“完成”再到“烧毁”的自动转换。<br>**资源:** B站搜索“UE5 蓝图定时器”。| **任务:** 创建不同状态的材质实例（如烧制中-橙色，完成-绿色），并让`BP_Kiln`根据状态动态切换材质。<br>**资源:** [主教程](https://www.bilibili.com/video/BV1Cd4y1V7G5) (材质部分)。 |
| **Week 4**| **Day 22-25**| **任务:** 将交互与窑炉状态关联。只有当窑炉状态为“完成”时，交互才算成功，并通知Game State加分。<br>**资源:** 综合运用已学知识。| **任务:** 创建自定义的Game Mode和Game State。在Game State中管理分数和游戏总时间。<br>**资源:** [官方参考文档](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/unreal-engine-5-5-documentation?application_version=5.5) - `Gameplay系统`。| **任务:** 寻找并导入免费的音效资源，在`BP_Kiln`状态切换或交互成功/失败时播放对应的声音。<br>**资源:** B站搜索“UE5 播放声音”。 |
| | **Day 26-28**| **任务:** 协助队员B和C进行功能联调，确保“交互->状态判断->得分/失败->视觉/听觉反馈”整个流程跑通。 | **任务:** 在Game Mode中实现核心循环：每隔几秒随机选择一个空闲窑炉，使其开始烧制。 | **任务:** 将所有功能整合到`BP_Kiln`中，进行测试和调试。 |

---

### **第三阶段：系统整合与体验打磨 (第5-6周)**

**目标：** 完善UI、特效等周边系统，形成完整的游戏循环。

| 周数 | 日期 | 队员A (Gameplay) | 队员B (Systems) | 队员C (Environment) |
| :--- | :--- | :--- | :--- | :--- |
| **Week 5**| **Day 29-32**| **任务:** 调整玩家移动速度、摄像机灵敏度，优化操作手感。 | **任务:** 将Game State中的分数和倒计时绑定到UI上，并实时更新。 <br>**资源:** [Unreal Sensei教程](https://www.bilibili.com/video/BV19a4y1f7tR) (UI部分)。| **任务:** 学习UMG，创建游戏主HUD，显示倒计时和分数。<br>**资源:** [主教程](https://www.bilibili.com/video/BV1Cd4y1V7G5) (UMG UI部分)。 |
| | **Day 33-35**| **任务:** 为交互成功添加简单的粒子效果（如闪光）。 <br>**资源:** B站搜索“UE5 Niagara基础”。| **任务:** 实现游戏结束逻辑：倒计时结束时，冻结玩家操作，显示结束界面。 | **任务:** 制作主菜单和游戏结束UI，实现关卡跳转和退出游戏功能。 <br>**资源:** [How to Create a Game教程](https://www.bilibili.com/video/BV1V34y1G7eQ) (菜单部分)。|
| **Week 6**| **Day 36-42**| **全员任务:** 集中一周时间，进行密集的Bug修复和体验优化。根据团队讨论，可以尝试做一个加分项，例如增加一种需要不同烧制时间的唐三彩。主要资源为 **[官方参考文档](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/unreal-engine-5-5-documentation?application_version=5.5)**，针对遇到的具体问题进行查阅。|

---

### **第四阶段：打包、测试与收尾 (第7-8周)**

**目标：** 完成PC和Android双平台包体，并进行最终测试。

| 周数 | 日期 | 队员A (Gameplay) | 队员B (Systems) | 队员C (Android Lead) |
| :--- | :--- | :--- | :--- | :--- |
| **Week 7**| **Day 43-46**| **任务:** 设计并实现触屏UI，例如一个虚拟的交互按钮。 <br>**资源:** B站搜索“UE5 移动端UI”。| **任务:** 根据测试反馈，调整游戏数值（如得分、时间），让游戏更好玩。 | **任务:** **主导Android打包**。严格按照 **[官方参考文档](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/unreal-engine-5-5-documentation?application_version=5.5)** 的`移动端开发`章节配置打包环境。|
| | **Day 47-49**| **任务:** 参与Android版本的测试，重点关注操作体验和UI适配。 | **任务:** 协助队员C进行性能分析，找出手机上卡顿的原因。 | **任务:** 成功打出PC和Android包。在手机上进行性能测试，并学习使用性能分析工具(Profiler)。|
| **Week 8**| **Day 50-60**| **全员任务:** <br> 1. 进行最后一轮全面测试，修复所有遗留的严重Bug。<br> 2. 对项目进行清理，打包最终的PC和Android版本。<br> 3. 录制一段1-2分钟的游戏演示视频，编写项目总结文档。<br> 4. **项目复盘，总结这两个月的经验和收获。** |