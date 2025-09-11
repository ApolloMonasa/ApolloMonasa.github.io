---
title: "泛型与约束"
subtitle: ""
date: 2025-09-03T16:10:10+08:00
categories:
weight: 80
description: ""
keywords: ""
draft: true
author: {name: "wmsnp", link: "https://github.com/wmsnp"}
---

在前面几节，我们学习了类、接口，对 Java 中的多态行为有了很深刻的理解：
+ 子类型多态：子类对象可以赋值给父类引用。
```Java {.no-header}
Animal a = new Dog(); // 子类型多态
```

好处是能通过父类接口编写通用代码，但缺点是类型信息在编译器眼中被“抹平”了，容易出现运行时错误。

+ 委托多态：通过组合和转发来达到类似继承的效果：

```Java {.no-header}
class Penguin extends Entity {
    Flyable flyable;
    Eatable eatable;
}
```

+ 接口多态：不同类通过实现同一个接口来共享一组行为。
```Java {.no-header}
List<String> list = new ArrayList<>();
List<String> list2 = new LinkedList<>();
```

这里 `ArrayList` 和 `LinkedList` 是 `List` 的两种不同实现。

在这些多态模式中，如果我们想编写类型无关的抽象代码，比如一个通用容器，传统的办法是使用 `Object`（也就是任意类型）：


```Java {.no-header}
List list = new ArrayList();
list.add("hello");
list.add(42);

String s = (String) list.get(0);
Integer i = (Integer) list.get(1);
```

这样会有两个严重问题：
+ 缺少编译期类型检查：任何类型都能加进去，要到运行时才抛出 `ClassCastException`；
+ 可读性差：需要到处写强制类型转换。

Java 在 1.5 版本引入了**泛型**，带来了一种全新的多态形式：**参数化多态**。

## 类型的哲学

你并不是第一次接触到泛型，我们之前学过的集合类型就是一种最常见的泛型：
```Java {.no-header}
List<String> list = new ArrayList<>();
list.add("hello");
// list.add(42); // 编译错误，类型安全
String s = list.get(0); // 无需强转
```
这里的关键在于：

我们把 `List` 这个类抽象成一个“类型构造器”，它接受一个类型参数 `<T>` 并生成一个具体类型，如 `List<String>` 或 `List<Integer>`。

这种抽象不是继承链条上的多态，而是通过参数化捕获类的形状，让编译器知道容器中放的到底是什么。

---

初学时我们常把 `<T>` 看作“某个未知类型”。但在 Java 的类型系统中，`T` 的内涵远比占位符复杂：

+ `T` 可以有界限：
```Java {.no-header}
class Box<T extends Number> {
    T value;
}
```
这里 `T` 不再是“任意类型”，而是“所有 `Number` 的子类”。编译器会保证 `value` 至少具备 `Number` 的能力。

+ `T` 可以有多个界限：
```Java {.no-header}
class SortedBox<T extends Number & Comparable<T>> {
    T value;
}
```
这意味着：T 必须既是 `Number`，又能比较大小。一个 `Integer` 就合格，但常规的 `Object` 就不行。

+ `T` 可以递归约束自己：
```Java {.no-header}
class Node<T extends Node<T>> {
    T next;
}
```
这种“递归类型参数”允许表达复杂的 API，例如链式调用或自类型模式。

+ `T` 也可以是嵌套组合：
```Java {.no-header}
Map<String, List<Set<Integer>>> data;
```

这让我们能把类型系统当作“一种编译期结构描述语言”，捕捉程序中非常复杂的数据形状。

换句话说：`T` 不只是一个“变量”，它是编译器能操作的“类型代数”。

幸运的是，Java的类型系统并没有你想象中的强大，开发 Minecraft 的 Mod 也不会用到复杂的类型体操，这就允许我们只对 Java 的泛型略有涉猎，而不需要像别的一些语言一样学习各种有关类型的奇技淫巧。

