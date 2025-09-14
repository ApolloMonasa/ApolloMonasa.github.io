---
title: "你好，世界！"
subtitle: ""
date: 2025-09-03T16:00:00+08:00
categories:
weight: 10
description: ""
keywords: ""
draft: false
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
>事实上，现在我才正式向读者介绍**JDK（Java Development Kit）**，它是Java开发工具包， 包括了一系列工具（比如我们之前在cmd中使用的**javac**）， 其中就有一个叫做**JRE（Java Runtime Environment）**，是Java运行时的环境，是运行Java程序所必须的， 它又包括**JVM（Java Virtual Machine）**———即Java虚拟机， 以及Java核心类库等等。
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
+ 在每一个`xxx.java`文件中，最外层都需要写 ==`public class xxx { ... }`，这里的xxx需要和文件名一致，并且只能有一个。==[pink]这一点不必担忧，因为当你创建文件时，你的IDE将会**自动**帮你生成它
+ ==class==代表类，后面的Main代表类名，关于类是什么，现在不重要，之后我们会详细讨论，现在只需要知道有这个概念。
+ 在你想直接运行的Java文件中，你还必须要定义一个 `main` 方法，也就是`public static void main(String[] args) { ... }`，这是**main方法的标准格式**，程序将从这里开始执行。事实上，这一点也不必担忧，因为你最后编写的Mod并不需要直接运行，而是被NeoForge加载进游戏里，因此，在真正的Mod开发中，你**并不需要**这个东西。**简而言之，每一个Java类中最多有一个符合标准格式的main方法，这意味着理论上一个Java项目中说多可以有无数个，说少可以没有main方法。**
+ 此外，如果你没学过其他编程语言，你也会问main方法前面的几个单词是什么意思：
    + ==public==[primary] 是访问权限修饰限定符，形象的说是管理其他类能否调用这个方法的。
    + ==static==[success] 是静态方法限定符，表示这个方法属于类而不是类的对象，关于类和对象，这里简单地说就是：==类是对象的蓝图，对象是类的实例==，有了这个限定符，我们无需创建对象就能使用这个方法。
    + ==void== 是方法的**返回值类型**，void就表示这个方法并**不返回任何东西**。
