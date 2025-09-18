---
title: 第一章的第二节
weight: 10
author: {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://avatars.githubusercontent.com/u/50136928"}

---

## 安装与配置

将 [FixIt](https://github.com/hugo-fixit/FixIt) 和此 git 存储库克隆到你的主题文件夹中，并将其作为网站目录的子模块添加。

```bash {.no-header}
git submodule add https://github.com/hugo-fixit/FixIt.git themes/FixIt
git submodule add https://github.com/wmsnp/FixItsDoc.git themes/FixItsDoc
```

接下来编辑项目的 `hugo.toml` 并将此主题组件添加到你的主题中：

```toml {.no-header}
theme = ["FixItsDoc", "FixIt"]
```

然后，在 `config.toml` 中需要填写以下必要配置：

```toml {.no-header}
[params]
  [params.customPartials]
    # ... other partials
    assets = [
      "inject/fixitsdoc.html",
    ]
    # ... other partials
```

## 使用

在文档顶层文件夹的 `_index.md` 文件中，添加以下内容：
```yaml {.no-header}
---
cascade:
  params:
    type: docs
isTopLevel: true
---
```
对于每个文件和目录，均根据 `weight` 排序

## 更多功能

支持文章显示多个作者：
```yaml {.no-header}
author: 
  - wmsnp
  - {name: "another wmsnp", link: "https://github.com/wmsnp", avatar: "xxx"}
---
