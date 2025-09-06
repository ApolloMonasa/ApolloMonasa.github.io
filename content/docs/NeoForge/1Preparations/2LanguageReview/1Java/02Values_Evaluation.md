---
title: "值与求值"
subtitle: ""
date: 2025-09-03T16:00:10+08:00
categories:
weight: 20
description: ""
keywords: ""
draft: true
author: {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://i.ooxx.ooo/i/ZGM0M.jpg"}

---
## 值、字面量

在上一节里，我们写了第一个 Java 程序 `Hello, World!`。你可能注意到，我们在代码里写下了`"Hello, World!"`这段文字，它就直接出现在屏幕上，我们把代码中写的 `"Hello, World!"` 这段文字、代码`1 + 2`中的 `1` 和 `2`，叫作**字面量**。当程序运行时，这些字面量会被转化为**值**并存储在内存中。值是程序的最小构件。它们是计算的结果，也是程序操作的对象。

>[!NOTE]
>**字面量**：写在源代码里的值的表示\
>**值**：程序运行时实际操作的对象

就像数学里的算式 2 + 3 = 5：\
2 和 3 是直接写下来的*字面量*；参与运算后得到的 5 是计算出来的*值*；而 2、3、5 在程序运行时都作为值存在。

我想你可能发现了，在程序中，有的值是自动产生的，例如在上一个实例中，我们输出了 `3`，这个数字是程序计算的值，而有的值是我们预先设计好的，例如上个示例中的`1` 和 `2`。我们需要用字面量来告诉Java程序。

字面量都有哪几种？它们又分别对应了怎样的值？我们来看下面的这张表格：

| 字面量类型 | 写法实例                    | 对应的值              |
| ----- | ----------------------- | ----------------- |
| 整数    | 42, -7, 0x12, 10E5, 10L | 整数（int、long）      |
| 浮点数   | 3.14, 2.5F              | 浮点数（double、float） |
| 布尔    | true, false             | 布尔值：真、假           |
| 字符    | 'A', '?', '\n', '你'  | 单个字符（char）        |
| 字符串   | "Hello"                 | 一串字符（String）      |

你可能对很多术语还不太熟悉，没关系，我们还是用之前的 `println` 函数一个个来详细解释。

### 整数

为了节省内存开销，Java设计了多种整数的值类型。从小到大包括：byte，short，int，long。

其中，最常用的是：**int**

```Java {title="int的用法"}
System.out.println(1); // 这里的1对应了int类型
System.out.println(-1); // int可以是负数
System.out.println(2E3); // 支持科学计数法，表示2×10³
System.out.println(0x1A); // 16进制数
```

然而，int只能存储从$-2^{31}$到$2^{31}-1$范围的整数，用来应付常规的Mod开发通常是足够的，但是Java也提供了更大范围的类型：**long**

```Java {title="long的用法"}
System.out.println(1E50L); // 在结尾加L的字面量将会被Java理解为long
```

### 浮点数

计算机中通常并不能存储精确的小数，而是将其近似存储为浮点数。在Java中，提供了两种浮点数：**double**和**float**，其中，`double` 的精度相对更高。

```Java {title="double和float的用法"}
System.out.println(1.0); // 有小数点，默认是double
System.out.println(2.0F); // 在结尾加F，将会被理解为float
System.out.println(0.1+0.2); // 令人遗憾，由于double的精度问题，结果为0.30000000000000004
```

鉴于浮点数的精度问题，你每次试图使用它时都需要慎重考虑。

> [!QUESTION]- 为什么直接调用println不会出错？
> 在 Java 中，`double` 用二进制近似表示十进制小数。字面量0.3在Java的程序中将会被翻译成一个很接近0.3的值，单独打印 0.3 时，Java 会自动找到一个最接近存储的值的十进制小数，看起来没有误差。
> 但是，当你做加法（比如 0.1 + 0.2）时，两个近似值的误差会叠加，以至于计算结果最接近的十进制小数不再是0.3，输出时就会显示微小的差异。

### 布尔

布尔值通常用于条件的判断。

```Java {title="boolean的用法"}
System.out.println(true); // 我是真
System.out.println(false); // 我是假
```
### 字符

在Java中，字符要用单引号`'`括起来，部分特殊的字符需要使用转义符号：

```Java {title="char的用法"}
System.out.println('A'); // 单个大写字母
System.out.println('你'); // 也可以是中文
System.out.println('?'); // 符号
System.out.println('\n'); // 转义字符，表示换行
System.out.println('\''); // 转义字符，表示单引号
```

### 字符串

Java的字符串用于表示一串字符（文本）。它可以包含一个或多个字符，甚至是空字符串。字符串用双引号`"`括起来，同样可以使用转义字符来表示特殊字符。

```Java {title="String的用法"}
System.out.println("Hello, World!"); // 普通字符串
System.out.println("玩家名字: Alex"); // 支持中文和其他Unicode字符
System.out.println(""); // 空字符串
System.out.println("这是第一行\n这是第二行"); // 使用换行转义字符
System.out.println("He said: \"Java is fun!\""); // 使用双引号转义
```

## 变量、作用域

在上一节里，我们介绍了值和字面量。值在程序中是最小的计算单位，但如果我们想重复使用某个值，或者想在程序中用它来表示“状态”，就需要给它一个名字，这就是变量。

> [!NOTE]
> **变量**：程序中给值起的名字。\
> **绑定**：变量名字和某个值之间建立的关系。

举个直观的例子：

```Java
// 假设已经存在了一个int类型的变量 health
health = 20; // 让变量health 绑定 值20
```

这里 `health` 是变量名，`20` 是值；赋值号 `=` 表示把这个值绑定到变量名上。
当我们在后续的代码中使用 `health` 时，Java 就会找到它对应的值 `20`。

### 声明、初始化

在 Java 中，使用变量前必须先声明它。声明告诉程序“我要使用一个名字作为变量名”，而初始化则把一个初始值绑定给变量。变量在声明时要指定类型，变量的类型一旦确定就不能被改变。

```Java 
int count; // 声明变量 count，还没有绑定值
count = 10; // 初始化绑定整数10

String player = "Alex"; // 也可以在声明的同时初始化，让player 绑定字符串Alex
```

> [!TIP]
> 在 Java 中，如果你尝试使用一个没有初始化的变量，会报错。初始化是第一次绑定值的机会。

### 赋值

变量可以被重新绑定到新的值。也就是说，变量名本身不变，但它指向的值可以改变（这样说并不准确，但是暂且可以这么理解）：

```Java
float health = 20; // 玩家当前生命值
System.out.println(health); // 20.0
health = 15; // health 现在绑定新值 15.0（int类型可以自动被转化为float）
System.out.println(health); // 15.0
```

### 作用域

变量的有效范围叫做作用域。在 Java 中，作用域决定了你在哪些地方可以使用某个变量，通常情况下，作用域由变量周围的`{ ... }`确定。

``` java {title="一个错误的程序"}
public class Main {
    public static void main(String[] args) {
        { // temp 在这个大括号中
            System.out.println(temp); // 这里还没有声明 temp，会报错
            int temp = 5;
            System.out.println(temp); // 5
        } // temp 在这个大括号中
        // 这里已经离开了 temp 的作用域，访问会报错
        System.out.println(temp); // 报错
    }
}
```

### 常量

如果你想创建一个不会改变的值，可以使用 final 关键字，通常我们会使用大写的字母命名以示区分。常量在初始化之后不能被重新绑定：
```Java
final int MAX_HEALTH = 20; // 最大生命值
System.out.println(MAX_HEALTH); // 20
MAX_HEALTH = 25; // 报错！final变量不能重新绑定
```

## 表达式

什么是表达式？直观来看，表达式就是能算出一个值的式子。例如，我们反复写到的`1 + 2`就是一个表达式，它算出的值是 `3`。既然是个值，就可以直接使用，也可以赋值给一个变量：

```Java
float health = 2 * 10; // health 是 20.0
System.out.println(health - 10); // 10.0
System.out.println(health); // 20.0，因为在上一行，我们只是求了一个表达式的值，并没有改变health绑定的值
health = health - 10; // 重新绑定 health
System.out.println(health); // 10.0
```

### 算术运算

```Java
int a = 1 - 2; // a 绑定了 -1
int b = 3 * 4; // b 绑定了 12
double c = 10 / 3; // c 绑定了 3.0，（先算整数除法结果为3，赋值给double变量时自动转为3.0）
double d = 10.0 / 3; // d 绑定了 3.3333...
int e = 10 % 3; // e 绑定了 1（取模）
int f = 3 + 10 * (10 / (1 + 1)); // 53，使用小括号改变运算优先级
```

> [!NOTE]
> 在除法运算中，若除数与被除数至少有一个是浮点数，那么按浮点数作除法；否则，结果为整数。
### 比较运算

```Java
int health = 20;
boolean b1 = health == 10; // false，等于
boolean b2 = health != 10; // true，不等于
boolean b3 = health > 10;  // true，大于
boolean b4 = health <= 20; // true，小于等于
boolean closeEnough = Math.abs(health - 20.0) < 0.0001; // true，浮点数使用近似比较。（Math.abs()求绝对值）
```
### 逻辑运算

```Java
boolean hasTool = false; // 没有使用工具
boolean canBreak = true; // 方块可被破坏

boolean canMine = hasTool && canBreak; // false，逻辑与(&&, 二者同时为true时结果为true)
boolean needWarning = !hasTool || !canBreak; // true，逻辑非(!, 取反) + 逻辑或(||, 二者有true即为true)
```

> [!NOTE] 短路运算符
> `&&` 和 `||` 是短路运算符：如果左边的值已经能决定结果，右边就不会再计算
### 一些运算符带有副作用

通常情况下，表达式的求值不会改变其中涉及的变量本身的值。然而，有一些带副作用的表达式（例如 `++`、`--`等）会在求值时顺带改变表达式中变量的值，这种副作用往往会带来意想不到的结果。**不要使用它们**，除非你就是如此设计的。

```Java
int x = 5;
int y = x++;   // y 绑定了 5，x 再增加到 6
int z = ++x;   // x 先增加到 7，然后 z 绑定了 7
x += 3;        // x 绑定了 10，相当于 x = x + 3
```