+ 如上展示的就是最简单的一个Java程序，可能会让读者一头雾水，可以说，Java的main方法是当前主流编程语言中最“长”的。但是无论如何，通过上述代码，我们已经可以看到一个完整的Java程序的结构，Java程序由如下三个部分组成：
    1. **源文件**(拓展名为*.java)：源文件带有类的定义。类用来表示程序的一个组件，小程序或许只会有一个类。类的内容必须包含在花括号之内。
    2. **类**：类中带有一些**方法** ，方法**必须在类的内部声明**。
    3. **方法**：在方法的花括号中编写方法应该执行的语句。
    
    总之：**类存在于源文件中，方法存于类中，语句存在于方法中**。

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
    public static void main(String[] args) {//输入main就能自动补全
        System.out.println("Hello, World!"); // 这是一条单行注释，从//开始，到这行末尾，你可以随便写，输入sout就能自动补全出这一行
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

---
{.awesome-hr}

## 进阶：编写高质量的 Javadoc 注释

Javadoc 不仅仅是为代码生成文档的工具，它更是代码本身不可或缺的一部分，是开发者之间沟通的桥梁。一份优秀的 Javadoc 注释能够极大地提升代码的可读性、可维护性和易用性。

本指南将从基础出发，逐步深入到高级用法和最佳实践，帮助你编写出专业、清晰的 API 文档。

当然，如果读者对此没有追求，可以直接跳到下一节。

### 1. Javadoc 基础

一个标准的 Javadoc 注释块以 `/**` 开始，以 `*/` 结束。它包含两部分：
1.  **主要描述 (Main Description)**：通常是第一段，用简洁的语言概括该元素（类、方法、字段）的功能。
2.  **标签段 (Tag Section)**：以 `@` 符号开头，用于提供更具体的元数据信息。

**一个良好的基础示例：**

```java
/**
 * 一个用于处理字符串的实用工具类。
 * <p>
 * 这个类提供了多种静态方法，用于检查、转换和操作字符串。
 * 所有方法都对 null 输入是安全的。
 *
 * @author Your Name
 * @version 1.0
 * @since 2023-10-27
 */
public class StringUtils {

    /**
     * 检查给定的字符串是否为空、null或仅由空白字符组成。
     *
     * @param str 要检查的字符串
     * @return 如果字符串为空，则返回 {@code true}，否则返回 {@code false}
     */
    public static boolean isBlank(String str) {
        // ... 实现 ...
        return str == null || str.trim().isEmpty();
    }
}
```

### 2. 常用标签详解

掌握这些标签是写出专业文档的关键。

#### 2.1. 链接与引用：`@see` vs `{@link}`

这两个标签都用于创建到其他代码元素的链接，但用法和显示效果不同。

*   `{@link package.class#member label}`: **行内标签**，它会在注释文本中直接生成一个超链接。这是最常用的方式。
*   `@see package.class#member label`: **块标签**，它会在 Javadoc 的末尾创建一个独立的 "See Also"（另请参阅）区域，并将链接放在那里。

**示例：**

```java
/**
 * 处理用户订单。
 * <p>
 * 这个方法会验证用户的购物车，然后创建一条新的订单记录。
 * 如果购物车为空，请参考 {@link #cancelOrder(long)} 方法来取消。
 *
 * @param userId 用户的唯一标识符
 * @return 创建的订单对象
 * @see com.example.service.CartService#getCart(long)
 * @see #cancelOrder(long)
 */
public Order processOrder(long userId) {
    // ...
}

/**
 * 取消一个指定的订单。
 * @param orderId 订单的唯一标识符
 */
public void cancelOrder(long orderId) {
    // ...
}
```
**生成效果：**
*   `{@link #cancelOrder(long)}` 会在描述文本中直接变成一个可点击的链接 `cancelOrder(long)`。
*   `@see ...` 会在文档末尾生成一个 "See Also" 部分，包含指向 `CartService.getCart` 和 `cancelOrder` 的链接。

#### 2.2. 代码片段：`{@code}` vs `{@literal}`

*   `{@code text}`: 用于将文本格式化为代码样式（通常是等宽字体）。它会自动转义 HTML 标签和注解，所以你不需要手动处理 `<` 或 `>`。这是**推荐**的方式。
*   `{@literal text}`: 用于显示纯文本。它也会转义 HTML 标签，但不会将文本格式化为代码样式。当你需要显示含有 `<` 或 `>` 的普通文本时很有用。

**示例：**

```java
/**
 * 一个泛型方法示例。
 * <p>
 * 此方法接受一个类型为 {@code List<T>} 的列表。
 * 注意：返回值永远不会是 {@code null}。
 * 对于泛型语法 {@literal List<T>}，尖括号不会被解析为HTML标签。
 *
 * @param <T> 列表元素的类型
 * @param list 输入的列表
 * @return 处理后的列表
 */
public <T> List<T> processList(List<T> list) {
    // ...
}
```

#### 2.3. 版本与废弃：`@since` & `@deprecated`

*   `@since version`: 表明这个元素（类、方法等）是从哪个版本开始引入的。这对于库的维护者和使用者都非常重要。
*   `@deprecated description`: 标记一个元素为“已废弃”。编译器会对此发出警告。**关键是**，在描述中必须说明废弃的原因，并使用 `{@link}` 提供替代方案。

**示例：**

```java
/**
 * @deprecated 从版本 2.0 开始废弃。请使用 {@link #newUser(String, String)} 替代。
 *             此方法不支持密码加密。
 */
@Deprecated
public User createUser(String username) {
    // ...
}

/**
 * 创建一个新用户，并使用安全的哈希算法加密密码。
 *
 * @param username 用户名
 * @param password 原始密码
 * @return 创建好的用户对象
 * @since 2.0
 */
public User newUser(String username, String password) {
    // ...
}
```

#### 2.4. 继承文档：`{@inheritDoc}`

当一个子类或实现类的方法重写（override）或实现（implement）父类或接口的方法时，可以使用 `{@inheritDoc}` 来自动继承父方法中的 Javadoc。

*   它可以完全继承所有内容。
*   也可以只继承部分内容，并添加自己的描述。

**示例：**

```java
// 接口
public interface StorageService {
    /**
     * 将数据保存到存储系统中。
     * @param key 数据的键
     * @param data 要保存的数据
     * @throws IOException 如果保存失败
     */
    void save(String key, byte[] data) throws IOException;
}

// 实现类
public class FileStorageService implements StorageService {
    /**
     * {@inheritDoc}
     * <p>
     * 这个实现将数据保存到本地文件系统。
     * 文件将存储在配置的根目录下。
     */
    @Override
    public void save(String key, byte[] data) throws IOException {
        // ...
    }
}
```
**生成效果：** `FileStorageService.save` 方法的文档会自动包含 `StorageService.save` 的描述、`@param` 和 `@throws` 标签，并在其后附加自己的特定描述。

#### 2.5. 常量值引用：`{@value}`

用于在注释中直接引用静态常量（`static final` 字段）的值。

**示例：**

```java
public class Config {
    /**
     * 默认的连接超时时间（毫秒）。
     * 当前值为 {@value}。
     */
    public static final int DEFAULT_TIMEOUT = 5000;

    /**
     * 获取配置值。
     * @param key 配置键，例如 {@value com.example.api.Constants#API_KEY}
     * @return 配置值
     */
    public String getValue(String key) {
        // ...
    }
}
```
**生成效果：** `{@value}` 会被自动替换为 `5000`。当引用其他类的常量时，需要写全路径。

### 3. 包和模块的文档

为整个包或模块提供概述性文档，是大型项目不可或缺的一环。

*   **包文档 (`package-info.java`)**: 在你的包下创建一个名为 `package-info.java` 的文件。在这个文件里，你可以为整个包编写 Javadoc。这是描述包的设计理念、架构和整体用途的最佳位置。

    ```java
    /**
     * 提供了核心的服务层接口和实现，用于处理业务逻辑。
     * <p>
     * 这个包的主要入口点是 {@link com.example.service.OrderService}。
     * 所有服务都遵循依赖注入的原则。
     *
     * @since 1.0
     */
    package com.example.service;
    ```

*   **模块文档 (`module-info.java`)**: 在 Java 9+ 的模块化项目中，你也可以为模块声明编写 Javadoc。

    ```java
    /**
     * 定义了应用程序的核心 API 和服务提供者接口。
     */
    module com.example.core {
        exports com.example.api;
        // ...
    }
    ```

### 4. 编写风格

1.  **第一句话是总结句**：Javadoc 工具会将每个方法的第一句话作为摘要显示在索引页上。因此，第一句话必须是 concise and informative 的总结。它应该以句号结束。

2.  **为读者而写**：始终站在 API 调用者的角度思考。他们需要知道什么？他们可能误解什么？写清楚方法的**前置条件**（preconditions，如参数要求）、**后置条件**（postconditions，如返回值保证）和**副作用**（side-effects，如修改了对象状态）。

3.  **使用 HTML 标签增强可读性**：
    *   `<p>`: 用于分段。
    *   `<ul>`, `<li>`: 用于无序列表。
    *   `<code>`, `<pre>`: 用于多行代码示例（虽然 `{@code}` 更常用）。
    *   `<strong>`, `<em>`: 用于强调。
    *   避免使用标题标签如 `<h1>`, `<h2>`，它们会与 Javadoc 生成的样式冲突。

4.  **为泛型添加注释**：使用 `<T>` 标签来描述泛型类型参数。

    ```java
    /**
     * @param <T> 元素的类型，必须是可比较的。
     */
    public class SortedList<T extends Comparable<T>> { ... }
    ```

5.  **保持注释与代码同步**：过时的注释比没有注释更糟糕。每次修改代码逻辑时，都要检查并更新相关的 Javadoc。

### 5. 生成和查看 Javadoc

*   **通过 IDE**：大多数 IDE（如 IntelliJ IDEA, Eclipse）都内置了生成 Javadoc 的功能，通常在 "Tools" 或 "Project" 菜单下。
*   **通过 Maven**：使用 `maven-javadoc-plugin` 插件。在 `pom.xml` 中配置后，运行 `mvn javadoc:javadoc` 即可。
*   **通过 Gradle**：Gradle 内置了 `javadoc` 任务。直接运行 `gradle javadoc` 即可。
*   **通过命令行**：
    ```bash
    # 为指定 Java 文件生成文档到 docs 目录
    javadoc -d docs -author -version MyClass.java

    # 为整个源码包生成文档
    javadoc -d docs -sourcepath src -subpackages com.example
    ```

### 总结

将 Javadoc 视为你对外交付的 API 的一部分。清晰、准确、完整的 Javadoc 是专业精神的体现，它能够减少沟通成本，避免误用，并让你的代码库在未来几年内依然易于维护。投入时间编写高质量的文档，是一项回报率极高的投资。