让我们开始吧！

## 泛型的基本用法

### 从 `Box<T>` 开始：泛型类与泛型方法

想象我们要写一个“容器”，能保存任意类型的对象。

如果不用泛型，只能这样写：
```Java {.no-header}
class ObjectBox {
    private Object value;
    public void set(Object value) { this.value = value; }
    public Object get() { return value; }
}
```

但这样会有强转和运行时错误风险。

于是我们引入泛型类：
```Java {.no-header}
class Box<T> {
    private T value; // 字段约束：value 类型必须是 T
    public void set(T value) { this.value = value; } // 方法参数约束：只能传入 T 类型
    public T get() { return value; } // 返回值约束：返回类型就是 T
}
```

使用时：
```Java {.no-header}
Box<String> stringBox = new Box<>();
stringBox.set("hello");
String s = stringBox.get();
```

这里的 `<T>` 就是一个“类型占位符”，代表 `Box` 的形状可以装不同类型。

> [!IMPORTANT] 类型擦除
>
> 当你写 `Box<String> stringBox = new Box<>();` 时，编译器会把这个`stringBox`（也就是`b`） 的 `T` 确定为 `String`。
>
> `stringBox` 的 `value` 都被编译器认为是 `String`。
>
> `stringBox` 的 `set` 方法只能接受 `String` 参数。
>
> `stringBox` 的 `get` 方法返回的类型是 `String`。
>
> 因此编译器在这一刻就完成了类型检查：
> ```Java {.no-header}
> stringBox.set(42); // 编译错误，T 已经被确定为 String
> String s = stringBox.get(); // 无需转换
> ```
> `T` 不是运行时类型
>
> 同理，由于 Java 泛型采用类型擦除，所以运行时 `Box<String>` 和 `Box<Integer>` 都是同一个 `Box` 类。（但是泛型信息会保存在字节码的签名中（反射可获取，我们在之后会讲到），只是在实际操作时类型被擦除）


现在你不满意了，很多 Java 自带的容器都提供静态方法 `of()` 来创建容器，你也想写一个：
```Java {.no-header}
class Box<T> {
    private T value;
    public void set(T value) { this.value = value; }
    public T get() { return value; }

    public static Box<T> of(T value) {
        Box<T> b =  new Box<>();
        b.set(value);
        return b;
    }
}
```

不幸的是，满篇报错。语法分析器提示：无法从 `static` 上下文引用 `'Box.this'`

> [!IMPORTANT] 
> 类的泛型 `<T>` 只属于实例，静态成员或静态方法不能直接用类的类型参数。

在这里，我们必须为静态方法重新声明一个泛型（也就是在返回类型之前）：

```Java {.no-header}
public static <U> Box<U> of(U value) {
    Box<U> b = new Box<>();
    b.set(value);
    return b;
}
```

为什么要换成 `U` 呢？

当然，这里的 `U` 可以换成 `T`，但你必须明白，静态方法中的泛型参数和类**没有任何**关系，不同静态方法的泛型参数之间也**没有任何**关系。

### 扩展：多参数的 `Pair<K,V>`

有时候我们需要表达两个相关的值，比如“键值对”。
这时就需要多个类型参数：
```Java {.no-header}
class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() { return key; }
    public V getValue() { return value; }
}
```

使用：
```Java {.no-header}
Pair<String, Integer> age = new Pair<>("Alice", 18);
String name = age.getKey(); // Alice
Integer years = age.getValue(); // 18
``` 
这就是泛型抽象的威力：我们能写一次 `Pair`，然后对任何类型组合都能复用。

### 实践：`Builder<T>` 与链式调用


在 NeoForge 里，我们要创建各种有序合成配方。
每个配方有很多属性：
+ 所属类别（`RecipeCategory`）
+ 产出物（`Item` 或 `ItemStack`）
+ 图案行（`rows`）
+ 图案符号对应的材料（`key`）
+ 解锁条件（`criteria`）
+ ……

