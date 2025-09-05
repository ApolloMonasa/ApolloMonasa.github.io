---
title: "你好，世界！"
subtitle: ""
date: 2025-09-03T16:00:00+08:00
categories:
weight: 10
description: ""
keywords: ""
draft: true
author: {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://i.ooxx.ooo/i/ZGM0M.jpg"}
---

## 前言

想象你站在一个巨大的 Minecraft 世界里，手中握着构建方块和触发事件的能力。你想设计自己的方块、定义事件行为、组合机制，并观察它们如何互动。为了实现这一目标，你将使用一门成熟且稳定的语言——Java。

Java 的世界，也正像一个精心规划的 Minecraft 地图：每个方块、每栋建筑都各司其职。你尝试放置一个新方块，系统会告诉你是否合规：有些位置可以自由放置，有些位置必须遵循特定规则。表面看似相同的方块，放置方式或触发效果可能不同，需要你仔细观察。

当你探索方法和对象的交互，你会发现有些组合非常自然，有些组合却必须遵循隐藏的约束。你能充分利用规则构建稳定机制，但每一次操作都可能被规则悄悄约束或产生意想不到的副作用。随着你逐渐熟悉这些规律，你会明白：Java 的世界既安全又严谨，也因为这种严格而偶尔显得繁琐。

这种繁琐并非偶然——许多规则和限制是语言历史的积累：早期设计的兼容性、长期类库约束，以及为清晰可预测的程序逻辑而引入的异常声明，共同塑造了这片世界。它们让每一次操作都有迹可循、风险可控，但也让新手在建造时感受到额外负担。对初学者来说，不必纠结细节，只需知道每件事物都有各自位置和作用。随着教程推进，你会慢慢体会这些规则背后的设计哲学，也会对那些微妙差异有直观感受——这是理解 Java 本质的第一步。

## 为什么是Java

或许你曾经在游玩Minecraft时，见到过类似`Fabric Language Kotlin` 或是 `Kotlin for Forge` 这样的Mod，这当然说明，为Minecraft开发Mod可供选择的语言除了Java之外，至少还有Kotlin。Kotlin是一门基于Java生态，但是比Java语言本身更先进的编程语言，它可以大大提升代码编写体验，但在这个教程中，不选用Kotlin，而是原始的Java，我想主要有以下几个原因：
+ 使用Kotlin编写的Mod需要额外的支持库Mod，而这些Mod更新往往会滞后于NeoForge等模组加载器，以至于往往无法迅速将老版本Mod迁移至新版本
+ Minecraft的源码是使用Java编写的，我们使用Java开发Mod，可以更好地观察、借鉴、修改原版游戏代码的内容
+ Kotlin省略了一些在Java中看似冗余的语法，但作为初学者，以稍繁琐的语法为代价换取对程序运行的更好掌控，并非全无益处

## Hello, World!

是时候编写第一个Java程序了！
### 创建项目

让我们新建一个Java项目（此时无需使用NeoForge）
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