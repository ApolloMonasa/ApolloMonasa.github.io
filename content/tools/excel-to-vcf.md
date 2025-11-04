---
# -------------------------------------------------------------------------------------
# |                           核心元数据 (Core Metadata)                            |
# -------------------------------------------------------------------------------------
# 【必填】文章标题：清晰、吸引人，并包含核心关键词
title: "Excel 通讯录转 VCF 工具"
# 【必填】文章发布日期
date: 2025-10-25T23:21:51+08:00
# 【建议】文章最后修改日期：更新文章后，请手动更新此日期，以告知搜索引擎内容已更新
lastmod: 2025-10-25T23:21:51+08:00
# 【必填】文章作者：FixIt主题支持多种格式
# 格式一: 简单字符串
# author: "ApolloMonasa"
# 格式二: 包含链接和头像的复杂对象 (推荐)
# author:
#     - {name: "wmsnp", link: "https://github.com/wmsnp", avatar: "https://i.ooxx.ooo/i/ZGM0M.jpg"}
#     - ApolloMonasa
# 【必填】是否为草稿：发布前请务必设置为 false
draft: false
weight: 0

# -------------------------------------------------------------------------------------
# |                             SEO 与分享 (SEO & Sharing)                           |
# -------------------------------------------------------------------------------------
# 【核心SEO】文章描述：1-3句话，准确概括文章内容，包含关键词。会显示在搜索引擎结果中。
description: ""
# 【建议SEO】文章关键词：针对本文的特定关键词，用逗号分隔
keywords: []
# 【可选SEO】自定义URL：用于创建更简洁或更具描述性的URL，不设置则根据标题自动生成
# slug: "custom-url-slug-for-this-post"
# 【核心分享】社交分享预览图 (og:image)：非常重要！推荐尺寸 1200x630。
# 如果不设置，将使用 params.toml 中定义的全局 images。
# 将图片放在 /static/images/posts/ 目录下，然后在这里引用。
images: [] # 例如: ["/images/posts/my-post-banner.png"]

# -------------------------------------------------------------------------------------
# |                            内容组织 (Taxonomies)                               |
# -------------------------------------------------------------------------------------
# 【必填】标签：可以有多个，用于内容聚合
tags: ["Tool"] # 例如: ["Minecraft", "教程"]
# 【必填】分类：通常只有一个，用于内容归档
categories: [] # 例如: ["模组开发"]
# 【可选】系列：将多篇文章组织成一个系列，自动生成上一篇/下一篇链接
# series: [] # 例如: ["NeoForge 开发系列"]