为了得到一个配方，我们可能会写一个巨大的构造函数：
``` Java {.no-header}
ShapedRecipe recipe = new ShapedRecipe(
    category, resultStack, rows, key, criteria, group, showNotification
);
```

问题很明显：
+ 参数太多，容易搞错顺序；
+ 大部分参数是可选的，必须传 null 或默认值
+ 可读性差，不容易理解“我想要的配方长什么；样”。
---

Builder 模式让我们分步构建对象，链式调用明确地表达意图：

```Java {.no-header}
ShapedRecipeBuilder.shaped(category, result)
    .define('A', Items.IRON_INGOT)
    .define('B', Items.STICK)
    .pattern("AAA")
    .pattern(" B ")
    .unlockedBy("has_iron", RecipeUnlockedTrigger.unlocked(id))
    .showNotification(true)
    .save(recipeOutput, id);
```

好处：
+ 可读性强：每一步都写明了“我想做什么”。
+ 安全性高：每次调用都返回同类型的 Builder（`ShapedRecipeBuilder`），保证链式调用中类型不丢失。
+ 灵活性大：可选参数、默认值、校验逻辑都可以放在 Builder 内部，不污染外部代码。

应该怎么构造出这个 Builder 呢？

让我们从分析 Builder 的行为逻辑开始，Builder 至少有两类方法：
+ **设置/修改内部状态的方法**：分步收集信息，并返回 Builder 本身以支持链式调用。
	+ 每个方法只做一件事（添加 `key`、设置 `pattern`、指定解锁条件等）
	+ 返回值是 Builder 自身类型（保证链式调用）
	+ 可以做内部校验（防止重复定义、非法参数）
+ **最终构建/输出方法**：根据已经收集的状态生成最终对象（例如 `ShapedRecipe`），或者提交结果（如保存到 `RecipeOutput`）。
	+ 不再返回 Builder，而是返回构建完成的对象或 `void`
	+ 会进行最终验证（确保必填字段已设置）
	+ 是 Builder 的“终点”，标志着构建完成

这很简单，但好像没有用到泛型。没关系，这只是一个具体的 Builder，但我们可以为 Builder 再次抽象，成为一个可以构造任何对象的构造器。
```Java {.no-header}
class Builder<T> {
    private final T value;

    public Builder(T value) { this.value = value; }

    public Builder<T> with(Consumer<T> modifier) {
        modifier.accept(value); // 修改 value 绑定的对象（不论怎么修改，value始终绑定它）
        return this;            // 返回自身，保证链式调用
    }

    public T build() { return value; }
}
```

这样，我们就可以不使用 NeoForge 提供的 Builder 了（好像有什么大病😳）：
```Java {.no-header}
ShapedRecipe recipe = new Builder<>(new ShapedRecipe(...))
    .with(r -> r.setPattern("AAA"))
    .with(r -> r.setKey('A', Items.IRON_INGOT))
    .with(r -> r.setKey('B', Items.STICK))
    .build();
```

## 泛型约束

### 上界类型约束

上界 `<T extends U>` 限定类型参数必须是 `U` 的子类型（或 `U` 本身），可以安全地调用 `U` 的方法。
```Java {.no-header}
class NumericBox<T extends Number> {
    private T value;
    public NumericBox(T value) { this.value = value; }
    public double doubleValue() { return value.doubleValue(); } // 安全
}
```

当需要多个约束时，Java 允许写多个接口或类（类必须放在第一位）：
```Java {.no-header}
class SortedBox<T extends Number & Comparable<T>> {
    private T value;
    public SortedBox(T value) { this.value = value; }
    public boolean isGreaterThan(T other) {
        return value.compareTo(other) > 0;
    }
}
```

