---
title: "类与继承"
subtitle: ""
date: 2025-09-03T16:00:40+08:00
categories:
weight: 60
description: ""
keywords: ""
draft: true
author: {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://i.ooxx.ooo/i/ZGM0M.jpg"}
---

在上一节，我们学习了函数、lambda 表达式和流操作，它们让我们可以以声明式的方式处理数据和行为。例如，我们可以写出：

```java {.no-header}
List<Entity> entities = ...;
entities.stream().filter(Entity::isHostile).forEach(e -> e.damage(5));
```

在这段代码中，我们关注的是行为：对每个敌对实体执行伤害操作。而实体的数据（生命值、速度、位置、状态效果等）则分散在不同地方，需要手动管理。

在实际的 Mod 开发中，我们不仅关心行为，还需要管理复杂的状态和属性。比如：

+ 方块的位置、类型、耐久度；
+ 物品的属性、可堆叠数量、效果；
+ 实体的生命值、速度、状态效果；
+ ...

为了更好地组织这些数据和行为，Java 提供了对象和类的机制：

+ 对象（`Object`）：封装了数据（字段）和行为（方法）的实例。
+ 类（`Class`）：对象的蓝图，定义它有哪些属性和行为。

通过类，我们可以把相关的数据和方法组合在一起，实现封装、重用和扩展。

在本章中，我们将一步步学习如何用 Java 定义类、创建对象、管理对象状态，并结合 Minecraft 示例，观察游戏中定义实体的相关代码，了解面向对象编程的最佳实践。

## 基于类型的面向对象的基本思想

假设你正在和朋友一起联机玩 Minecraft。一开始，你可能只是注意到：

+ 你看到自己的人物在世界里移动。
+ 朋友的人物也在动，但你无法直接控制他。
+ 你们都能挖方块、放方块、攻击怪物，但每个人看到的世界略有不同，直到游戏同步信息。

慢慢地，你会发现几个现象：

> [!INFO] 独立的“操作单元”
> 你和朋友的游戏画面虽然在同一个世界里，但每个人的行为和状态是独立管理的：
> + 你的角色有自己的位置、血量、背包物品；朋友的角色也有自己的位置、血量、背包物品；
> + 你们各自执行动作时，互不干扰，除非通过游戏规则（比如攻击，推动）影响对方。
>
> 你认识到：每个玩家就像一个独立的实体，它管理自己的状态，并能做自己的事情。在程序设计中，我们把这样的实体叫作一个**对象**

> [!INFO] 拥有“状态”和“行为”
> 对象通过管理自己的状态和行为，让整个系统有条理。每个对象都有一个“封闭的世界”，其他对象只能通过约定好的方法与它互动：
> + 状态：角色的位置、血量、背包里的物品
> + 行为：角色可以移动、攻击、挖掘、放置方块、打开箱子、聊天等

> [!INFO] “内”“外”分明
> 每个玩家的客户端内部管理着自己的数据：位置、背包、血量……你不能直接看到朋友的背包，或操控他的生命值。
> <br><br>
> 面向对象提倡**封装**：由对象管理自己的状态，只暴露必要接口给外界操作。
>
> 封装让系统变得可靠而清晰：每个对象都有自己的“防护墙”，外部只能通过约定好的方式与它交互。

这就是面向对象的基本思想：把系统拆分成独立的对象，每个对象管理自己的状态和行为，通过封装和接口与其他对象协作，让复杂系统变得清晰、可靠、易扩展。

## 类与对象

在 Java 中，一切都是对象（除了基本类型），例如，我们之前接触到的 `String`、`Integer`、`Double` 等都是对象：

```java {.no-header}
String name = "Steve";
List<String> inventory = new ArrayList<>();
inventory.add("Wooden Sword");
inventory.add("Apple");
```

+ 状态（**字段**）：每个对象都有属于自己的数据。例如：
    + `name` 对象内部保存了字符串 `"Steve"` 的值
    + `inventory` 对象内部保存了一系列物品名称

&emsp; 虽然你不能直接看到 `String` 或 `ArrayList` 内部是如何存储数据的，但可以通过提供的方法访问它们。

+ 行为（**方法**）：对象可以执行自己的操作，这些操作可以被调用。例如：
    + `name.length()` 方法可以获取字符串 `"Steve"` 的长度
    + `inventory.add("Wooden Sword")` 方法可以向背包中添加一把木剑

---

我们之前接触过类型：
```java {.no-header}
int health = 20;
String name = "Steve";
List<String> inventory = new ArrayList<>();
```

+ 每个变量都有类型：`int`、`String`、`List<String>`
+ 类型定义了变量可以保存什么样的值，以及可以对它们做哪些操作

**类**，就像是一张蓝图，描述了对象应该有什么字段和方法，它是 Java 中最常见的自定义类型。

例如，`String` 就是一个类，它定义了：
+ 字段：一个不可变的字符序列
+ 方法：`length()`、`substring()`、`toLowerCase()` 等

对象 `"Steve"` 就是 `String` 类的一个实例。

### 定义类

如果你需要自己设计这张蓝图，就要定义自己的类：使用 `class` 关键字，并在其中声明字段和方法。

之前我们的代码结构一直是：

```java {title="Main.java"}
public class Main {

    // 相关函数

    public static void main(String[] args) {
        // 入口逻辑
    }
}
```

现在，我们可以定义一个 `Player` 类：

```java {title="Main.java"}
public class Main { ... }

class Player {
    // 类的字段

    // 类的方法
}
```

#### 为类添加字段

添加字段的语法和变量声明类似，每个对象都会拥有这些字段的“独立副本”：

```java {title="Main.java", data-open=true}
class Player {
    int health;
    String name;
    List<String> inventory;
}

public class Main {
    public static void main(String[] args) {
        Player steve = new Player(); // 创建一个新的 Player 对象
        steve.name = "Steve"; // 初始化该对象的字段
        steve.health = 20;

        Player alex = new Player(); // alex 和 steve 是两个不同的对象
        alex.name = "Alex"; // 它们各自有自己的字段值
        alex.health = 18;

        System.out.println(steve.health); // 20
        System.out.println(alex.health);  // 18
    }
}
```

> [!IMPORTANT] 字段初始化
>
> ``` java {.no-header}
> class Player {
>     int health = 20; // 你可以在定义字段时初始化它们
>     String name; // 你也可以不初始化，此时它是 null
>     List<String> inventory;
> }
> public class Main {
>     public static void main(String[] args) {
>         Player steve = new Player(); // 创建一个新的 Player 对象
>         steve.name = "Steve"; // 在创建对象后初始化字段
>         System.out.println(steve.inventory); // 报错：字段inventory没有初始化
>     }
> }
> ```

> [!NOTE] 创建对象
> 啊，似乎一直没有讲怎么创建对象，但是我想你已经会了：\
> `new XXX()` 就是创建了一个新的 `XXX` 对象。

#### 为类添加方法

```java {data-open=true}
class Player {
    int health;
    String name;

    void damage(int amount) {
        health = health - amount;  // 在方法内部修改该对象的字段
    }

    void heal(int amount) {
        health = health + amount;
    }

    void showStatus() {
        System.out.println(name + " 的生命值为：" + health);
    }
}

public class Main {
    public static void main(String[] args) {
        Player steve = new Player();
        steve.name = "Steve";
        steve.health = 20;

        steve.damage(5);
        steve.showStatus();  // Steve 的生命值为：15

        steve.heal(1);
        steve.showStatus();  // Steve 的生命值为：16
    }
}
```

### 方法重载

有时候，我们希望同一个行为可以接受不同的输入参数。这时就可以用**方法重载**。

在同一个类里，可以定义多个 方法名相同、但参数列表不同（参数类型、数量、顺序）的方法。

```java {data-open=true}
class Player {
    String name;
    List<String> inventory = new ArrayList<>(); // 可以在这里提供默认值

    // 添加单个物品
    void addItem(String item) {
        inventory.add(item);
    }

    // 添加多个物品
    void addItem(String item1, String item2) {
        addItem(item1); // 调用 addItem(String item)
        addItem(item2);
    }

    // 从一个列表里添加物品
    void addItem(List<String> items) {
        items.forEach(this::addItem); // 或者 inventory.addAll(items);
    }
}

public class Main {
    public static void main(String[] args) {
        Player steve = new Player();
        steve.name = "Steve";
        steve.addItem("Wooden Sword"); // 添加一件物品
        steve.addItem("Apple", "Bread"); // 添加两件物品
        steve.addItem(List.of("Torch", "Stone", "Pickaxe")); // 添加一个列表
        System.out.println(steve.inventory); // [Wooden Sword, Apple, Bread, Torch, Stone, Pickaxe]
    }
}
```

为什么要用重载？
+ 让接口更自然：同一个概念的不同变体，使用相同的方法名，更符合直觉；
+ 减少记忆负担：不需要记一堆不同方法名，只要记 `addItem()` 就行；
+ 增强可读性，简化代码： 例如，`void addItem(String item1, String item2)` 复用了 `void addItem(String item)` 的代码，但又有自己的逻辑。

> [!NOTE] `this`是什么？
> 在这段代码中，我们直接调用了当前对象的`addItem(String)`方法：
> ``` java {.no-header}
> void addItem(String item) {
>    addItem(item1);
>    addItem(item2);
> }
> ```
> 但是，当使用方法引用时，例如`addItem(List<String>)` 内部使用了指向当前对象下的 `addItem()` 的方法引用，始终需要知道方法的所有者：
> ``` java {.no-header}
> void addItem(List<String> items) { items.forEach(this::addItem); }
> ```
> 在 Java 中，`this` 代表**当前对象本身**。
> 
> 使用 `this` 常规地调用对象的方法也是可以的，只不过稍显繁琐： `this.addItem(item1)`
> 
> 此外，当函数参数与字段名相同时，必须使用 `this` 关键字来区分：
> ``` java {.no-header}
> class Player {
>     String name;
> 
>     void setName(String name) {
>         this.name = name; // 左边是字段，右边是参数
>     }
> }
> ```
> > [!IMPORTANT] 什么时候必须用 `this`？
> > + 方法引用：`items.forEach(this::addItem)`;
> > + 字段和参数有同名时：`this.name = name`;
> > + 在构造函数中调用另一个构造函数（你马上会学到）：`this(name, health)`

## 构造函数

你早就无师自通，并且习以为常了：
```java {.no-header}
// 这样可以创建一个对象
Player steve = new Player();
```
但是，`Player()`是什么东西？像是个函数调用，但我们并没有定义过叫`Player()`的函数。

事实上，这就是一个**构造函数**，它是类的特殊方法，在创建对象时自动调用。

如果你没有手动写过构造函数，那么编译器会自动生成一个默认的构造函数，它会为所有的实例字段初始化默认值：

```java {.no-header}
class Player {
    String name = "Steve";  // 默认值为 "Steve"
    String inventory;  // 默认值为 null
    int health; // 默认值为 0
}
```

但是我们当然不能满足于此，让我们自定义构造函数，来初始化对象的状态：
+ 函数名必须和类名相同
+ 没有返回值（甚至不能写 void）
+ 可以重载（多个构造器，参数不同）

```java {data-open=true}
class Player {
    String name;
    int health;

    Player() {} // 如果你没有自定义构造函数，编译器会自动生成一个这样的构造函数

    // 自定义的构造函数
    Player(String name, int health) {
        this.name = name;
        this.health = health;
    }
}

public class Main {
    public static void main(String[] args) {
        Player steve = new Player("Steve", 20);
        Player alex = new Player();
        System.out.println(alex.name); // 没有初始化，为 null
    }
}
```

为了减少重复的代码，你甚至可以用`this()`调用另一个构造函数（必须在第一行）：

``` Java {data-open=true}
class Player {
    String name;
    int health;

    Player(String name) {
        this(name, 20); // 调用全参数构造器
    }

    Player(String name, int health) {
        this.name = name;
        this.health = health;
    }
}
```

> [!TIP] 无构造函数
> 当你没有自定义构造函数，编译器会自动生成一个默认的构造函数，它会为所有的实例字段初始化默认值。
>
> 默认构造函数只在**没有任何自定义构造函数**时生成，一旦你写了任意构造函数，编译器就不再生成无参构造函数。
>
> 例如，在上面的用例中，调用 `new Player()` 时，编译器会报错。
> 
> 如果希望同时支持无参构造器，需要手动定义一个 `Player()` 构造器。

构造函数还有一些需要注意的地方，让我们在下一部分再详细介绍。

## 继承

在上一章，我们学习了如何定义类、创建对象、添加字段和方法。
但是在实际的 Minecraft 开发中，你会发现：不同的对象之间往往有许多共性。

比如：玩家（Player）、猫（Cat）、生物（Mob）、雪球（Snowball）…… 它们都有位置（x, y, z），都会出现在世界里，也都可以被移除。但它们的行为又不一样：

+ 生物会叫，例如，猫可以喵喵叫
+ 玩家可以丢物品
+ 雪球可以被丢出，并且击中目标后会消失

如果我们为每种实体都写一份完全独立的代码，就会有大量重复。
继承就是 Java 提供的一种机制，让我们把共性抽取到“父类”里，再让“子类”去扩展特殊行为。

### 父类与子类
首先，我们定义一个最基础的父类 Entity，代表游戏中所有实体：

```Java {data-open=true}
class Entity {
    public double x, y, z;

    public Entity(double x, double y, double z) {
        this.x = x; this.y = y; this.z = z;
    }

    public String getPosition() {
        return "(" + x + ", " + y + ", " + z + ")";
    }

    public final void discard() {
        System.out.println("实体已从世界上移除");
    }
}
```

在这个类里，我们做了几件事：

+ 定义了所有实体共享的字段：位置 `(x, y, z)`；
+ 定义了一个方法 `getPosition()` 来获取位置；
+ 定义了 `discard()` 方法，用 `final` 修饰，表示子类**不能**覆盖这个方法，保证“移除逻辑”的一致性；

> [!TIP] `final` 关键字
> 修饰类：表示该类不能被继承
> 修饰方法：表示方法不能被覆盖，只能被子类继承
> 修饰字段：表示字段不可更改（常量）

---

怎样才能让`Player`具有和`Entity`相同的行为？我们可以让`Player`继承`Entity`：

```Java {data-open=true}
class Player extends Entity {
    public String name;

    public Player(String name, double x, double y, double z) {
        super(x, y, z); // 调用父类构造器
        this.name = name;
    }

    // 玩家特有的方法：丢掉物品
    public void dropItem(String item) {
        System.out.println(name + " 在 " + getPosition() + " 丢出了 " + item );
    }
}
```

`extends` 关键字让 `Player` 继承了 `Entity` 的所有非`private`字段和方法。在 `Player` 类里，我们又添加了 `name` 字段和 `dropItem()` 方法。

我们先来看 `Player` 的构造函数：

这里使用了 `super()` 调用父类——也就是 `Entity` 的构造器（必须在第一行调用），并传入 `x, y, z` 作为参数，此时，尽管没有在`Player`中写明坐标变量，但是编译器会调用父类的构造器，并将 `x, y, z` 赋值给相应字段。

```Java {data-open=true}
public class Main {
    public static void main(String[] args) {
        Player steve = new Player("Steve", 0, 0, 0);
        System.out.println(steve.getPosition()); // (0.0, 0.0, 0.0)
        steve.dropItem("Wooden Sword"); // Steve 在 (0.0, 0.0, 0.0) 丢出了 Wooden Sword
        steve.discard(); // 实体已从世界上移除
    }
}
```

在这个用例中，`steve.discard()`就是继承自父类的 `discard()` 方法，它会打印出“实体已从世界上移除”的消息，这样显著地减少了代码重复。

> [!TIP] 构造函数的调用顺序
> 
> 使用 `super( ... )` 调用父类构造器，将 `x, y, z` 赋值给相应字段
>
> 假如没有显式调用`super( ... )`，编译器会在子类构造函数最开头调用默认的父类构造函数`super()`，但由于我们的示例中 `Entity` 没有无参构造函数，所以会报错。

### 子类覆盖父类方法

父类的方法可以被子类覆盖，这意味着子类可以提供自己的实现，而不用修改父类的代码。

我们用 `Mob` 和 `Cat` 来举例：

```Java {data-open=true}
class Mob extends Entity {
    public Mob(double x, double y, double z) { super(x, y, z); }

    public String getAmbientSound() {
        return "默认叫声";
    }
}

class Cat extends Mob {
    public boolean inLove;

    public Cat(double x, double y, double z, boolean inLove) {
        super(x, y, z);
        this.inLove = inLove;
    }

    @Override
    public String getAmbientSound() {
        if (inLove) return "喵喵喵";
        return "喵";
    }
}
```

在这个例子中，`Mob` 类继承了 `Entity` 类，并提供了默认的 `getAmbientSound()` 方法。

`Cat` 类继承了 `Mob` 类，并提供了自己的 `getAmbientSound()` 方法，覆盖了父类的实现。

```Java {data-open=true}
public class Main {
    public static void main(String[] args) {
        Mob mob = new Mob(0, 0, 0);
        System.out.println(mob.getAmbientSound()); // 默认叫声
        Cat cat = new Cat(0, 0, 0, false);
        System.out.println(cat.getAmbientSound()); // 喵
        cat.inLove = true;
        System.out.println(cat.getAmbientSound()); // 喵喵喵
    }
}
```

> [!TIP] 方法覆盖
> 
> 子类可以覆盖父类的方法，但不能改变方法的签名（否则就算作方法重载）。
> `@Override` 不是必须的，但它可以起提示作用，帮助你检查代码是否正确。

### 子类调用父类方法

能被扔出去的东西（`Projectile`）有很多，雪球就是其中之一。我们可以让 `Snowball` 类继承 `Projectile`，并提供自己的 `onHit()` 方法：

```Java {data-open=true}
class Projectile extends Entity {
    public Projectile(double x, double y, double z) { super(x, y, z); }

    public void onHit(String target) {
        System.out.println("投射物击中了: " + target);
        discard(); // 父类 Entity 的 discard()
    }
}

class Snowball extends Projectile {
    public Snowball(double x, double y, double z) { super(x, y, z); }

    @Override
    public void onHit(String target) {
        System.out.println("雪球击中了: " + target);
        super.onHit(target); // 调用父类逻辑，最终调用 Entity 的 discard()
    }
}

public class Main {
    public static void main(String[] args) {
        Snowball snowball = new Snowball(0, 0, 0);
        snowball.onHit("墙");
        // 输出：
        // 雪球击中了: 墙
        // 投射物击中了: 墙
        // 实体已从世界上移除
    }
}
```

### 基于继承的多态

在上一小节中，我们已经有 `Entity`、`Mob` 和 `Cat` 类：
+ `Entity`：类，所有实体都有位置 (x, y, z)，可以被移除
+ `Mob`：继承 `Entity`，增加了 `getAmbientSound()` 方法
+ `Cat`：继承 `Mob`，覆盖 `getAmbientSound()` 方法

还记得吗？我们说，将一个值绑定到一个变量时，它们的类型需要一致。既然子类继承自父类，那么自然子类的对象也应该可以绑定父类的变量：

```Java {.no-header}
Entity e1 = new Player("Steve", 0, 0, 0); // 父类变量绑定了 Player 对象
Entity e2 = new Cat(10, 0, 0, false); // 父类变量绑定了 Cat 对象
```

尽管变量类型都是 `Entity`，但是实际绑定的对象分别是 `Player` 和 `Cat`。

运行时行为依赖值（对象）的实际类型，而不是变量的声明类型，这就是**多态**。

---

在调用方法时，会发生什么呢？

`getPosition()` 来自 `Entity`，父类变量可以直接调用。
```Java {.no-header}
System.out.println(e1.getPosition()); // (0.0, 0.0, 0.0)
System.out.println(e2.getPosition()); // (10.0, 0.0, 0.0)
```

`getAmbientSound()` 来自 `Mob`，子类 `Cat` 覆盖了父类的实现。然而，由于 `e2` 变量的类型是 `Entity`，Java 在运行之前并不知道它到底是不是 `Mob`，因此无法直接调用 `getAmbientSound()` 方法。

```Java {.no-header}
// 需要父类是 Mob 才能调用 getAmbientSound
if (e2 instanceof Mob m) {
    System.out.println(m.getAmbientSound()); // 调用 Cat 的版本，输出 "喵"
}
```

> [!TIP] 判断类型
> `instanceof` 用来判断一个对象是否是某个类或其子类的实例。

在实际开发中，我们经常会有“实体列表”，其中包含不同类型的实体：

```Java {data-open=true}
List<Entity> entities = List.of(
    new Player("Steve", 0, 0, 0),
    new Cat(10, 0, 0, false),
    new Cat(15, 0, 5, true)
);

entities.stream().map(Entity::getPosition).forEach(System.out::println); // 输出三个坐标
entities.stream()
    .filter(e -> e instanceof Mob) // 只保留 Mob 或其子类
    .map(m -> (Mob) m) // 转换为 Mob 类型
    .map(Mob::getAmbientSound)
    .forEach(System.out::println); // 输出 "喵" 和 "喵喵喵"

// 如果直接写 e2.getAmbientSound() 会报错，因为 Entity 类型没有该方法，Java 编译器只看变量声明类型，而不是绑定的值的类型。
```

> [!INFO] 多态有什么用
> + 统一操作接口：父类方法 (`getPosition()`) 可以直接调用，无需为每个子类写单独处理逻辑，代码更通用
> + 子类决定行为：覆盖父类方法 (`getAmbientSound()`) 后，调用父类引用方法时会执行子类逻辑
> + 安全与约束：父类可以定义 `final` 方法或默认行为，确保核心逻辑不可被覆盖，子类只能扩展或覆盖可扩展的方法
> + 可扩展性强：添加新的生物类，例如 `Dog` 继承 `Mob` 并覆盖 `getAmbientSound()`，现有代码无需修改

### 抽象类

刚才，你已经写了一个 `Entity` 类：

```Java {.no-header}
class Entity {
    ...

    public Entity(double x, double y, double z) { ... }

    ...
}
```

于是，抱着“不用白不用”的想法，你在 `main` 中写道：

```Java {.no-header}
Entity e = new Entity(0, 0, 0);
```

但仔细一想，在 Minecraft 中，并没有一个叫作 `Entity` 的东西真正存在。

+ 实际存在的只有子类：玩家（Player）、怪物（Mob）、雪球（Snowball）等；
+ Entity 本身只是一个概念，一个模板：它定义了所有实体共有的属性（位置）和方法（移动、移除等），但它本身不会出现在游戏世界里。

这时，你会明白，`Entity` 是一个抽象类，它不能被实例化，只能被继承。

---

抽象类（abstract class） 是一种 不能实例化的类，用来作为其他类的模板。

可以包含：

+ 字段（普通属性，例如 `x`, `y`, `z`）
+ 普通方法（已经实现的方法，例如 `discard()`）
+ 抽象方法（没有方法体，必须由子类实现）

```Java {data-open=true}
abstract class Entity {
    double x, y, z;

    public Entity(double x, double y, double z) {
        this.x = x; this.y = y; this.z = z;
    }

    public void move(double dx, double dy, double dz) {
        x += dx; y += dy; z += dz;
    }

    // 抽象方法：子类必须实现
    public abstract void tick(); // 每帧更新行为
}
```

继承抽象类的子类必须实现所有抽象方法，否则无法实例化。

```Java {data-open=true}
class Player extends Entity {
    String name;

    public Player(String name, double x, double y, double z) {
        super(x, y, z);
        this.name = name;
    }

    @Override
    public void tick() {
        System.out.println(name + " 正在更新状态");
    }
}
```

自然，`Mob` 也应当是一个抽象类，因为它没有自己的行为，而是依赖于 `Entity` 的 `tick()` 方法。

```Java {data-open=true}
abstract class Mob extends Entity {
    public Mob(double x, double y, double z) { super(x, y, z); }

    public abstract String getAmbientSound();
}
```

有了抽象类，我们就可以在定义模板，提取相同逻辑的同时，避免了实例化像`Entity`这样无实际意义的对象的行为。

## 修饰符

### 访问控制

到目前为止，我们的 Player、Entity 等类里的所有字段和方法都是 public，也就是说：

```Java {.no-header}
Player steve = new Player("Steve", 20);
steve.health = 100; // 直接修改字段
steve.name = "Alex"; // 直接修改字段
```

外部程序可以随意访问和修改对象内部的数据。虽然方便，但在实际开发中，这样会带来几个问题：
+ 安全性低：外部可以随意修改状态，例如血量可以直接改成负数。
+ 难以维护：如果以后你想改变字段的内部表示方式，外部代码可能依赖了旧的实现。
+ 逻辑不一致：对象本身的规则（比如血量不能超过最大值）可能被绕过。

为了解决这些问题，Java 提供了访问控制修饰符：

| 修饰符 | 类内部 | 包内部 | 子类 | 包外 |
| :---: | :---: | :---: | :---: | :---: |
| public | √ | √ | √ | √ |
| protected | √ | √ | √ | × |
| 默认 | √ | √ | × | × |
| private | √ | × | × | × |

---

例如：
```Java {.no-header}
class Player {
    public int health;
    public String name;

    public Player(String name, int health) {
        this.name = name;
        this.health = health;
    }
}
```

外部程序可以直接修改 `health`，可能导致不合理状态：
```Java {.no-header}
Player steve = new Player("Steve", 20);
steve.health = -100; // 血量不可能为负
```

为了防止这种情况，我们可以把 `health` 字段声明为 `private`，外部程序只能通过 getter 和 setter 方法来访问和修改它：

```Java {data-open=true}
class Player {
    private int health;
    public String name;

    public Player(String name, int health) {
        this.name = name;
        setHealth(health); // 调用 setter 方法
    }

    public int getHealth() {
        return health;
    }

    public void setHealth(int health) {
        if (health < 0) this.health = 0; 
        else this.health = health;
    }

    // 其他方法
    public void damage(int amount) {
        setHealth(health - amount); // 使用 setter 确保血量合理
    }

    public void heal(int amount) {
        setHealth(health + amount);
    }
}
```

现在，外部程序只能通过 `getHealth()` 和 `setHealth()` 方法来访问和修改 `health` 字段，并确保其合理性:

```Java {.no-header}
Player steve = new Player("Steve", 20);
steve.damage(25);
System.out.println(steve.getHealth()); // 0（自动限制最小血量）
steve.setHealth(100);
System.out.println(steve.getHealth()); // 100
```

> [!IMPORTANT] 使用 `getter` 和 `setter` 的最佳实践
> `getter` 不应修改对象状态
> `setter` 可以参数校验、类型转换等操作，并确保对象状态的一致性
> 对于只读字段，可以只提供 `getter`


> [!TIP] 子类无法访问父类的 `private` 字段
> 
> 子类无法访问父类的 `private` 字段，但可以通过 `getter` 和 `setter` 方法来访问和修改。
> ```Java {.no-header}
> class Him extends Player {
>     public Him() {
>         super("him", 20); // 调用父类构造器初始化 health
>     }
> 
>     public void talk() {
>         System.out.println("本次更新移除了" + name); // 能访问父类的 public 字段
>         // health = 0; 报错：不能直接访问或修改父类的 private 字段
>         setHealth(20); // 调用父类的 setter 方法修改 health
>     }
> }
> ```


### 静态方法或字段

静态方法是被 `static` 关键字修饰的方法，我们早就在《函数与闭包》一节写的函数都是静态方法。在很多类中，静态内容可以用来共享数据或逻辑，而不依赖于实例。

静态内容属于类：
+ 可以直接通过类名调用，不需要创建对象，例如：`Player.showTotalPlayers()`。
+ 不能访问实例字段（因为没有具体对象）

```Java {data-open=true}
class Player {
    public static int totalPlayers = 0; // 属于 Player 类本身，所有玩家共享的数量

    public Player(String name) {
        totalPlayers++;
    }

    public static void showTotalPlayers() {
        System.out.println("总玩家数：" + totalPlayers);
    }
}

public class Main {
    public static void main(String[] args) {
        Player.showTotalPlayers(); // 0
        Player steve = new Player("Steve");
        Player alex = new Player("Alex");
        Player.showTotalPlayers(); // 2
    }
}
```

### 不可变

我们再回顾一下：
+ final 字段：可以在声明时初始化，或在构造函数中初始化。但初始化后就不能再修改；
+ final 方法：子类不能覆盖；
+ final 类：不能被继承

---

通过访问控制、`static` 和 `final` 我们可以写出更安全、可维护、清晰的 Java 代码。

## 内部类、匿名类

### 内部类

在 Minecraft 中，有一个 `Bee` 类：

```Java {data-open=true}
class Bee {
    private String name;

    public Bee(String name) {
        this.name = name;
    }

    public void printInfo() {
        System.out.println("Bee name: " + name);
    }
}
```

你现在想给蜜蜂添加行为目标，比如：
+ 会采花（`PollinateGoal`）
+ 当你惹恼蜜蜂后，会群起而攻击敌人（`GlobalAttackGoal`）

那么问题来了：

这些行为目标应该怎么写？你会把这些行为写成普通方法吗？还是写成独立的类？

最朴素的想法，把它们都写成普通的方法：
```Java {data-open=true}
class Bee {
    private String name;

    public Bee(String name) { this.name = name; }

    public void startPollinating() {
        System.out.println(name + " 开始采花。");
    }

    public void attack(String target) {
        System.out.println("攻击 " + target + "!");
    }
}
```

但是如果行为变多，方法越来越多怎么办？类变得臃肿，而且不同行为的逻辑互相耦合，难以单独复用。另外：
+ 采花行为可能有状态：`pollinating = true / false`
+ 如果写成普通方法，这个状态要么存到 Bee 里（污染了外部类），要么每次都传参数
+ 攻击行为可能也需要状态：是否正在攻击、攻击的目标等，攻击的目标甚至全局共享

换句话说，这个采花的功能不仅涉及到了某个行为，还涉及到了状态，这完全符合类和对象的思想。

这时，我们就可以使用**内部类**来解决这个问题。

#### 普通内部类

请看这个例子：
```Java {data-open=true}
class Bee {
    private String name;

    public Bee(String name) { this.name = name; }

    // 普通内部类
    public class BeePollinateGoal {
        private boolean pollinating;

        public void startPollinating() {
            pollinating = true;
            System.out.println(name + " 开始采花。"); // 可以直接访问外部类的成员变量
        }

        public void stopPollinating() {
            pollinating = false;
            System.out.println(name + " 停止采花。");
        }

        public boolean isPollinating() {
            return pollinating;
        }
    }
}
```

这样，`pollinating`完全属于 `BeePollinateGoal` 内部，外部类 `Bee` 无需关心它的存在。

内部类对象必须依赖外部类对象才能创建，使用`外部类对象.new`：
```Java {.no-header}
Bee bee = new Bee("Bumble");
Bee.BeePollinateGoal goal = bee.new BeePollinateGoal();
goal.startPollinating();
goal.stopPollinating();
```

#### 静态内部类

内部类还可以声明为 `static`，它的对象不依赖外部类实例：可以访问外部类的静态成员，但不能访问实例成员。

在蜜蜂的攻击行为中：
+ 攻击目标：全局共享，应该写成静态内部类；
+ 攻击行为：蜜蜂个体的行为，应该写成普通内部类。

```Java {data-open=true}
class Bee {
    private String name;

    public Bee(String name) { this.name = name; }

    public void attack() {
        AttackGoal goal = new AttackGoal();
        goal.performAttack();
        goal.stopAttack();
    }

    // 普通内部类：每只蜜蜂自己的攻击行为
    public class AttackGoal {
        private boolean isAttacking = false;

        public void performAttack() {
            String target = GlobalTargetGoal.getTarget(); // 调用静态类方法不依赖实例
            if (target.isEmpty()) return;
            isAttacking = true;
            System.out.println(name + " 攻击了 " + target + "!");
        }

        public void stopAttack() {
            if (isAttacking) System.out.println(name + " 停止攻击");
            isAttacking = false;
        }
    }

    // 静态内部类：全局共享攻击目标
    public static class GlobalTargetGoal {
        private static String target = "";

        public static void setTarget(String newTarget) {
            target = newTarget;
            // System.out.println("蜜蜂" + name + " 目标变为：" + target); // 报错：静态方法不能访问实例变量
        }

        public static String getTarget() {
            return target;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Bee.GlobalTargetGoal.setTarget("Steve");
        Bee bee = new Bee("蜜蜂A");
        bee.attack(); // 蜜蜂A 攻击了 Steve! 蜜蜂A 停止攻击
    }
}
```

### 匿名类

在 Minecraft 中，当你的鼠标悬停在物品上时，你会看到相关的提示信息。然而，物品不止一种：
```Java {data-open=true}
class Item {
    String type;

    void showTooltip() {
        if (type.equals("普通苹果")) {
            System.out.println("这是一个苹果");
        } else if (type.equals("神奇苹果")) {
            System.out.println("右键可以吃掉它！");
        } else if (type.equals("魔法武器")) {
            System.out.println("攻击力 +10");
        }
        // ...每加一种物品都要改这里
    }
}
```

这样，每次增加新物品都要改 Item 类，条件分支越来越多，逻辑混乱；而且，这样写对于一个物品可以显示不同提示信息的情况束手无策。

结合上一部分的知识，很自然地想到：由于显示提示信息的逻辑是 `Item` 特有的，我们可以用**静态内部类**来解决：

```Java {data-open=true}
class Item {
    // 我们不希望看到默认提示信息，所以用抽象类强制要求子类实现 showTooltip() 方法
    abstract static class TooltipContext {
        abstract void showTooltip();
    }

    public void displayTooltip(TooltipContext context) {
        System.out.print("物品提示：");
        context.showTooltip();
    }
}
```

在这个示例中，`Item` 类的实例可以通过 `displayTooltip()` 方法传入不同的 `TooltipContext` 的子类的实例，来显示不同的提示信息。

但是，每有一种提示信息，都要写一个新的 `TooltipContext` 子类，这显然不合理。

这时，我们就可以使用**匿名类**来解决这个问题：

---

```Java {data-open=true}
Item apple = new Item();

// 使用匿名类创建 TooltipContext 的实例
Item.TooltipContext simpleTooltip = new Item.TooltipContext() {
    @Override
    public void showTooltip() {
        System.out.println("这是一个红色的苹果");
    }
};

// 调用方法
apple.displayTooltip(simpleTooltip);

String color = "蓝色";
// 直接在方法调用里创建 TooltipContext 的实例
apple.displayTooltip(new Item.TooltipContext() {
    @Override
    public void showTooltip() {
        System.out.println("这是一个" + color + "的苹果"); // 这里可以捕获外部变量
    }
});
```

**匿名类**就是没有名字的类。它通常用来快速实现一个接口或继承一个类，而不必单独写一个完整的子类。它：
+ 没有类名
+ 通常在定义的同时创建对象
+ 可以捕获外部变量
+ 常用于回调、事件处理、策略模式等场景

> [!QUESTION] 脱了裤子放屁？
> 为什么不直接支持一个`item.showTooltip("这是一个红色的苹果");`呢？
> 
> 字符串只是一段静态**数据**：“我要显示什么内容”。匿名类允许你将数据和**行为**一起传入——也就是说，你可以控制显示的逻辑，而不只是显示内容：
> ```Java {.no-header}
> item.displayTooltip(new Item.TooltipContext() {
>    @Override
>    void showTooltip() {
>        if (player.isSneaking()) System.out.println("你偷偷查看了一个隐藏提示！");
>        else System.out.println("这是普通提示");
>    }
> });
> ```
> 你是否发现，这和我们之前讲函数时，使用的 `Callback` 的思想非常相似？你可以尝试用匿名类的风格来写回调！

## 记录类

在 Minecraft 中，需要管理玩家的位置和朝向。每个玩家都有：
+ 所在维度（`Overworld`、`Nether`、`End`）
+ 坐标 (`x`, `y`, `z`)
+ 面向的角度 (`yRot`, `xRot`)

最初，你可能会这样写：
```Java {data-open=true}
class PlayerPosition {
    String dimension;
    double x, y, z;
    float yRot, xRot;

    public PlayerPosition(String dimension, double x, double y, double z, float yRot, float xRot) {
        this.dimension = dimension;
        this.x = x;
        this.y = y;
        this.z = z;
        this.yRot = yRot;
        this.xRot = xRot;
    }

    public String format() {
        return String.format("%s %.2f %.2f %.2f %.2f %.2f", dimension, x, y, z, yRot, xRot);
    }
}
```

然后你在代码中需要不断创建玩家位置对象、打印位置、比较位置……

问题来了：

+ 每次都要手动写构造函数
+ 重写 `toString()`、`equals()`、`hashCode()` 太麻烦
+ 字段都是可变的，容易出错

Java 提供了一个更简洁的方案：record。

---

**record** 是 Java 14 引入的一种特殊的类，用于表示只包含数据的不可变对象。它会自动生成：

+ 构造函数
+ `getter` 方法（和字段同名）
+ `toString()`
+ `equals()` / `hashCode()`

我们可以用 `record` 重写上面的 `PlayerPosition`：

```Java {.no-header}
static record PlayerPosition(String dimension, double x, double y, double z, float yRot, float xRot) {
    public String format() {
        return String.format("%s %.2f %.2f %.2f %.2f %.2f", dimension, x, y, z, yRot, xRot);
    }
}
```
然后，你就可以直接创建 `PlayerPosition` 对象：

```Java {.no-header}
PlayerPosition steve = new PlayerPosition("Overworld", 0, 64, 0, 0, 0);
double x = steve.x();
```

最明显的区别是：
+ 你不需要写构造器，因为它会自动生成；
+ 字段是不可变的，你不能修改它；
+ 自动生成的 `getter` 方法可以直接访问字段。

---

有些数据或逻辑是属于类本身的，而不是某个实例：

```Java {.no-header}
static record PlayerPosition(String dimension, double x, double y, double z, float yRot, float xRot) {
    // 静态字段
    public static final float DEFAULT_Y_ROT = 0f;
    public static final float DEFAULT_X_ROT = 0f;

    // 静态工厂方法
    public static PlayerPosition of(String dimension, double x, double y, double z) {
        return new PlayerPosition(dimension, x, y, z, DEFAULT_Y_ROT, DEFAULT_X_ROT);
    }
}
```
调用：
```Java {.no-header}
PlayerPosition pos = PlayerPosition.of("Overworld", 0, 64, 0);
```

---

有时我们只想显示坐标，不显示旋转角度，可以用方法重载：
```Java {.no-header}
public String format(boolean includeRotation) {
    if (includeRotation) return format();
    return String.format("%s %.2f %.2f %.2f", dimension, x, y, z);
}
```
调用：
```Java {.no-header}
PlayerPosition pos = PlayerPosition.of("Overworld", 0, 64, 0);
System.out.println(pos.format(false)); // 输出 "Overworld 0.00 64.00 0.00"
System.out.println(pos.format(true)); // 输出 "Overworld 0.00 64.00 0.00 0.00 0.00"
```

## 总结

继承是一种让子类复用父类定义的字段和方法的机制。

```Java {.no-header}
abstract class Entity {
    double x, y, z;
    public abstract void tick(); // 每帧更新行为
    // 其他的实体一定具有的底层逻辑
}

class Player extends Entity {
    String name;
    public void tick() { System.out.println(name + " 正在更新状态"); }
}

class Cat extends Entity {
    boolean inLove;
    public void tick() { System.out.println("猫正在移动"); }
}
```

这是合理的，因为 `Entity` 和 `tick()` 都是游戏的底层逻辑，我们对此确信无疑：所有的 `Entity` 都应该具有 `tick()` 方法；\
`Player` 是，且仅是 `Entity`，而不是别的什么 `Block` 或者 `Item`。

然而，很多人喜欢将更具体的业务逻辑放在类中，例如
```Java {.no-header}
class Bird extends Entity {
    void fly() { ... }
    void eat() { ... }
}

class FlyableBird extends Bird {
    @Override
    void fly() { ... }
}

class Penguin extends Bird {
    @Override
    void fly() { throw new UnsupportedOperationException(); } // 子类行为违背父类接口
}
```

这是不可接受的。因为很显然，我们对 `Bird` 的理解不够全面：不是所有的鸟都能飞，不是所有的鸟都能吃东西。我们不敢保证在系统设计的某个阶段，对鸟的需求又会发生什么变化，所以我们不应该将鸟的行为都写在 `Bird` 类中。

一个随之而来的想法是：将**飞行**行为抽象出来。由此，从描述一个动物是什么（`Bird`），变成了描述一个动物能做什么（`Flyable`）。这样，一个类可以实现多个行为，而不用担心违背父类的约束。

抽象成什么呢？不能是类，因为在 Java 中，一个类只能有一个父类，无法实现同时声明具有多个行为。你可能会想到让一个类拥有多个描述功能的字段：

```Java {.no-header}
class Penguin extends Entity {
    Flyable flyable;
    Eatable eatable;
    public void tick() {
       flyable.fly();
       eatable.eat();
    }
}
```

这似乎解决了一些问题，但其实并没有，对于一个 `Entity` 对象，我们不能容易地判断它实现了些什么功能：

```Java {.no-header}
Entity entity = new Penguin();
// if (entity.flyable != null) {} // Java 中不能这么写
```

所幸，Java 提供了一种机制，让我们能够清晰地表达“某个对象能做什么”，而不依赖单一的继承体系。通过这种机制，我们可以把行为从类的继承关系中分离出来，实现更灵活、可扩展的设计。在下一章，我们将正式介绍这种机制——接口（interface），并学习如何用接口来组合不同的行为，避免继承带来的局限。

由此，对于复杂的业务逻辑和问题抽象，我们终于能自信地说：

**组合优于继承**！