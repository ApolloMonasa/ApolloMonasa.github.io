---
title: "Linux安装SQL
date: 2025-11-07T08:50:00+08:00
weight: 10
tags: ["SQL"]
---

==不同的Linux发行版本包管理工具不同，这里以Ubuntu使用apt安装为例==[pink]

### 安装
```bash
sudo apt install mysql-server -y
```
输入密码，安装后会自动启动mysql服务，可以使用以下命令检查服务状态。
```bash
systemctl status mysql
```

### 补充（手动启动）
```bash
systemctl start mysql
```

### 用户和密码
和Mac不同，Ubuntu安装后会有一个默认的账户和密码，一开始只能使用这个账户密码来登录，可以使用以下命令查看：
```bash
sudo cat /etc/mysql/debian.cnf
```
然后记住你的`user`和`password`。

### 登录连接
同Mac一样，只是这里把用户换一下。
```bash
mysql -u <user> -p
```

然后密码输入刚刚记住的密码。

### 修改root账户的密码
现在安装的版本基本上用这个命令就行：
```bash
## 这个不行换下面那个
alter user 'root'@'%' identified with mysql_native_password by '123456';

alter user 'root'@'localhost' identified with mysql_native_password by '123456';
```

### 补充(旧版本5.7.9以下如何修改密码)

```bash
update user set password=Password("123456") where user = 'root';

update user set authentication_string=PASSWORD("123456") where user = 'root';
```


### 数据库监听地址(可选)

如果客户端无法连接，就检查一下

#### 3306端口
```bash
show variables like '%port%';
```
看到port的value为3306就正常，如果在开发环境使用也可以直接关闭防火墙。

#### root用户访问权限修改

root用户默认没用远程访问权限，通常只能localhost连接，这也就是之前为什么修改root密码的时候要把%换成localhost。

##### 查看
```bash
select user, host from user where user = 'root';
```
##### 修改
如果查看结果是localhost，就说明只能本地访问，需要修改。
```bash
update user set host = '%' where user = 'root';
```

> [!DANGER]
> 这样做可以让root账户在任何地方访问，但是存在安全风险，真实应用环境不建议这样设置。

#### 修改服务监听地址

输入`exit`退出mysql模式，然后输入以下命令进入vi编辑器修改配置文件：

```bash
sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf
```
找到`bindaddress`和`mysqlx-bind-address`都修改成`0.0.0.0`