> [!NOTE] 上界的使用场景
> 由于上界表明了某个类型**至少**拥有哪些性质，它尤其适合产生对象（例如某个函数的返回类型）、调用对象的地方
> 
> 例如：
> ```Java {.no-header}
> public static <T extends Number> double sum(List<T> numbers {
>    double total = 0;
>    for (T n : numbers) total += n.doubleValue();
>    return total;
> }
> ```

### 下界类型参数

下界 `<U, T extends U>` 限定类型是 `T` 的父类型（或 `T` 本身），可以安全地将 `T` 写入到 `U` 类型的容器中：

```Java {.no-header}
public static <T, U extends T> void copyElements(List<U> src, List<T> dest) {
    for (U item : src) dest.add(item);
}
```

（😦）怎么这么别扭呢？

由于我们并没有访问任何与 `U` 有关的独有的方法，而只是把 `U` 装进了 `U` 的某个子类型里，因此我们并不需要显式写出 `U` 来：

`? super T`：指**某个未知的** `T` 的父类型（包括`T`本身）

这里的 `?` 就是类型通配符。

### 通配符

+ 上界通配符 `<? extends T>`
+ 下界通配符 `<? super T>`
+ 无界通配符 `<?>`：
```Java {.no-header}
void printList(List<?> list) {
    for (Object o : list) System.out.println(o);
}
```

既然没有界限，那不就是任何类型嘛！

> [!ERROR] 别把 `<?>` 当 `Object`
> + `<?>`：某个未知的对象（写入安全）
> + `Object`：任何对象（读取安全）
> 
> 让我们来看一个具体的例子：
>  ```Java {.no-header}
> List<Object> objs = new ArrayList<>();
> objs.add("hello");
> objs.add(42);
> List<String> strings = List.of("a","b");
> // List<Object> objs2 = strings; // 报错！
> ```
> + `List<Object>` 要求：只能放 `Object` 或其子类（其实任何类都是 `Object` 的子类）；
> + 但`List<Object>` 不能接受 `List<String>` 赋值：Java 不允许子类型集合隐式转为父类型集合。
> 
> `<?>`又是怎样的呢？
>
> ```Java {.no-header}
> List<?> unknownList = List.of("a", "b");
> // unknownList.add("x"); // 报错！
> Object obj = unknownList.get(0); // 没有规定上界，Java 只能认为每个元素都是 Object
> List<Integer> iList = List.of(1,2);
> unknownList = iList;
> ```
> + 不能向`List<?>`中写入元素：因为 Java 不知道这个 `List` 是什么类型；
> + 由于 `iList` 类型已知，Java可以推断出 `unknownList` 的类型！

### PECS

我们主张：

在产生、读取对象时用`extends`，在写入对象时用`super`，即：

Producer extends T, Consumer super T

---

使用 `Object`（危险）：
```Java {.no-header}
List<String> strings = new ArrayList<>();
strings.add("abc");

// 通过强制转换欺骗编译器
List<Object> objs = (List<Object>)(List<?>)strings;
objs.add(42); // 编译通过

// 运行时取出时崩溃
String s = strings.get(1); // ClassCastException: Integer cannot be cast to String
```

这里 `List<Object>` 允许随便写入，结果破坏了原本 `List<String>` 的类型安全。

---

使用 `? extends`（安全读取）：
```Java {.no-header}
List<String> strings = new ArrayList<>();
strings.add("abc");

List<? extends Object> safe = strings;
// safe.add(42); // 编译错误：不能写入
Object obj = safe.get(0); // 读取安全
```

`? extends` 表示：这是“某个未知的子类型的列表”：
+ 禁止写入，避免破坏 `List<String>` 的约束；
+ 你仍然能读取，结果安全地视为 `Object`。

---

使用 `? super`（安全写入）：
```Java {.no-header}
List<Object> objs = new ArrayList<>();
List<? super String> sink = objs;

sink.add("hello"); // 写入安全
// String s = sink.get(0); // 编译错误：只能保证是 Object
Object o = sink.get(0); // 读取退化为 Object
```

