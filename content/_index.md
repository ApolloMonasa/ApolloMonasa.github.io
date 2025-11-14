---
# title: "欢迎来到我的网站"  # 这个 title 会显示在浏览器标签页上
# 你可以为首页设置一个特殊的布局模板
layout: "homepage" 

---

## 关于博客
其实自大一开始就想做一个像这样的网站，但是限于能力和见识，我不认为那时有能力把这样一个网站做好。
进入大二，在[wmsnp](https://github.com/wmsnp)的鼓励下，开始决定搭建这样一个网站，或许有些人是为了找工作而向github上塞各种东西，但我只是一种兴趣，我希望是因为兴趣而把一件事做好，而不是因为一件事做得很好而产生兴趣，我也没有这样的能力，如果那样，兴趣将毫无意义。

## 近期规划

### 2025下半年

```mermaid
gantt
    title 个人时间安排
    dateFormat YYYY-MM-DD
    section 学术科研
    论文阅读    :active, acad1, 2025-10-17,2d
    类脑计算低功耗睡眠分期    :active, acad2, after acad1,4d
    section 生活娱乐
    黄山行      :   p1, 2025-10-30, 4d
    section 竞赛
    OceanBase数据库大赛初赛    :crit, cont1, 2025-10-20,24d
    OceanBase数据库大赛决赛    :crit, cont2, 2025-11-19,34d
    OceanBase数据库大赛答辩    :crit, cont3, 2026-1-1,1d
    华为ICT大赛校赛    :crit, cont4, 2025-11-9,1d
    华为ICT大赛省初赛    :crit, cont5, 2025-11-15,2d
    华为ICT大赛省复赛    :crit, cont6, 2026-3-1,4w
    华为ICT大赛中国总决赛    :crit, cont6, 2026-5-1,4w
```

```mermaid
graph LR
    subgraph 主流程
        A[开始] --> B{输入 n};
        B --> C[创建两个<br>JosephRing];
        C --> D[测试 simulate1];
        D --> E[测试 simulate2];
        E --> F[结束];
    end

    subgraph simulate 核心逻辑
        S_Start[开始 simulate] --> S_Check{环是否为空?};
        S_Check -- 是 --> S_Err[打印错误];
        S_Check -- 否 --> S_Print_Init[打印初始状态];
        
        S_Print_Init --> S_Loop_Cond{循环:<br>size > 0?};
        S_Loop_Cond -- 是 --> S_Calc_m[1. 计算步数 m];
        
        S_Calc_m --> S_Find_Node{2. 寻找淘汰节点};
        subgraph " "
            direction TB
            S_Find_Node -- simulate1 --> S_Find_1[单向查找];
            S_Find_Node -- simulate2 --> S_Decision{双向优化?};
            S_Decision -- 是 --> S_Find_2_Fwd[正向短路查找];
            S_Decision -- 否 --> S_Find_2_Bwd[反向短路查找];
        end

        S_Find_1 --> S_Eliminate;
        S_Find_2_Fwd --> S_Eliminate;
        S_Find_2_Bwd --> S_Eliminate;
        
        S_Eliminate[3. 执行淘汰<br>打印ID, 移除节点<br>更新cur, size--];
        S_Eliminate --> S_Loop_Cond;

        S_Loop_Cond -- 否 --> S_End[结束 simulate];
    end
```



```mermaid
graph TD;
    A[约瑟夫环模拟程序]
    B[主模块 main]
    C[JosephRing 核心类]
    D[链表操作子模块]
    E[算法实现子模块]
    
    A --> B 
    A --> C 
    C --> D 
    C --> E
    
    D --> initRing[初始化双向循环链表]
    D --> JosephRing[析构函数释放内存]
    E --> simulate1[基础遍历算法]
    E --> simulate2[双向优化遍历算法]

```


---



