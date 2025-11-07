---
title: "SQL学习"
weight: 10
--- 


> SQL(Structed Query Language), 是用来和关系型数据库进行交互的语言。一般来说，SQL语句不区分大小写，但是为了可读性，通常约定将关键字大写，其他小写。

## SQL分类

通常把`SQL`分为三类：
- DDL(Data Definition Language):数据定义语言，如==CREATE、DROP、ALTER、TRUNCATE==[teal]
- DML(Data Manipulation Language):数据操作语言，如==INSERT、UPDATE、DELETE、CALL==[teal]
    - 细分还可以分出一类DQL(Data Query Language):数据查询语言，如==SELECT==[teal]
- DCL(Data Contral Language):数据查询语言，如==GRANT、REVOKE==[teal]

## 常用命令

### 创建数据库
```mysql
CREATE DATABASE test_DB
```
### 创建表
```mysql
USE test_DB
```
```mysql
CREATE TABLE player (
  id INT,
  name VARCHAR(100),
  level INT,
  exp INT,
  gold DECIMAL(10, 2)
);
```
当然，创建表的技巧远不止这些，我们会在这篇文章中间一点的位置列出几乎所有的限制条件设置方法。

### 查看表的结构
```mysql
DESC player;
```
### 修改表的结构
```mysql
ALTER TABLE player MODIFY COLUMN name VARCHAR(200);
ALTER TABLE player RENAME COLUMN name to nick_name;
ALTER TABLE player ADD COLUMN last_login DATETIME;
ALTER TABLE player DROP COLUMN last_login;
```
### 删除表
```mysql
DROP TABLE player;
```
### 表中数据的增删改查

```mysql
INSERT INTO player (id, name, level, exp, gold) VALUES (1, '张三', 1, 1, 1);
INSERT INTO player (id, name, level, exp, gold) VALUES (1, '张三', 1, 1, 1), (2, '李四', 2, 2, 2 );
```
如果`表名`后面的列名和表结构完全一致(顺序也一致)，就可以省略，直接写关键字`VALUE`+值，注意可以同时插入多条数据，逗号分隔即可。

也可以只写出部分列名称，相应的后面的值也只写部分，这样其他值就会使用创建表时设定的默认值来填充，不设置就是`空值`。

---

```mysql
SELECT * FROM player;
SELECT id, name FROM player;
```
注意*代表所有列，如果不想要所有列，就逐一枚举，逗号分隔。
 
---

```mysql
ALTER TABLE player MODIFY level INT DEFAULT 1;

INSERT INTO player (id, name, exp, gold) VALUE (4, '王五', 0, 0);

SELECT * FROM player;
```
这里添加默认值之后就发现省略输入默认值不再为`Null`。

---

```mysql
UPDATE player set level = 2 WHERE name = '张三';
```
这条指令的形式相信读者并不模式，我们在配置的时候就已经接触到了。

> [!NOTE] 那没用`WHERE`子句会怎么样呢？
> 全部修改！

> [!NOTE] 这里的`待修改列`也可以写多个(用逗号隔开)吗？
> 可以的！

---

```mysql
DELETE FROM player WHERE gold = 0;
```
这样的删除语句也是比较简单。
---


## 数据导入导出

好的，我们来详细讲解一下在MySQL中通过命令行进行数据导入和导出的方法。这通常是数据库管理员（DBA）最常用的操作之一，因为它非常灵活、高效，并且易于自动化。

我们将主要使用两个核心的命令行工具：
1.  `mysqldump`: 用于数据**导出**（创建逻辑备份）。
2.  `mysql`: MySQL的客户端程序，用于数据**导入**（恢复备份或加载数据）。

---

### 第一部分：数据导出 (使用 `mysqldump`)

`mysqldump` 是一个MySQL自带的工具，它可以生成一个包含 `CREATE TABLE` 和 `INSERT INTO` 等SQL语句的 `.sql` 文件。这个文件就是数据库的“逻辑备份”，因为它包含了重建数据库所需的所有SQL命令。

#### 1. 基本语法

```bash
mysqldump -u [用户名] -p[密码] [选项] [数据库名] [表名...] > [导出的文件名.sql]
```