`? super` 表示：这是“某个未知的父类型的列表”：
+ 可以安全写入 `String`；
+ 读取时编译器只保证是 `Object`。

## 类型推导与退化

Java 编译器会尝试根据**方法的参数**和**调用时需要的返回类型**来推导类型参数：

```Java {.no-header}
public static <T> T pickFirst(T a, T b) {
    return a != null ? a : b;
}

var s = pickFirst("hello", "world"); // T 被推导为 String
Double i = pickFirst(1, 2); // T 被推导为 Double
```

当方法中出现了上下界时，编译器会尝试把调用时的实参代入这些边界，解一个不等式约束：
```Java {.no-header}
public static <T> void copyAll(List<? extends T> src, List<? super T> dst) {
    for (T item : src) dst.add(item);
}
```

+ `src` 给出 上界约束：`T` 至少是元素类型的父类
+ `dst` 给出 下界约束：`T` 至多是目标容器的子类

推导成功的情况：
```Java {.no-header}
List<Integer> src = List.of(1, 2, 3);
List<Number> dst = new ArrayList<>();
copyAll(src, dst); // 成功！推导 T = Integer
```

+ `src` 是 `List<? extends T>`，因此 `T` 必须是 `Integer` 或其父类；
+ `dst` 是 `List<? super T>`，因此 `T` 必须是 `Number` 或其子类。

交集： T = `Integer` → 成功。

但有时，推导会不尽如人意。

### 上下界冲突
```Java {.no-header}
List<Integer> src = List.of(1, 2, 3);
List<String> dst = new ArrayList<>();
copyAll(src, dst); // 编译错误：无法同时满足上下界
```

+ `src` 约束 `T` 是 `Integer` 或父类；
+ `dst` 约束 `T` 是 `String` 或子类。

没有交集 → 无解，编译器直接报错。

### 边界信息不足
```Java {.no-header}
public static <T> T first(List<? extends T> list) { return list.get(0); }
var y = first(List.of()); 
// List.of() 空集合 → 编译器无法确定元素类型
// T 退化为 Object
```

```Java {.no-header}
public static <T> T pick(T a, T b) { return a; }
var x = pick("hello", 123);
// 推导失败：T 同时要是 String 和 Integer

/* 
T 退化为 String 和 Integer 的最具体的公共超类型：
java.io.Serializable 
& Comparable<? extends java.io.Serializable & Comparable<?> & java.lang.constant.Constable & java.lang.constant.ConstantDesc> 
& java.lang.constant.Constable
& java.lang.constant.ConstantDesc

*/
```

### 链式调用

```Java {.no-header}
class Box<T> {
    T value;

    Box(T value) { this.value = value; }

    public Box<T> returnThis() { return this; }

    public static <T> Box<T> newBox() { return new Box<>(null); }

    public static <T> Box<T> handleBox() {
        return newBox().returnThis(); // 报错：必需类型: Box<T>，已提供: Box<Object>
    }
}
```

为什么报错呢？让我们分析调用链：
+ 第一步：`newBox()`
    + `newBox()` 是静态泛型方法
    + 它的 `<T>` 是 方法自身的类型参数，只在 `newBox()` 内部有效，我们暂且叫它 `<T_new>`
    + 它与 `handleBox()` 的 `<T>` 没有任何关联
+ 第二步：`returnThis()`
    + `returnThis()` 是实例方法
    + 它的 `<T>` 与所属的实例相同
+ 当我们调用 `newBox().returnThis()`：
    + `newBox()` 返回 `Box<T_new>`，Java必须对 `<T_new>` 进行类型推导
    + 然而，Java 只会尝试从**参数**和**调用时的上下文**推断出 `<T_new>`，这里没有对 `<T_new>` 进行约束，因此会退化为 `Object`
    + 一个 `Box<Object>` 对象调用 `returnThis()`，返回 `Box<Object>`
    + 此时，然而，Java **不会**从返回值类型推导 `<T>`，因此无法确定 `handleBox` 中 `<T>` 的类型，报错。