# -------------------------------------------------------------------------------------
# |                         FixIt 主题特定配置 (Theme-Specific)                     |
# -------------------------------------------------------------------------------------
# 是否开启评论
comment: true
# 是否显示目录
toc: true
# 文章封面图：显示在文章列表和文章顶部
featuredImage: "" # 例如: "/images/posts/my-post-cover.jpg"
---
<style>
*,*::before,*::after{box-sizing:border-box;}
img{max-width:100%;display:block;}
:root{
  --gray:#374151;
  --gray-light:;
  --blue:#2563EB;
  --blue-hover:#1D4ED8;
  --purple:#7C3AED;
  --purple-hover:#6D28D9;
  --white:#fff;
  --radius:.5rem;
  --shadow:0 1px 2px rgba(0,0,0,.05);
  --transition:200ms cubic-bezier(.4,0,.2,1);
}
html[data-theme="dark"]{--gray:#D1D5DB;--white:#111827;--blue:#3B82F6;--blue-hover:#2563EB;--purple:#8B5CF6;--purple-hover:#7C3AED;}
html[data-theme="dark"] body{background:#1F2937;color:var(--gray);}
html[data-theme="dark"] .card{background:#1E293B;color:var(--gray-light);border-color:rgba(255,255,255,.1);}
html[data-theme="dark"] input[type="file"],html[data-theme="dark"] .btn{background:#374151;color:var(--gray-light);border-color:#4B5563;}
html[data-theme="dark"] pre{background:#111827;color:#E5E7EB;}
body{font-family:sans-serif;color:var(--gray);margin:0;padding:0;}
.grid{display:grid;gap:2rem;grid-template-columns:1fr;}
.grid-2{grid-template-columns:repeat(2,1fr);}
.flex{display:flex;align-items:center;gap:.75rem;}
.flex-col{flex-direction:column;align-items:center;}
.mb2{margin-bottom:.5rem;}
.mb4{margin-bottom:1rem;}
.mt2{margin-top:.5rem;}
.p2{padding:.5rem;}
.w-full{width:100%;}
.w10{width:2.5rem;height:2.5rem;}
.round{border-radius:var(--radius);}
.round-xl{border-radius:.75rem;}
.card{background:var(--white);padding:1rem;border-radius:.75rem;box-shadow:var(--shadow);border:1px solid rgba(0,0,0,.03);display:flex;flex-direction:column;align-items:center;}
.text-lg{font-size:1.25rem;font-weight:600;}
.text-sm{font-size:.875rem;color:#4B5563;}
.btn{padding:.5rem 1.5rem;border-radius:.75rem;font-weight:600;color:var(--white);cursor:pointer;transition:all var(--transition);border:none;}
.btn-blue{background:var(--blue);}
.btn-blue:hover{background:var(--blue-hover);}
.btn-purple{background:var(--purple);}
.btn-purple:hover{background:var(--purple-hover);}
input[type="file"]{padding:.5rem;border-radius:.5rem;background:#fff;border:1px solid var(--gray-light);width:100%;cursor:pointer;}
pre{white-space:pre-wrap;word-break:break-word;background:#F9FAFB;padding:.5rem;border-radius:.5rem;overflow-x:auto;color:#4B5563;font-size:.875rem;}
@media(min-width:768px){.md-grid-2{grid-template-columns:repeat(2,1fr);}}
</style>

## Excel 通讯录转 VCF 工具

这是一个完全在浏览器中运行的工具，您的数据不会上传到任何服务器，请放心使用。

### 1. 准备您的 Excel 文件

请确保您的 Excel 文件第一行为表头，并且包含至少 **"姓名"** 和 **"手机"** 两列。建议的列名如下：

*   `姓名` (必填)
*   `手机` (必填)
*   `公司`
*   `职位`
*   `邮箱`
*   `固话`

<a href="#" id="download-template-btn" style="font-weight: bold; text-decoration: underline;">点击这里下载模板文件</a>

### 2. 上传并转换

<h2>Excel → VCF 通讯录转换器</h2>
<div class="grid grid-1 md-grid-2" style="max-width:64rem;margin:0 auto;padding:1rem;">
<div class="card flex-col">
<div class="flex mb4">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" class="w10">
<h2 class="text-lg">JavaScript 实现</h2>
</div>
<label for="file-js" class="mb2 text-sm">选择 Excel 文件 (.xlsx, .xls, .csv)</label>
<input type="file" id="file-js" accept=".xlsx,.xls,.csv">
<button id="convert-js" class="btn btn-blue mt2">转换为 VCF 文件</button>
<pre id="status-js" class="p2 mt2 w-full" style="display:none;"></pre>
</div>
<div class="card flex-col">
<div class="flex mb4">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" class="w10">
<h2 class="text-lg">WASM (Rust) 实现</h2>
</div>
<label for="file-rust" class="mb2 text-sm">选择 Excel 文件 (.xlsx, .xls)</label>
<input type="file" id="file-rust" accept=".xlsx,.xls">
<button id="convert-rust" class="btn btn-purple mt2">转换为 VCF 文件</button>
<pre id="status-rust" class="p2 mt2 w-full" style="display:none;"></pre>
</div>
</div>

<script src="/js/xlsx2vcf.js"></script>
<script type="module">
import init, { xlsx_to_vcf } from '/wasm/xlsx2vcf.js';
const statusOutput = document.getElementById('status-rust');
(async function run() {
    await init();
    document.getElementById('convert-rust').addEventListener('click', () => {
        const fileInput = document.getElementById('file-rust');
        statusOutput.style.display = 'block';
        if (!fileInput.files.length) return statusOutput.textContent = '错误：请先选择一个 Excel 文件。';
        const reader = new FileReader();
        reader.onload = async (e) => {
            const startTime = performance.now();
            const uint8array = new Uint8Array(e.target.result);
            try {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(new Blob([xlsx_to_vcf(uint8array)], { type: 'text/vcard;charset=utf-8;' }));
                link.download = 'contacts.vcf';
                link.click();
                URL.revokeObjectURL(link.href);
                const timeTaken = (performance.now() - startTime).toFixed(2);
                statusOutput.textContent = "成功生成 VCF 文件！耗时 "+timeTaken+" 毫秒。请在浏览器下载中查看。";
            } catch (err) {
                statusOutput.textContent = "转换失败：" + err;
            }
        };
        reader.readAsArrayBuffer(fileInput.files[0]);
    });
})();
</script>
