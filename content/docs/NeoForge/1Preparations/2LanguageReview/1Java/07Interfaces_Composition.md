---
title: "接口与组合"
subtitle: ""
date: 2025-09-03T16:00:50+08:00
categories:
weight: 70
description: ""
keywords: ""
draft: true
author: {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://i.ooxx.ooo/i/ZGM0M.jpg"}
---

在上一节，我们学习了继承和抽象类，它让我们可以复用父类的字段和方法，并通过覆盖实现不同的行为。

然而，在实际的 Minecraft 开发中，我们会发现：

+ 并非所有实体都拥有相同的能力；
+ 一个实体可能同时具有多种行为，例如玩家可以移动、攻击、使用物品；鸟可以飞、叫；雪球可以被投掷、消失；
+ 如果仅依靠继承来描述能力，很容易出现不合理的层级（例如企鹅不能飞，却继承了鸟的 `fly()` 方法）。

这时，我们需要一种更灵活的方式来表达“对象能做什么”，而不去限定它“是什么”。这就是接口。

## 基本语法

让我们来分析这样一个例子：在 Minecraft 的世界中，有很多方块都可以变成“含水方块”，这时你就会想到，为这些含水方块定义一个接口，专门用于处理含水的相关的操作。

```Java {.no-header}
public
```

等等！真的是这样吗？在开始写之前，让我们仔细想想：
+ 石头台阶：可以被水填满，也可以被桶舀出水来；
+ 海草：只能生活在水里，但你不能用桶把水从海草身上舀出来
+ 细雪：可以用桶装走，但它本身并不是水，更不能放水进去。

我们发现，看似统一的逻辑实际上能被拆解为两个独立的子逻辑：
```Java {.no-header}
// 能被桶舀
interface BucketPickup {
    String pickupBlock(boolean waterlogged);
    String getPickupSound();
}

// 能被液体填充
interface LiquidBlockContainer {
    boolean canPlaceLiquid(String fluid);
    boolean placeLiquid(String fluid);
}
```

> [!IMPORTANT]
> 在编程的世界中，具有这样的洞察力是很重要的。

+ 接口使用 `interface` 关键字声明。
+ 接口中的方法默认是 `public abstract`，所以可以省略修饰符。
+ 接口不能直接保存字段，但可以定义常量、抽象方法、默认方法和静态方法。

接口和类一样可以“继承”，不过它和类的继承不一样，在实质上是一种“组合”关系：

+ 类的继承是 “is-a”：一个 `Cat` 是一个 `Animal`；
+ 接口的继承是 “has-a”：`SimpleWaterloggedBlock` 既能被桶舀，也能被液体填充。

```Java {.no-header}
interface SimpleWaterloggedBlock extends BucketPickup, LiquidBlockContainer { 
    // ...
}
```

在这里，在这里，SimpleWaterloggedBlock 通过继承组合了两种能力：
+ 被桶舀（来自 `BucketPickup`）；
+ 能被液体填充（来自 `LiquidBlockContainer`）。

同时它还利用默认方法（`default`） 提供了一套通用的实现。
在 Java 里，接口本来只能写抽象方法，也就是说：
+ 你定义了方法签名；
+ 但具体实现必须交给每个实现类去写。

这样虽然灵活，但如果几十个类都要实现同样的逻辑，就会出现大量重复代码。

`default` 方法正是为了解决这个问题：
```Java {.no-header}
interface SimpleWaterloggedBlock extends BucketPickup, LiquidBlockContainer { 
    @Override default boolean canPlaceLiquid(String fluid) { 
        // 只允许放水 
        return "water".equals(fluid); 
    }
    // ...
}
```
这表示：
+ 所有实现了 `SimpleWaterloggedBlock` 的类，默认都可以直接复用这段逻辑；
+ 如果某个类需要特殊处理（比如台阶是双层时不能放水），它也可以 覆盖（`override`） 这个方法，自定义实现。

让我们再写几个默认方法！

```Java {data-open=true}
interface SimpleWaterloggedBlock extends BucketPickup, LiquidBlockContainer { 
    @Override default boolean canPlaceLiquid(String fluid) { 
        return "water".equals(fluid); 
    } 
    @Override default boolean placeLiquid(String fluid) { 
        if (canPlaceLiquid(fluid)) { 
            System.out.println("Placed water"); 
            return true; 
        } 
        return false; 
    } 
    @Override default String pickupBlock(boolean waterlogged) { 
        if (waterlogged) {
            System.out.println("Picked up water"); 
            return "water_bucket"; 
        }
        return "empty"; 
    } 
    @Override default String getPickupSound() { 
        return "water_pickup_sound"; 
    } 
}
```

现在，我们可以着手写台阶的类了：

```Java {data-open=true}
// 示例方块类，实现 SimpleWaterloggedBlock
class SlabBlock implements SimpleWaterloggedBlock {

    private boolean waterlogged;
    private boolean isDouble;

    public SlabBlock(boolean waterlogged, boolean isDouble) {
        this.waterlogged = waterlogged;
        this.isDouble = isDouble;
    }

    @Override
    public boolean canPlaceLiquid(String fluid) {
        if (isDouble) return false; // 双层台阶不允许放水
        return SimpleWaterloggedBlock.super.canPlaceLiquid(fluid);
    }

    @Override
    public boolean placeLiquid(String fluid) {
        if (!canPlaceLiquid(fluid)) return false;  // 调用自己的 canPlaceLiquid 方法
        return SimpleWaterloggedBlock.super.placeLiquid(fluid); // 调用接口默认的 placeLiquid 方法
    }

    @Override
    public String pickupBlock(boolean waterlogged) {
        if (this.waterlogged) {
            this.waterlogged = false; // 被桶舀走后变为不含水方块
            return "water_bucket";
        }
        return "empty";
    }
}
```

> [!TIP] super
> 这里的 `SimpleWaterloggedBlock.super.canPlaceLiquid(fluid)` 有点特别。
>
> 我们希望调用接口默认的方法，但是由于一个类可能实现多个接口，所以我们需要用 `接口名.super.方法名` 来指定具体的接口。
>
> 这样，尽管提供了默认实现，但开发者可以在子类中选择：
> + 完全重写（忽略默认行为）；
> + 或者先加点自己的逻辑，再调用默认逻辑。

## 接口多态

接口多态和子类型多态一样，可以允许我们为不同类型的对象执行相同的逻辑。让我们以注册物品模型为例，来看看接口多态的用法。

在 Minecraft 中定义了一个接口：

```Java {.no-header}
public interface ItemLike {
    Item asItem();
}
```
所有的 Item 都会默认实现这个接口。这意味着：不管你拿到的是方块（例如石头），还是直接的物品本体（例如木棍），都能统一转换成 `Item`。

---

由于为物品添加模型的需求太过常见，NeoForge 为你提供了一个默认的 ItemModelProvider：
```Java {data-open=true}
public abstract class ItemModelProvider extends ModelProvider<ItemModelBuilder> {
    public ItemModelProvider(PackOutput output, String modid, ExistingFileHelper existingFileHelper) {
        super(output, modid, ITEM_FOLDER, ItemModelBuilder::new, existingFileHelper);
    }

    public ItemModelBuilder basicItem(Item item) {
        return basicItem(Objects.requireNonNull(BuiltInRegistries.ITEM.getKey(item)));
    }

    public ItemModelBuilder basicItem(ResourceLocation item) {
        return getBuilder(item.toString())
            .parent(new ModelFile.UncheckedModelFile("item/generated"))
            .texture("layer0", ResourceLocation.fromNamespaceAndPath(item.getNamespace(), "item/" + item.getPath()));
    }
}

```
> [!NOTE]
> 这里的 `basicItem()` 内部逻辑比较复杂，但它的本质就是：
>
> 为一个普通物品生成一个标准的“平面贴图”模型。

这个复杂的注册逻辑并非现在的重点，如果我们注册一堆物品，每个都写一次 `basicItem()` 未免太不优雅。

借助接口多态，可以简化：
```Java {.no-header}
public class ModItemModelProvider extends ItemModelProvider {
    public ModItemModelProvider(PackOutput output, String modid, ExistingFileHelper existingFileHelper) {
        super(output, modid, existingFileHelper);
    }

    @Override
    protected void registerModels() {
        ItemsGetter.getItems().map(Supplier::get).map(ItemLike::asItem).forEach(this::basicItem);
    }
}
```
在这里：
+ `Supplier` 里存放了各种各样的物品；
+ 由于 `ItemLike` 接口的存在，我们可以统一调用 `asItem()` 获取 `Item`；
+ 最终，所有物品都能走到 `basicItem()` 注册逻辑中。

---

事情没完，
对于一些复杂物品（如弓），普通逻辑并不够用。它们在普通状态和拉弓状态可能需要不同的材质。

于是我们定义了一个接口：
```Java {.no-header}
public interface ModCustomModel {
    <T extends DataProvider> void registerModel(T provider);
}
```
含义很简单：如果某个物品实现了这个接口，它就要自己决定模型注册的逻辑。

接下来，我们改造 `ModItemModelProvider` 的注册逻辑 `registerModels()`：
```Java {.no-header}
protected void registerModels() {
    ItemsGetter.getItems().map(Supplier::get).map(ItemLike::asItem).forEach(modItem -> {
        if (modItem instanceof ModCustomModel customItem) customItem.registerModel(this);
        else basicItem(modItem); // 默认走 basicItem
    });
}
```
在这里，`modItem` 变量可能是普通物品，也可能是实现了 `ModCustomModel` 的特殊物品，我们用 `instanceof` 判断；
+ 对普通物品：调用 `basicItem()`；
+ 对自定义物品：调用它的 `registerModel()`。

## 函数式接口

在前面的学习中，我们已经用过一些能和 `Lambda` 搭配的“函数类型”，比如：
``` Java {.no-header}
Runnable task = () -> System.out.println("执行任务！");
Comparator<String> cmp = (a, b) -> a.length() - b.length();
```

当时我们只是知道：
+ `Runnable` 可以用 Lambda 写；
+ `Comparator` 也可以用 Lambda 写。

让我们翻开 `Runnable` 的定义：
```Java {.no-header}
@FunctionalInterface
public interface Runnable {
    void run();
}
```
再看 `Comparator` 的定义：
```Java {.no-header}
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
    // 还有一些 default 方法，比如 reversed()，但只有一个抽象方法
}
```
这是一个接口！

> [!QUESTION] 思考
> 你能从这两个接口里观察出什么规律吗？
>
> 为什么 `Runnable` 和 `Comparator` 能用 Lambda 赋值，而 Damageable 不能？

---

只有“恰好包含一个抽象方法”的接口，才能用 Lambda 来实现，这种接口被称为**函数式接口**。

让我们自己写一个函数式接口。
为了避免写错，Java 提供了 `@FunctionalInterface` 注解（这不是必需的）：如果你在接口里写了两个抽象方法，编译器就会报错。

```Java {.no-header}
@FunctionalInterface
interface BlockUpdateHandler {
    void onUpdate(int x, int y, int z);
}
```

用法就非常直观了：
```Java {.no-header}
public class Main {
    public static void main(String[] args) {
        BlockUpdateHandler handler = (x, y, z) -> 
            System.out.println("方块在 (" + x + "," + y + "," + z + ") 更新了！");
        handler.onUpdate(10, 64, -5);
    }
}
```

这样，我们进一步地扩展了 Lambda 表达式的适用范围。现在，我们能够轻松使用有多个参数和返回值的 Lambda 函数！