怎么解决呢？我们应该关注泛型退化的地方：`newBox()`。

必须明确指明 `static <T> Box<T> newBox()` 中的 `<T>` 和 `static <T> Box<T> handleBox()` 中的 `<T>` 是同一个类型：

```Java {.no-header}
public static <T> Box<T> handleBox() {
    return Box.<T>newBox().returnThis();
}
```

或者，从调用时的上下文指定：
```Java {.no-header}
public static <T> Box<T> handleBox() {
    Box<T> b = newBox();
    return b.returnThis();
}
```

这样，Java 就能推导出 `<T>` 的类型，并解决类型冲突。

## 泛型的高级用法

### 泛型数组

Java 不允许创建泛型数组：
```Java {.no-header}
T[] arr = new T[10]; // 错误：类型形参 'T' 不能直接实例化
```

本节完。

当然没完！让我们来看看为什么 Java 不允许创建泛型数组。

假设有类继承关系：
```Java {.no-header}
class Animal {}
class Dog extends Animal {}
```

子类 `Dog`是父类 `Animal` 的子类型，记作：`Dog` <: `Animal`

在“类型构造器”（容器类型，如数组或泛型类）中，子类型关系可能会传递，也可能不传递，这就是协变、逆变和不变：
+ 如果 `Dog` <: `Animal`，而容器 `C<Dog>` <: `C<Animal>`，则容器是**协变**的，在 Java 中，数组就是协变的；
+ 如果 `Dog` <: `Animal`，而容器 `C<Animal>` <: `C<Dog>`，则容器是**逆变**的，在 Java 中，泛型可以通过 `? super T` 实现逆变；
+ 即使 `Dog` <: `Animal`，但容器 `C<Dog>` 与 `C<Animal>` 没有继承关系，则容器是**不变**的，泛型默认就是不变的。
```Java {.no-header}
// 数组协变
Animal[] animals = new Dog[10]; // 协变：Dog[] 可赋给 Animal[]
animals[0] = new Dog();          // 安全
animals[1] = new Animal();       // 运行时异常：ArrayStoreException

// 泛型通过通配符实现逆变
List<? super Dog> list = new ArrayList<Animal>();
list.add(new Dog());   // 安全写入
Object obj = list.get(0); // 读取只能当作 Object

// 泛型不变
List<Dog> dogs = new ArrayList<>();
// List<Animal> animals = dogs; // 编译错误
```

对于数组，在运行时能保留类型信息，假如我们试图将 `Animal` 放入 `Dog` 数组，Java 会进行运行时检查，并抛出异常 `ArrayStoreException`。因此，数组协变不会影响类型安全。

但假设泛型协变，编译器就会允许我们把 `List<Dog>` 当作 `List<Animal>` 来使用，但泛型在运行时被类型擦除：编译器只知道这是一个 `List`，不知道它里面到底有什么，无法进行类型检查，就可能向其中添加非 `Dog` 类型的元素。因此，泛型是不变的，否则就不能保证类型安全。

假设有这样一个泛型类：
```Java {.no-header}
class Box<T> {
    T[] arr = new T[10]; // 编译错误
}
```
由于数组协变要求运行时知道具体类型，才能进行类型检查，但 `T` 是未知类型，编译器无法生成一个运行时可知类型的数组，所以 `new T[10]` 会报错。

既然无法创建泛型数组，那我们就只能用 `Object[]` 来代替了，这是合法的，因为 `Object` 在运行时是具体类型。然后强制类型转换，告诉编译器“它只会存放 `T` 类型的元素”，这是不安全的，因此我们需要忽略编译器的 `unchecked` 警告。

于是，经过深思熟虑，我们终于写出了泛型数组：
```Java {.no-header}
@SuppressWarnings("unchecked")
T[] arr = (T[]) new Object[10];
```

