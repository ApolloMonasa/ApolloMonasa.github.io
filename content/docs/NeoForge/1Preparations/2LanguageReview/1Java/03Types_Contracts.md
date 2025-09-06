---
title: "类型与契约"
subtitle: ""
date: 2025-09-03T16:00:20+08:00
categories:
weight: 30
description: ""
keywords: ""
draft: true
author: {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://i.ooxx.ooo/i/ZGM0M.jpg"}
---

## 为什么需要类型

在上一章，我们学习了值和字面量。你可能已经注意到，Java 程序并不是允许所有的值随意组合的。比如：
```Java
System.out.println("Hello" + 42); // "Hello42"
System.out.println("Hello" - 42); // 编译错误
```

为什么第一行能运行，第二行就报错了呢？\
这就是类型在起作用。

---
变量和值都不仅有“内容”，还有“类型”

`"Hello"` 不是一个普通的值，而是字符串类型（String）；`42` 是一个整数类型（int）。\
Java 规定，`+` 运算符可以在字符串之间工作，用于拼接字符串（数字将被自动转化成字符串），但 `-` 运算符只能在数字类型之间工作。

换句话说：类型就是关于值能做什么、不能做什么的契约。

我们也可以把“类型”理解为程序和程序员之间的契约：\
如果一个函数写明要返回 `int`，它就绝不会返回 `String`；如果你声明了一个变量是 `boolean`，那你放进去的值就必须是 `true` 或 `false`。

这份契约是由编译器审查的。只要你违反了契约，编译器就会报错。

---

在 Java 开发中，类型契约随处可见：
+ 变量声明：`int x`
+ 类型转换或标注：`(float) x`（你马上会学到）
+ 函数的参数和返回值：在下面这段你已经无比熟悉的代码中，`void`和`String[]`都类型标识。\
其中，`void`表示`main`函数没有返回值；`String[]`是指`main`函数以一个字符串列表为参数。（不太理解？没关系，我们在下一章将会详细学到）
```Java
public static void main(String[] args) { ... }
```
+ 自定义类型：你将在下下章学到
```Java
class Player { ... }
interface IUpdatable { ... }
enum Material { WOOD, STONE, IRON }
```
## 类型的种类

为了方便理解，Java 把常用类型分为两类：
+ **基本类型**：表示简单的数值或逻辑值。\
包括：`int`, `long`, `float`, `double`, `boolean`, `char`
+ **引用类型**：表示更复杂的对象或数据结构，它们往往是由基本类型组合而成。\
包括：类、接口、枚举、记录等等（例如我们曾经看到的`String`，在 Mod开发中经常用到的 `Block`, `Item`等等）

```Java
// 基本类型
float level = 5F; // 玩家等级
level = level + 0.5; // 绑定到新值

// 引用类型
String playerName = "Alex";
playerName = "Steve"; // 绑定到新的字符串对象

Block dirt = Blocks.DIRT; // 右边可以表示一个方块对象
dirt = Blocks.STONE; // 绑定到新的方块对象
```

>[!QUESTION]- 它们有什么区别？
> 你可能注意到，基本类型和引用类型在使用上非常相似：
> + 都可以读取当前值，也可以重新绑定到新值；
> + 操作本质都是“变量名指向某个值”。
> 
> 那么问题来了：为什么 Java 还要区分它们？
>
> 事实上，引用类型可以调用方法、可能为`null`，而基本类型只能表示简单数值或逻辑值。
> 
> 但作为初学者，你大可不必在意这些，它们的区别更多是由于Java的历史包袱所迫，对程序的编写工作几乎没有任何额外的要求。

在函数体内声明变量时，你可以偷懒，使用`var`语句，它将自动推断变量的类型，但是，除非类型过于复杂，我们并不建议大量使用`var`语句：
```Java
// 它们完全等效
var a = 1;
int a = 1;
```

## 类型转换

在 Java 里，类型标识限制了变量能绑定的值，但有时候我们希望把一个类型的值转换成另一种类型，这种操作就叫类型转换。

由于我们还没有对引用类型进行深入的研究，我们现在只关注基本类型的转换。

### 自动转换
当目标类型能容纳源类型的所有值时，Java 会自动转换，例如由字符转化为整形，整型转换到浮点型，`int`转化为`long`等：
```Java
int x = 10;
float y = x; // int 自动转换为 float
int z = 'c'; // z 为 99，是字符 c 的 Unicode编号
```

### 强制转换
当转换可能丢失信息时，需要显式转换：
```Java
float f = 3.14F;
int i = (int) f; // 强制转换，得到 3
```

> [!NOTE]
>类型转换只会产生一个新值（这里是`3`），不会影响`f`的绑定，它仍然是`3.14`。

## 集合类型

> [!NOTE] 泛型
> 在 Java 中，你可能会遇到一些看起来奇怪的写法，比如：
> ```Java
> List<String> names;
> Map<Block, Material> blockMap;
> ```
> 这里的 `<String>`、`<Block, Material>` 就是 **泛型参数**。
> 
> 泛型的作用是：**告诉编译器这个类型里要放什么**。  
> - `List<String>`：这是一个只能装字符串的列表；  
> - `Map<Block, Material>`：这是一个从方块映射到材质的表；  
> - 以后你甚至可以写 `Box<Player>`、`DeferredHolder<?, ? extends ItemLike>` 这样的自定义泛型类。
> 
> 你可以把泛型理解为“类型的类型”，它让我们的契约更加精确。  
> （比如 `List` 只是“一个列表”，而 `List<String>` 则是“一个字符串列表”。）
> 
> 泛型并不是集合独有的特性，只是它们最常见的使用场景。你会在后续的教程里看到泛型在函数、类、接口中的更多用法。

在实际开发中，光靠单个变量往往是不够的。比如，如果你要保存一组玩家的名字，就不可能每一个都手动写成一个变量：

```Java
String player1 = "Alex";
String player2 = "Steve";
String player3 = "Herobrine";
// ...
```
这显然既麻烦，又不灵活。

为了解决这个问题，Java 提供了**集合类型**，它们可以用来保存一组数据。常见的集合类型有：
+ 数组（`String[]`、`int[]` 等）——大小固定，性能高；
+ 列表（`List<String>` 等）——大小可变，灵活常用；
+ 集合（`Set`）、映射（`Map`）
### 数组

数组是最基础的集合类型：长度固定，一旦创建就不能增删元素。访问速度快，适合保存数量固定的数据。

```Java
import java.util.Arrays;

int[] nums = {3, 1, 2}; // 声明数组并初始化

System.out.println(nums[0]); // 获取第1个元素
nums[1] = 5; // 修改第2个元素
System.out.println(nums.length); // 获取数组长度
Arrays.sort(nums); // 排序
```

### 列表

列表`List<T>`是数组的升级版：大小可变，可以随意增删元素。

> [!TIP]- 泛型在这里登场
> 你必须告诉 List 里面放的是什么类型，例如 `List<String>` 就是字符串列表。
> 这样编译器能帮你保证不会把奇怪的东西放进去。

```Java
import java.util.ArrayList;
import java.util.List;

List<String> players = new ArrayList<>();

players.add("Alex"); // 添加
players.add("Steve");
System.out.println(players.get(0)); // 取第一个元素
players.remove("Alex"); // 删除
System.out.println(players.size()); // 获取列表长度
```

> [!NOTE] `ArrayList<>()`是什么？
> 在Java中，`List<T>`只规定了列表的一些必要性质（比如有`add`和`remove`函数），但是列表的具体实现有很多种，其中最常用的是`ArrayList<T>`。
> 
> 由于在声明时`List<String>`已经表明`<>`中的类型是`String`，因此右边的`T`可以省略

还有一种更简单的初始化列表的写法：

```Java
List<String> players = List.of("Alex", "Steve");
```

### 集合

集合是不重复元素的无序容器。

```Java
import java.util.HashSet;
import java.util.Set;

Set<String> blocks = new HashSet<>();

blocks.add("Dirt");
blocks.add("Stone");
blocks.add("Dirt"); // 不会报错，也不会重复添加
System.out.println(blocks.size()); // 2
System.out.println(blocks.contains("Stone")); // true
```

### 映射

映射就是一张键值对表：每个键（Key）对应一个值（Value）。

```Java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> playerLevels = new HashMap<>();

playerLevels.put("Alex", 10);
playerLevels.put("Steve", 5);

// 取值
int a = playerLevels.get("Alex"); // 10

// 判断是否存在
boolean b = playerLevels.containsKey("Steve"); // true
```

在 Mod 开发中，Map 特别常见：记录某个玩家对应的等级、生命值；保存方块到掉落物的映射关系；保存物品 ID 到物品对象的对应关系等等。

> [!TIPS] 
> 每种集合类型都包含一些共有的，或独特的方法。如果你不确定获取元素个数是`length`还是`size`，在使用的时候再向AI询问吧！

## Optional

在 Java 开发中，有时候我们会遇到这样的问题：一个值可能存在，也可能不存在。
最常见的情况就是返回值，比如：

你想查找一个玩家，如果没找到该玩家，应该返回什么？

你想从一个 Map 里获取值，如果键不存在，怎么办？

过去很多 Java 程序都会选择返回 null：
```Java
String findPlayer(String name) {
    if (name.equals("Alex")) {
        return "Alex";
    }
    return null;
}
```

但是这样有个问题：如果调用者忘记检查 null，就会在后面访问时抛出空指针异常（NullPointerException, NPE）。

为了解决这个问题，Java 提供了一个专门的“容器”——Optional<T>。
它表示：一个值可能存在，也可能不存在。

### 创建 Optional

你可以通过
+ `Optional.of(value)`、`Optional.empty()`、`Optional.ofNullable(value)` 来创建 Optional 对象。
+ `Optional.of(value)`：创建一个 Optional 对象，并初始化为非空值。
+ `Optional.empty()`：创建一个空的 Optional 对象。

```Java
import java.util.Optional;

Optional<String> player1 = Optional.of("Alex"); // 一定有值
Optional<String> player2 = Optional.empty(); // 没有值
Optional<String> player3 = Optional.ofNullable(null); // 可能为null
```

### 获取值

因为 Optional 的本质就是“值可能为空”，所以它不允许你直接取值，而是提供了一些安全的方法：

``` Java
Optional<String> player = Optional.of("Steve");

// 如果有值，就取出来
if (player.isPresent()) System.out.println(player.get()); // "Steve"

// 用 ifPresent 自动执行
player.ifPresent(name -> System.out.println("玩家名：" + name));

// 如果没值，可以给一个默认值
String name = player.orElse("默认玩家");
```
> [!ERROR]
> 不幸的是，受限于 Java 的历史包袱，`Optional` 本身就可以是 `null`：
> 
> ```Java {.no-header}
> Optional<String> player = null;
> ```
> 
> 这种代码居然完全合法！你永远无法保证不会有神人这么写。所以，别在 Java 里用 `Optional` 了。


## 枚举类型

有一种特殊的引用类型叫**枚举**类型，它用来表示固定数量的可能值。尽管在Minecraft的开发中，很少使用枚举，但为了教程的完整性，我们依然把它纳入其中。

你可以把枚举理解为：一个变量只能绑定到预先列出的几个值中的一个。

在 Minecraft 中，我们可能需要表示空间坐标的轴：

```Java {title="定义坐标轴的枚举"}
enum Axis {
    X, Y, Z
}
```

这里 `Axis` 是枚举类型，`X`、`Y`、`Z` 是**枚举常量**（固定值）

我们使用`.`来获得枚举中对应的枚举常量，你可以试着将一个变量绑定到`X`轴：

```Java
Axis x = Axis.X;
System.out.println(x); // X
```

看起来有点鸡肋？确实如此。