**重要安全提示**：
*   **强烈不推荐**直接在 `-p` 后面写密码（如 `-pMyPassword`），因为这会让你的密码在命令历史和进程列表中暴露。
*   **最佳实践**是只使用 `-p`，然后系统会提示你安全地输入密码。

```bash
mysqldump -u [用户名] -p [选项] [数据库名] > [导出的文件名.sql]
# 按回车后会提示输入密码:
# Enter password:
```

#### 2. 常用导出场景示例

假设我们有以下信息：
*   用户名: `root`
*   主机: `localhost` (默认，可省略)
*   数据库名: `mydatabase`

**示例 1：导出整个数据库**

这是最常见的操作，备份一个完整的数据库（包括所有表结构和数据）。

```bash
mysqldump -u root -p mydatabase > mydatabase_backup.sql
```
*   执行后，当前目录下会生成一个 `mydatabase_backup.sql` 文件。

**示例 2：导出数据库中的特定几个表**

如果你只需要备份 `users` 和 `orders` 这两个表。

```bash
mysqldump -u root -p mydatabase users orders > tables_backup.sql
```

**示例 3：仅导出数据库结构（不包含数据）**

这在需要复制数据库结构到另一个环境时非常有用。

```bash
mysqldump -u root -p --no-data mydatabase > mydatabase_schema.sql
```
*   `--no-data` 选项告诉 `mysqldump` 只生成 `CREATE TABLE` 语句，不生成 `INSERT INTO` 语句。

**示例 4：导出所有数据库**

备份服务器上的所有数据库。

```bash
mysqldump -u root -p --all-databases > all_databases_backup.sql
```
*   这个导出的文件会包含 `CREATE DATABASE` 和 `USE` 语句，导入时会更方便。

**示例 5：生产环境推荐的导出命令**

在对线上业务（特别是使用InnoDB存储引擎的）进行备份时，需要考虑数据一致性，并备份存储过程、函数等。

```bash
mysqldump -u root -p \
--single-transaction \
--routines \
--triggers \
--master-data=2 \
mydatabase > mydatabase_prod_backup.sql
```
*   `--single-transaction`: 在导出开始时创建一个事务。这可以保证在导出期间的数据是一致的快照，并且不会锁住表，对线上业务影响最小（仅对InnoDB有效）。
*   `--routines`: 导出存储过程和函数。
*   `--triggers`: 导出触发器。
*   `--master-data=2`: 在备份文件中记录二进制日志（binary log）的位置。这对于设置主从复制（replication）至关重要。

**示例 6：导出并压缩**

为了节省磁盘空间，通常会将导出的SQL文件进行压缩。

```bash
mysqldump -u root -p mydatabase | gzip > mydatabase_backup.sql.gz
```
*   `|` 是管道符，它将 `mysqldump` 的输出直接传递给 `gzip` 命令进行压缩。

---

### 第二部分：数据导入 (使用 `mysql` 客户端)

数据导入就是执行 `mysqldump` 生成的 `.sql` 文件。

#### 1. 基本语法

有两种主要方式。

**方式一：使用重定向符 `<` (最常用)**

```bash
mysql -u [用户名] -p[密码] [目标数据库名] < [要导入的文件名.sql]
```

**方式二：登录后使用 `source` 命令**

```bash
# 1. 登录MySQL客户端
mysql -u [用户名] -p

# 2. 选择数据库
mysql> USE [目标数据库名];

# 3. 执行source命令
mysql> source /完整路径/文件名.sql;
```

#### 2. 常用导入场景示例

**前提条件：**
在导入数据之前，目标数据库通常需要**已经存在**。如果不存在，你需要先手动创建它。