> [!QUESTION]
> 想想看，怎样使用它会抛出 `ClassCastException`？

### 自限定类型

在遥远的过去，我们曾经设计了一个通用的 `Builder` 类，它可以用来创建各种复杂的对象：
```Java {.no-header}
class Builder<T> {
    private final T value;

    public Builder(T value) { this.value = value; }

    public Builder<T> with(Consumer<T> modifier) {
        modifier.accept(value); // 修改 value 绑定的对象（不论怎么修改，value始终绑定它）
        return this;            // 返回自身，保证链式调用
    }

    public T build() { return value; }
}
```

它真的通用吗？让我们来试试扩展这个 `Builder` 以添加新的方法：

```Java {.no-header}
record Item (String name) {}

class ShapedRecipe {
    Map<Character, Item> ingredients = new HashMap<>();
    List<String> pattern = new ArrayList<>();
    private String group;
    
    void mapSymbol(char symbol, Item item) { ingredients.put(symbol, item); }
    void addPattern(String line) { pattern.add(line); }
    void setGroup(String group) { this.group = group; }
}

class Builder<T> {
    protected final T value;

    public Builder(T value) { this.value = value; }

    public T build() { return value; }

    public Builder<T> with(Consumer<T> modifier) {
        modifier.accept(value);
        return this;
    }
}

class ShapedRecipeBuilder extends Builder<ShapedRecipe> {
    public ShapedRecipeBuilder(ShapedRecipe value) { super(value); }

    public ShapedRecipeBuilder define(char symbol, Item item) {
        value.mapSymbol(symbol, item);
        return this;
    }

    public ShapedRecipeBuilder pattern(String line) {
        value.addPattern(line);
        return this;
    }
}
```
现在，当我们链式调用的时候，就出现问题了：

```Java {.no-header}
ShapedRecipe recipe = new ShapedRecipeBuilder(new ShapedRecipe())
    .define('A', new Item("Apple"))
    .with(r -> r.setGroup("tools"))
    .pattern("AAA") // 报错：找不到方法调用 xxx.pattern("AAA") 的候选者。
    .build();
```

为什么呢？
+ `with` 方法在父类 `Builder` 中明确声明返回 `Builder<T>`，在这里是 `Builder<ShapedRecipe>`
+ 链式调用返回父类类型，失去子类方法
+ 再调用 `define()` 或 `pattern()` 时无法继续链式调用

让我们尝试修复这个问题。

在直觉上，我们知道，肯定是 `with()` 方法的返回类型“写死了”，我们需要修改它：

```Java {.no-header}
public SELF with(Consumer<T> modifier) {
    modifier.accept(value);
    return (SELF) this; // this 实际运行时是子类，但编译器只知道它的静态类型是父类 Builder，必须强制转换类型
}
```

这里的 `SELF` 是这个 `Builder` 的精确类型，即 `Builder` 或者它的某个子类，也就是 `<SELF extends Builder<T>>`。

换句话说，`builder` 将需要 `T` 和 `SELF` 两个泛型：`class Builder<T, SELF>`，由此对 `SELF` 的定义也需要调整：

```Java {.no-header}
class Builder<T, SELF extends Builder<T, SELF>>
```

这样，我们就可以写出支持链式调用的更高级的 `Builder`：

```Java {.no-header}
class Builder<T, SELF extends Builder<T, SELF>> {
    protected final T value;

    public Builder(T value) { this.value = value; }

    @SuppressWarnings("unchecked")
    public SELF with(Consumer<T> modifier) {
        modifier.accept(value);
        return (SELF) this;
    }

    public T build() { return value; }
}

class ShapedRecipeBuilder extends Builder<ShapedRecipe, ShapedRecipeBuilder> { ... }
```

这就是自限定类型，其目的是在继承层级中保持链式调用的类型安全。