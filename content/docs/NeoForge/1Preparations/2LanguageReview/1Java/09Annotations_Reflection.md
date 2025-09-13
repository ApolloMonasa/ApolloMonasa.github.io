---
title: "注解与反射"
subtitle: ""
date: 2025-09-03T16:10:20+08:00
categories:
weight: 90
description: ""
keywords: ""
draft: true
author: {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://i.ooxx.ooo/i/ZGM0M.jpg"}
---

在 Java 里，“万物皆对象”，哪怕是基本类型，也提供了对应的包装类用于构造相应的对象。为此，我们的每个 Java 文件几乎都会从写一个类开始：

```java {.no-header}
public class MyClass {
    //...
}
```

但你想过没有，既然是“万物皆对象”，不仅我们创建的实例是对象，这些类本身也有对应的对象，这个对象就是 Class 类的实例。

换句话说：

每个类，不管是 Java 中的 `Object`、`String`，还是你自己写的 `ModBlock`、`MyItem`，在程序运行时都会被加载成一个 Class 对象。

通过这个 Class 对象，你就可以在运行时了解这个类的信息，甚至创建它的实例、访问它的字段、调用它的方法。

这就是反射与注解的基础。

## 反射

理解反射，必须先知道类是怎么“变成对象”的。Java 的运行时会有一个类加载器，它负责把 `.class` 字节码文件加载到内存，并创建对应的 Class 对象。

当你执行 `new MyClass()` 时，JVM 会首先检查是否有这个类，如果没有：
+ 类加载器读取字节码文件，把它变成内存中的二进制数据，生成对应的 Class 对象（这个对象里记录了 `MyClass` 的所有信息）
+ 根据生成的 Class 对象，创建 `MyClass` 的实例对象

既然 `Class` 类是对所有类进行抽象，那么我们自然可以根据对类的性质的理解，来猜测这个 `Class` 类怎么使用：
+ 获取类的基本信息（名字、父类、实现的接口）
+ 获取字段、方法、构造器等成员信息
+ 动态创建该类的实例
+ 调用方法、访问字段，甚至可以操作私有成员
+ ……

让我们从获取到类对象开始。

### 获取类对象

+ 通过类名字面量
    ```Java {.no-header}
    Class<?> clazz = MyClass.class;`
    ```
+ 通过对象实例
    ```Java {.no-header}
    MyClass obj = new MyClass();
    Class<?> clazz = obj.getClass();
    ```
+ 通过类加载器
    ```Java {.no-header}
    Class<?> clazz = Class.forName("com.example.MyClass");
    ```

| 方式 | 编译时确定 | 触发类加载 | 常见用途 |
| :---: | :---: | :---: | :---: |
| `MyClass.class` | 是 | 否 | 静态、安全，编译时已知的类 |
| `obj.getClass()` | 否 | 否 | 动态、安全，运行时创建的对象 |
| `Class.forName("com.example.MyClass")` | 否 | 是 | 动态、不安全，运行时创建的类 |

> [!TIP] 加载时不初始化
> ```java {.no-header}
> Class.forName("com.example.MyClass", false, MyClass.class.getClassLoader());
> ```

### 获取类信息

有了 Class 对象之后，我们就能探索这个类的各种信息。
Java 的 Class 提供了大量方法，让我们能查询类的结构：类名、父类、接口、字段、方法、构造器……

我们按从简单到复杂的顺序来看。

+ 类的基本信息
    + `getName()`：完整类名（含包名）
    + `getSimpleName()`：简单类名（不含包名）
    + `getSuperclass()`：父类的 Class 对象
    + `getInterfaces()`：实现的接口数组
+ 类的成员信息：其中，带 `Declared` 的方法可以获取私有字段
    + 字段：
        + `getFields()`、`getDeclaredFields()`
        + `getField(String name)`、`getDeclaredField(String name)`
    + 方法：由于 Java 允许重载，所以方法名相同但参数不同的方法可以有多个，因此需要配合参数类型一起使用
        + `getMethods()`、`getDeclaredMethods()`
        + `getMethod(String name, Class<?>... parameterTypes)`、`getDeclaredMethod(String name, Class<?>... parameterTypes)`
    + 构造器：
        + `getConstructors()`、`getDeclaredConstructors()`
        + `getConstructor(Class<?>... parameterTypes)`、`getDeclaredConstructor(Class<?>... parameterTypes)`

### 动态操作

让我们先写一个简单的类：

```java {.no-header}
class Sample {
    private String text = "default"; // 私有字段
    public int number = 42; // 公共字段
    public static String tag = "static field"; // 静态字段

    public Sample() {} // 公共无参构造器

    private Sample(String text) {   // 私有构造器
        this.text = text;
    }

    private void privateMethod(String prefix) { // 私有方法
        System.out.println(prefix + ": " + text);
    }

    public static void staticMethod() { // 静态方法
        System.out.println("Static method called");
    }

    public int add(int a, int b) { // 普通方法
        return a + b;
    }
}
```

对于字段：

```java {.no-header}
import java.lang.reflect.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Class<?> cls = Sample.class;
        Sample obj = new Sample();

        // 1. 获取字段对象
        Field textField = cls.getDeclaredField("text");
        Field numberField = cls.getField("number");
        Field tagField = cls.getDeclaredField("tag");

        // 2. 打印字段信息
        System.out.println("字段名: " + textField.getName());
        System.out.println("字段类型: " + textField.getType());

        // 3. 修改私有字段
        textField.setAccessible(true);
        textField.set(obj, "changed");
        System.out.println("修改后 text = " + textField.get(obj));

        // 4. 修改公共字段
        numberField.set(obj, 99);
        System.out.println("修改后 number = " + numberField.getInt(obj));

        // 5. 修改静态字段（obj 参数传 null）
        tagField.set(null, "modified static");
        System.out.println("修改后 tag = " + Sample.tag);
    }
}
```

对于方法：

```java {.no-header}
import java.lang.reflect.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Class<?> cls = Sample.class;
        Sample obj = new Sample();

        // 1. 调用普通方法
        Method addMethod = cls.getMethod("add", int.class, int.class);
        int result = (int) addMethod.invoke(obj, 3, 4);
        System.out.println("add(3,4) = " + result);

        // 2. 调用私有方法
        Method privateMethod = cls.getDeclaredMethod("privateMethod", String.class);
        privateMethod.setAccessible(true);
        privateMethod.invoke(obj, "Hello");

        // 3. 调用静态方法
        Method staticMethod = cls.getMethod("staticMethod");
        staticMethod.invoke(null); // static 方法传 null
    }
}
```

对于构造器：

```Java {.no-header}
import java.lang.reflect.*;