```sql
-- 在MySQL中执行
CREATE DATABASE new_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**示例 1：将备份文件导入到指定数据库**

我们有一个 `mydatabase_backup.sql` 文件，想把它恢复到名为 `new_database` 的空数据库中。

```bash
mysql -u root -p new_database < mydatabase_backup.sql
```

**示例 2：恢复由 `--all-databases` 或 `--databases` 导出的文件**

如果你的备份文件是用 `--all-databases` 或 `--databases` 选项创建的，那么它内部已经包含了 `CREATE DATABASE` 语句。在这种情况下，导入时**不需要**指定数据库名。

```bash
# 文件 all_databases_backup.sql 包含创建数据库的语句
mysql -u root -p < all_databases_backup.sql
```

**示例 3：从压缩文件中直接导入**

如果你有一个 `.sql.gz` 压缩文件，可以不用先解压，直接导入，这样更高效。

```bash
gunzip < mydatabase_backup.sql.gz | mysql -u root -p new_database
```
*   `gunzip < ...` 或 `gunzip -c ...` 会将解压后的内容输出到标准输出，然后通过管道 `|` 传递给 `mysql` 客户端执行。

---

### 总结与最佳实践

| 操作 | 命令 | 关键点 |
| :--- | :--- | :--- |
| **导出单个库** | `mysqldump -u user -p dbname > backup.sql` | 最基础、最常用的备份方式。 |
| **仅导出结构** | `mysqldump -u user -p --no-data dbname > schema.sql` | 用于复制表结构。 |
| **生产环境备份** | `mysqldump ... --single-transaction --routines ...` | 保证InnoDB数据一致性，不锁表。 |
| **备份并压缩** | `mysqldump ... | gzip > backup.sql.gz` | 节省空间，推荐做法。 |
| **导入数据** | `mysql -u user -p dbname < backup.sql` | 目标数据库需要预先创建。 |
| **从压缩包导入** | `gunzip < backup.sql.gz | mysql -u user -p dbname` | 高效，无需中间文件。 |

掌握这两个命令行的工具对于任何使用MySQL的开发者或管理员来说都是一项基本且非常重要的技能。



---
## 创建表常用约束

### 场景说明

我们将创建两个表：
1.  `departments` (部门表): 一个简单的表，用于被员工表引用。
2.  `employees` (员工表): 这是我们的主要示例，它将包含各种约束来保证数据的完整性和准确性。

---

### 第1步：创建被引用的`departments`表

为了演示外键约束，我们首先需要一个“主表”。

```sql
CREATE TABLE departments (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);
```
*   这个表很简单，`id`是主键且自增，`name`是部门名称，要求非空且唯一。

---

### 第2步：创建包含所有常用约束的`employees`表

这是我们的核心示例。下面的`CREATE TABLE`语句包含了 **主键、非空、唯一、默认值、检查和外键** 这六种常用约束。

```sql
-- 创建 employees 表
CREATE TABLE employees (
    -- 1. 主键约束 (PRIMARY KEY) & 自增 (AUTO_INCREMENT)
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT '员工ID, 主键, 自动递增',

    -- 2. 非空约束 (NOT NULL) & 唯一约束 (UNIQUE)
    employee_number VARCHAR(10) NOT NULL UNIQUE COMMENT '员工编号, 必须提供且不能重复',

    -- 3. 非空约束 (NOT NULL)
    first_name VARCHAR(50) NOT NULL COMMENT '员工的名字, 不能为空',
    last_name VARCHAR(50) NOT NULL COMMENT '员工的姓氏, 不能为空',

    -- 再次使用 非空(NOT NULL) 和 唯一(UNIQUE) 约束
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '电子邮箱, 不能为空且不能重复',

    phone_number VARCHAR(20) COMMENT '联系电话, 可以为空',

    -- 4. 默认值约束 (DEFAULT)
    hire_date DATE NOT NULL DEFAULT (CURRENT_DATE) COMMENT '入职日期, 不能为空, 默认为当前日期',

    -- 5. 检查约束 (CHECK) - MySQL 8.0.16+ 开始支持
    salary DECIMAL(10, 2) NOT NULL CHECK (salary >= 3000.00) COMMENT '月薪, 不能为空, 且必须大于等于3000',

    -- 6. 外键约束 (FOREIGN KEY)
    department_id INT UNSIGNED COMMENT '所属部门ID, 外键',

    -- 另一个 CHECK 约束示例
    status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated')) COMMENT '员工状态, 默认为active',

    -- 在表级别定义外键约束
    -- 引用 departments 表的 id 字段
    -- ON DELETE SET NULL: 当部门被删除时, 员工的部门ID被设为NULL
    -- ON UPDATE CASCADE: 当部门ID更新时, 员工的部门ID也跟着更新
    CONSTRAINT fk_department
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
```

---

### 约束详细解析

下面我们对`employees`表中使用的每一种约束进行详细说明。

#### 1. `PRIMARY KEY` (主键约束)
*   **作用**: 唯一标识表中的每一行记录。它隐含了`NOT NULL`和`UNIQUE`两个约束。一张表只能有一个主键。
*   **示例**: `id INT UNSIGNED PRIMARY KEY`
*   **关联**: `AUTO_INCREMENT`（自增）
    *   这不是一个约束，而是一个列属性，但通常与主键一起使用。它使得每次插入新记录时，该字段的值会自动加1，无需手动指定。

#### 2. `NOT NULL` (非空约束)
*   **作用**: 保证该列的值不能为`NULL`。在插入或更新记录时，必须为该列提供一个值。
*   **示例**: `first_name VARCHAR(50) NOT NULL`

#### 3. `UNIQUE` (唯一约束)
*   **作用**: 保证该列中的所有值都是唯一的，没有重复。`NULL`值除外（在一个唯一约束的列中可以有多个`NULL`值，除非该列同时也被`NOT NULL`约束）。
*   **示例**: `employee_number VARCHAR(10) NOT NULL UNIQUE`
    *   这里`employee_number`既不能是`NULL`，也不能有重复值。

#### 4. `DEFAULT` (默认值约束)
*   **作用**: 如果在插入新记录时没有为该列指定值，那么将自动使用这里设置的默认值。
*   **示例**: `hire_date DATE NOT NULL DEFAULT (CURRENT_DATE)`
    *   `CURRENT_DATE`是一个函数，表示当前日期。如果添加新员工时不指定`hire_date`，它会自动设为当天的日期。

#### 5. `CHECK` (检查约束)
*   **作用**: 保证列中的值满足指定的条件。这是一个布尔表达式，如果为`TRUE`，则操作（插入/更新）成功，否则失败。
*   **注意**: 这个约束在 MySQL 8.0.16 版本之后才被正式支持和强制执行。
*   **示例1**: `salary DECIMAL(10, 2) NOT NULL CHECK (salary >= 3000.00)`
    *   确保员工的薪水不会低于3000。
*   **示例2**: `CHECK (status IN ('active', 'on_leave', 'terminated'))`
    *   确保员工状态只能是这三个预设值之一。

#### 6. `FOREIGN KEY` (外键约束)
*   **作用**: 用于建立和加强两个表数据之间的链接。它确保“从表”（本例中的`employees`）中某一列的值必须在“主表”（本例中的`departments`）的另一列中存在。
*   **示例**:
    ```sql
    CONSTRAINT fk_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    ```
    *   `CONSTRAINT fk_department`: 为这个外键约束命名，方便以后管理。
    *   `FOREIGN KEY (department_id)`: 指定`employees`表中的`department_id`列作为外键。
    *   `REFERENCES departments(id)`: 指定它引用`departments`表的`id`列。
    *   `ON DELETE SET NULL`: 当`departments`表中对应的记录被删除时，将`employees`表中相关员工的`department_id`字段设置为`NULL`。这要求`department_id`列必须允许为`NULL`。
    *   `ON UPDATE CASCADE`: 当`departments`表中被引用的`id`值更新时，`employees`表中所有引用该旧值的`department_id`都会自动更新为新值（级联更新）。

---

### 总结表格

| 约束名称 | 关键字 | 作用 | 示例中的应用 |
| :--- | :--- | :--- | :--- |
| **主键约束** | `PRIMARY KEY` | 唯一标识一行，非空且唯一。 | `id` 字段 |
| **非空约束** | `NOT NULL` | 确保列值不为`NULL`。 | `employee_number`, `first_name`, `email` 等 |
| **唯一约束** | `UNIQUE` | 确保列中所有值唯一。 | `employee_number`, `email` |
| **默认值约束** | `DEFAULT` | 在未指定值时提供默认值。 | `hire_date`, `status` |
| **检查约束** | `CHECK` | 确保值符合指定的条件。 | `salary` 和 `status` 字段 |
| **外键约束** | `FOREIGN KEY` | 关联两个表，确保引用完整性。 | `department_id` 字段关联到 `departments` 表 |

通过上面这个`employees`表的创建语句，你可以非常清楚地看到MySQL中各种常用约束的实际用法和组合方式。


