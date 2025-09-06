---
title: "你好，世界！"
subtitle: ""
date: 2025-09-03T16:00:00+08:00
categories:
weight: 10
description: ""
keywords: ""
draft: true
author:
- {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://i.ooxx.ooo/i/ZGM0M.jpg"}
- ApolloMonasa
---

## 前言

想象你站在一个巨大的 Minecraft 世界里，手中握着构建方块和触发事件的能力。你想设计自己的方块、定义事件行为、组合机制，并观察它们如何互动。为了实现这一目标，你将使用一门成熟且稳定的语言——Java。

Java 的世界，也正像一个精心规划的 Minecraft 地图：每个方块、每栋建筑都各司其职。你尝试放置一个新方块，系统会告诉你是否合规：有些位置可以自由放置，有些位置必须遵循特定规则。表面看似相同的方块，放置方式或触发效果可能不同，需要你仔细观察。

当你探索方法和对象的交互，你会发现有些组合非常自然，有些组合却必须遵循隐藏的约束。你能充分利用规则构建稳定机制，但每一次操作都可能被规则悄悄约束或产生意想不到的副作用。随着你逐渐熟悉这些规律，你会明白：Java 的世界既安全又严谨，也因为这种严格而偶尔显得繁琐。

这种繁琐并非偶然——许多规则和限制是语言历史的积累：早期设计的兼容性、长期类库约束，以及为清晰可预测的程序逻辑而引入的异常声明，共同塑造了这片世界。它们让每一次操作都有迹可循、风险可控，但也让新手在建造时感受到额外负担。对初学者来说，不必纠结细节，只需知道每件事物都有各自位置和作用。随着教程推进，你会慢慢体会这些规则背后的设计哲学，也会对那些微妙差异有直观感受——这是理解 Java 本质的第一步。

---
{.awesome-hr}

## 为什么是Java

或许你曾经在游玩Minecraft时，见到过类似`Fabric Language Kotlin` 或是 `Kotlin for Forge` 这样的Mod，这当然说明，为Minecraft开发Mod可供选择的语言除了Java之外，至少还有Kotlin。Kotlin是一门基于Java生态，但是比Java语言本身更先进的编程语言，它可以大大提升代码编写体验，但在这个教程中，不选用Kotlin，而是原始的Java，我想主要有以下几个原因：
+ 使用Kotlin编写的Mod需要额外的支持库Mod，而这些Mod更新往往会滞后于NeoForge等模组加载器，以至于往往无法迅速将老版本Mod迁移至新版本
+ Minecraft的源码是使用Java编写的，我们使用Java开发Mod，可以更好地观察、借鉴、修改原版游戏代码的内容
+ Kotlin省略了一些在Java中看似冗余的语法，但作为初学者，以稍繁琐的语法为代价换取对程序运行的更好掌控，并非全无益处

## Hello, World!

是时候编写第一个Java程序了！
### 创建项目

让我们新建一个Java项目（此时无需使用NeoForge）,打开你的IDE(Integrated Development Environment,集成开发环境，简称IDE)，也就是我们之前安装的==IntelliJ IDEA==[pink]，选择新建项目，然后看到如下界面，我们建立一个Java项目，具体设置如下：

<img src="https://youke1.picui.cn/s1/2025/09/06/68bbc6d1bf215.png" style="display: block; margin: 0 auto;" alt="CreatProj.png" title="CreatProj.png" />


- 名称自取，但是==尽量只包含英文数字下划线==[primary],否则可能会出一些奇奇怪怪的错误；
- 位置自选，但尽量不要放在C盘，可以在其他盘符下单独为Java创建一个文件夹，你所有的Java项目都能放在这里，便于管理；
- 构建系统，默认即可，暂时不用管；
    > [!info]- 关于构建系统
    > 1. ==IntelliJ原生构建系统(IntelliJ Built-in Builder)==[primary]
    >    - **零配置门槛**，不需要写pom.xml （Maven）或 build.gradle （Gradle），IDE会自动识别项目中的Java类、依赖JAR包，直接完成编译、运行、打包，适合新手入门或临时开发小项目（如单个Java类、简单控制台程序）。
    >    - **依赖管理弱**，无法像Maven/Gradle那样从中央仓库自动下载依赖，需手动添加本地JAR包；且不支持复杂依赖冲突解决，不适合多模块、大型项目。
    >    - **与IDE强绑定**，构建逻辑依赖IntelliJ的项目配置（如 .idea 文件夹中的设置），项目若迁移到其他IDE（如Eclipse）或命令行，构建逻辑会失效，可移植性差。
    > 2. ==Maven(Java主流构建工具)==[secondary]
    >
    >    **核心定位**：基于“项目对象模型（POM）”的自动化构建工具，核心解决“项目依赖管理”和“标准化构建流程”问题。
    >
    >    **核心特点**：
    >    - **依赖管理**：通过 pom.xml 文件统一声明项目依赖（如Spring、MyBatis），自动从中央仓库下载依赖包，避免手动管理JAR包的混乱。
    >    - **标准化流程**：定义了固定的构建生命周期（清理→编译→测试→打包→安装→部署），所有Maven项目遵循统一流程，降低团队协作成本。
    >    - 缺点：配置文件（ pom.xml ）为XML格式，**复杂项目的配置会冗长；灵活性较低**，自定义构建逻辑需写插件，成本较高。
    > 3. ==Gradle(新一代Java构建工具)==[success]
    >
    >    **核心定位**：结合Maven的依赖管理优势和Ant的灵活性，基于“Groovy/ Kotlin脚本”的新一代构建工具，兼容Maven生态。
    >    
    >    **核心特点**：
    >
    >    - **灵活性高**：配置文件用 build.gradle （Groovy）或 build.gradle.kts （Kotlin）编写，语法简洁，支持自定义构建逻辑（如条件判断、循环），无需复杂插件。
    >    - **依赖管理**：兼容Maven的中央仓库，支持“动态版本”“依赖排除”等更灵活的依赖控制，且能自动避免依赖冲突。
    >    - **性能优**：支持“增量构建”（只构建修改过的模块）和“并行构建”（多模块同时构建），比Maven更快。
    >    - **跨语言支持**：除Java外，还能构建Android、Kotlin、Scala等项目，生态覆盖更广。
    >
    >
- JDK这里最好就使用我们刚刚下载安装好的，往后我们的电脑上绝对不止一个JDK，因为对于不同的项目我们可能需要不同的版本。

> [!SUCCESS]+ 当你看到这样的一个欢迎代码时，就说明你已经成功创建了一个项目！
>
> <img src="https://youke1.picui.cn/s1/2025/09/06/68bbd209272c7.png" style="display:block; margin: 0 auto;" alt="First.png" title="First.png" />
>
> 跟随引导，你或许已经完整执行了这个欢迎程序，并在输出终端中看到了类似如下内容：
> ```text
> 已连接到地址为 ''127.0.0.1:58486'，传输: '套接字'' 的目标虚拟机
> Hello and welcome!i = 1
> i = 2
> i = 3
> i = 4
> i = 5
> 已与地址为 ''127.0.0.1:58486'，传输: '套接字'' 的目标虚拟机断开连接
> ```
> 如果你没学过计算机网络，或许你会问什么是套接字，不过这不是我们讲解的重点，重点是大家应该==明白虚拟机的概念，以及此处怎么会突然出现一个虚拟机。==
>
> 所谓虚拟机就是通过软件模拟物理计算机硬件的“虚拟计算机”，那么我们电脑上哪来的虚拟机呢？
>
> 要回答这个问题，我要重新介绍一下Java:
> #### 程序跑在哪里？
> 如果你抛弃便捷的IDE编译工具，回归原始的终端，用原始的方式来编译你的程序，如下图所示，你的项目中突然出现了一个名为==Main.class==[pink]的文件，或许你不知道是什么，别急，我会说。
> 
> <img src="https://youke1.picui.cn/s1/2025/09/06/68bbd8f291636.png" style="display:block; margin: 0 auto;" alt="First.png" title="First.png" />
>
> Java是一门**半编译半解释型语言**，==xxx.java==[pink]文件通过==javac==[info] 编译成为 ==xxx.class==[success] 文件（是由字节码组成的和平台无关的面向JVM的文件）， 最后（JVM）虚拟机来运行.class文件， 再将字节码转换成平台能够使用的形式来运行。
>```mermaid
>graph LR
>A[xxx.java]--javac.exe-->B(xxx.class)--JVM-->C[平台]
>```
>事实上，现在我才正式向读者介绍**JDK（Java Development Kit）**，他是Java开发工具包， 包括了一系列工具（比如我们之前在cmd中使用的**javac**）， 其中就有一个叫做**JRE（Java Runtime Environment）**，是Java运行时的环境，是运行Java程序所必须的， 它又包括**JVM（Java Virtual Machine）**———即Java虚拟机， 以及Java核心类库等等。
>

---
{.awesome-hr}

### Main

下面是一个最为经典的Java入门程序：

``` java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

尽管你可能不理解这些英文单词的含义，或许还被一个简单的输出指令需要变写这么长代码而吓到，但没有关系，你现在只需要知道下面几点规则：
+ 在每一个`xxx.java`文件中，最外层都需要写 `public class xxx { ... }`，这里的xxx需要和文件名一致。这一点不必担忧，因为当你创建文件时，你的IDE将会**自动**帮你生成它
+ 在你想直接运行的Java文件中，你还必须要定义一个 `main` 方法，也就是`public static void main(String[] args) { ... }`，程序将从这里开始执行。事实上，这一点也不必担忧，因为你最后编写的Mod并不需要直接运行，而是被NeoForge加载进游戏里，因此，在真正的Mod开发中，你**并不需要**这个东西

既然程序从main包裹的地方开始运行，现在让我们仔细来看这行被包裹住的代码：
```Java
System.out.println("Hello, World!");
```

这行代码以`;`结尾，是一条完整的Java语句。其中，`println`是用于向控制台输出的函数，它的定义位于 `System.out` 中，因此我们要使用`.`来找到它。你可以试着更换小括号中的内容，来往控制台打印不同的内容。例如：
```Java
System.out.println(123);
System.out.println(1 + 2);
```

> [!IMPORTANT]
> 每条语句都要以`;`结尾

你已经学会了一个最简单的Java程序！

## 注释

趁时间还早，我们再来看看怎么给Java代码编写注释。

```Java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); // 这是一条单行注释，从//开始，到这行末尾，你可以随便写
        System.out.println(123);
        /* 这是多行注释
           位于这里的内容可以换行
           真的可以换很多行
           Java不会知道的
        */
        System.out.println(1+2);
    }
}

// 注释到处都能写
```

学会合理地为你的代码添加注释，可以预防你看不懂你昨天写的代码。