public class ConstructorDemo {
    public static void main(String[] args) throws Exception {
        Class<?> cls = Sample.class;

        // 1. 调用公共构造器
        Constructor<?> publicCtor = cls.getConstructor();
        Sample obj1 = (Sample) publicCtor.newInstance();

        // 2. 调用私有构造器
        Constructor<?> privateCtor = cls.getDeclaredConstructor(String.class);
        privateCtor.setAccessible(true);
        Sample obj2 = (Sample) privateCtor.newInstance("created via reflection");

        // 打印以验证
        Field textField = cls.getDeclaredField("text");
        textField.setAccessible(true);
        System.out.println("obj2.text = " + textField.get(obj2));
    }
}
```

> [!IMPORTANT]- 太多了吧
> 都说了让你用到的时候问 AI 就行了

### 让我们大胆射起来！

#### 调用一切方法

在实际开发中，尤其是像 NeoForge 这类 Mod 开发，常常需要动态调用方法，甚至在父类中查找方法、调用 private 方法。

我们来拆解一下需求：
+ 查找父类方法 -> 递归查找，直到找到或到达 `Object` 类
+ 调用 private 方法 -> 查找到具体方法，再 `setAccessible(true)`
+ 查找动态调用的具体方法 -> 需要根据参数类型、参数数量、参数顺序，找到对应的方法

怎么找到匹配参数的具体方法呢？一个简单的想法是直接调用 `getDeclaredMethod(String name, Class<?>... parameterTypes)`。但事实不总是这么美好：



我们先来实现函数所需参数与提供参数类型的判断。假设参数数量已经匹配：
```Java {.no-header}
private static boolean parametersMatch(Method m, Object[] args) {
    Class<?>[] paramTypes = m.getParameterTypes();
    return IntStream.range(0, args.length)
        .allMatch(i -> args[i] == null || paramTypes[i].isAssignableFrom(args[i].getClass()));
}
```

在这里，对每个参数检查：
+ 如果参数是 `null` → 任意类型可匹配。
+ 否则判断 `args[i].getClass()` 是否可以赋值给方法参数类型（`isAssignableFrom`）。

接着，让我们实现根据某个类或者对象，遍历查找父类，并查找参数匹配的方法：
```Java {.no-header}
private static Method findMethod(Object provider, String methodName, boolean searchSuperClasses, Object[] args) throws NoSuchMethodException {
    // 1. 获取类对象
    Class<?> clazz = provider instanceof Class ? (Class<?>) provider : provider.getClass();

    // 2. 构造类流
    Stream<Class<?>> classStream = !searchSuperClasses ? Stream.of(clazz);
        : Stream.iterate(clazz, Objects::nonNull, Class::getSuperclass)

    // 3. 遍历类方法
    return classStream.flatMap(c -> Stream.of(c.getDeclaredMethods())
        .filter(m -> m.getName().equals(methodName) && m.getParameterCount() == args.length && parametersMatch(m, args)))
        // 4. 找到第一个匹配的方法
        .findFirst().orElseThrow(NoSuchMethodException::new);
}
```

然后，我们通过设置它的可见性，最终实现调用：
```Java {.no-header}
@SuppressWarnings("unchecked")
public static <T> T invoke(Object provider, String name, boolean searchSuperClasses, Object... args) {
    try {
        Method method = findMethod(provider, name, searchSuperClasses, args);
        method.setAccessible(true);
        return (T) method.invoke(provider instanceof Class ? null : provider, args); // 静态方法不用传入实例对象
    } catch (Exception ignored) { return null; }
}
```

#### 扫描包下的所有类

```Java {.no-header}
private static List<Class<?>> findAllClasses(String packageName) {   
    ClassLoader classLoader = Thread.currentThread().getContextClassLoader();  
    // Java 包名用 . 分隔，资源路径用 / 分隔
    URL packageURL = classLoader.getResource(packageName.replace('.', '/'));  
    if (packageURL == null) throw new RuntimeException("找不到包: " + packageName);  
    // Gradle 的资源目录和编译目录不同，路径需要调整，确保能找到 .class 文件
    String pPath = packageURL.getPath().replaceFirst("/build/resources/main/[^/]+", "/build/classes/java/main")
        .replaceAll("%\\d+!", ""); // 过滤 Gradle 添加的某些特殊字符
    // 判断是 Jar 包（使用环境）还是目录（开发环境）
    return pPath.contains(".jar") ? findClasses(packageName, pPath) : findClasses(packageName, Paths.get(pPath.substring(1)));
}
```

我们分别对目录和 Jar 进行查找：
```Java {.no-header}
private static List<Class<?>> findClasses(String packageName, Path packagePath) {
    List<Class<?>> classes = new ArrayList<>();
    try (Stream<Path> paths = Files.walk(packagePath)) {
        paths.filter(Files::isRegularFile).filter(p -> p.toString().endsWith(".class"))
            .map(packagePath::relativize)
            .map(p -> packageName + "." + p.toString().replace(File.separatorChar, '.').replaceAll("\\.class$", ""))
            .forEach(n -> {try { classes.add(Class.forName(n)); } catch (Exception ignored) {}});
    } catch (Exception ignored) {}
    System.out.println("classes: " + classes);
    return classes;
}
```

```Java {.no-header}
private static List<Class<?>> findClasses(String packageName, String packagePath) {
    List<Class<?>> classes = new ArrayList<>();
    String[] parts = packagePath.split("\\.jar");
    try (JarFile jarFile = new JarFile(parts[0] + ".jar")) {
        Collections.list(jarFile.entries()).stream().map(JarEntry::getName)
            .filter(n -> n.startsWith(parts[1].replace('\\', '/').replaceFirst("^/", "")) && n.endsWith(".class"))
            .map(n -> n.replace(".class", "").replace('/', '.'))
            .forEach(n -> {try { classes.add(Class.forName(n)); } catch (Exception ignored) {}});
    } catch (IOException ignored) {}
    return classes;
}
```

#### 扫描包下某个类的所有子类

在 NeoForge 中，尝尝需要将继承抽象类 `Item` 的所有子类进行注册。现在可以很简单地查找子类了：

```Java {.no-header}
public static List<Class<?>> findAllSubclasses(Class<?> baseClass) {
    return findAllClasses(baseClass.getPackage().getName()).stream()
        .filter(c -> baseClass.isAssignableFrom(c) && !c.equals(baseClass) && !c.isInterface() && !Modifier.isAbstract(c.getModifiers()))
        .toList();
}
```

> [!QUESTION]- 并没有万事大吉
> 联系曾经学过的知识，想一想，什么情况下这个获取子类的函数会失效？
> 
> 有没有什么办法可以解决这个问题呢？

### 总结

到处乱射是不好的！不要再射了！

## 注解

注解是一种给代码添加元信息的机制。它不直接改变程序逻辑，但可以被工具、编译器或运行时读取并处理。

Java 有一些内置的你已经见过的常用注解：

+ `@Override`：标记方法覆盖父类方法
+ `@FunctionalInterface`：标记接口为函数式接口
+ `@Deprecated`：标记不推荐使用的元素
+ `@SuppressWarnings("unchecked")`：抑制编译器警告

在本节中，你将学到更多和注解相关的内容：

### 注解的语法

 #### 声明注解
 
 和接口类似，但是带 `@`：
```Java {.no-header}
public @interface MyAnnotation {
    // ...
}
```

有一些注解规定了其他注解的行为：
+ `@Retention`：决定了注解保留到什么时候，例如：
	+ `@Retention(RetentionPolicy.RUNTIME)`：保留到运行时，最常用
	+ `SOURCE`、`CLASS`分别指在源码中、字节码中保留
+ `@Target`：决定了注解可以作用的代码元素例如：
	+ `@Target(ElementType.METHOD)`

你可能已经发现了，这些注解能够让我们在使用时传入一些内容。实际上，注解和接口一样，允许我们定义属性，并可以设置默认值：
```Java {.no-header}
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface MyAnnotation {
    String value() default "默认值";
    int count();
}
```

> [!NOTE] 注解的奇怪语法
> 尽管这些属性的名字后面带有一个括号，但它们确实是属性

#### 使用注解

```Java {.no-header}
@MyAnnotation(value="Hi", count=5)
void test() { }
```

事实上，注解中有一个特殊的属性：`value`，你在传入它时可以省略属性名：

```Java {.no-header}
@MyAnnotation("Hi", count=5)
void test() { }
```

### 获取注解内容

假如你只像刚才那样声明注解、使用注解，那么你将看不到任何效果！

这是因为注解没有任何自带的功能，所有与它有关的行为都源于你在代码的某个地方手动读取它并进行处理。

```Java {.no-header}
Method method = Main.class.getMethod("test");
if (method.isAnnotationPresent(MyAnnotation.class)) {
    MyAnnotation ann = method.getAnnotation(MyAnnotation.class);
    System.out.println(ann.value()); // 输出 Hi
    System.out.println(ann.count()); // 输出 5
}
```

### 实例：自动注册方块标签

在 Minecraft 中，标记一个物品可不可以挖掘，能用什么挖掘工具挖取，这些信息都需要使用标签功能来说明：

```Java {.no-header}
public class ModBlockTagProvider extends BlockTagsProvider {
    public ModBlockTagProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookupProvider, ExistingFileHelper existingFileHelper) {
        super(output, lookupProvider, MagicParsing.MODID, existingFileHelper);
    }

    @Override
    protected void addTags(HolderLookup.@NotNull Provider pProvider) {
        // 手动添加方块到 Tag
        this.tag(BlockTags.MINEABLE_WITH_PICKAXE).add(ModBlocks.MY_CUSTOM_BLOCK.get());
        this.tag(BlockTags.NEEDS_STONE_TOOL).add(ModBlocks.MY_CUSTOM_BLOCK.get());
        // 如果 AnotherBlock 不需要 NEEDS_STONE_TOOL，则不添加
        this.tag(BlockTags.MINEABLE_WITH_PICKAXE).add(ModBlocks.ANOTHER_BLOCK.get());
    }
}
```
然而，明明是叫标签，却要我写这么一长串？这令人难以接受，所以我们需要自动化这个过程。

让我们定义一个注解：

```Java {.no-header}
import net.minecraft.tags.BlockTags;
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface ModTag {
    Class<?> holder() default BlockTags.class;
    String[] tags() default "";
}
```

然后在注册 `Tag` 的方法中这么写：

```Java {.no-header}
protected void addTags(HolderLookup.@NotNull Provider pProvider) {
    ModBlocks.BLOCKS.stream().map(Supplier::get).forEach(block -> 
        Optional.ofNullable(block.getClass().getAnnotation(ModTag.class)).ifPresent(a -> {
            Arrays.stream(a.tags()).forEach(tagName -> {
                try {
                    TagKey<Block> tag = (TagKey<Block>) a.holder().getField(tagName).get(null);
                    this.tag(tag).add((Block) block);
                } catch (Exception ignored) {}
            });
        }));
}
```