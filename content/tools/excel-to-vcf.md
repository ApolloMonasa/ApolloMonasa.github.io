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

<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config = {corePlugins: { preflight: false }, prefix: 'tw-'}</script>

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

<h1 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-6">Excel → VCF 通讯录转换器</h1>
<div class="tailwind-scope">
<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8 tw-max-w-5xl tw-w-full tw-px-4">
<div class="tw-card tw-flex tw-flex-col tw-items-center">
<div class="tw-flex tw-items-center tw-space-x-3 tw-mb-4">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript Logo" class="tw-w-10 tw-h-10">
<h2 class="tw-text-xl tw-font-semibold tw-text-gray-700">JavaScript 实现</h2>
</div>
<label for="file-input" class="tw-font-medium tw-mb-2">选择 Excel 文件 (.xlsx, .xls, .csv)</label>
<input type="file" id="file-input" accept=".xlsx, .xls, .csv" class="tw-border tw-border-gray-300 tw-rounded-lg tw-p-2 tw-mb-4 tw-w-full tw-cursor-pointer tw-text-gray-600">
<button id="convert-btn" class="tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-px-6 tw-py-2 tw-rounded-xl tw-font-semibold tw-transition">转换为 VCF 文件</button>
<pre id="status-output" class="tw-mt-4 tw-text-sm tw-text-gray-500 tw-bg-gray-50 tw-p-2 tw-rounded tw-w-full tw-overflow-x-auto tw-hidden"></pre>
</div>
<div class="tw-card tw-flex tw-flex-col tw-items-center">
<div class="tw-flex tw-items-center tw-space-x-3 tw-mb-4">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" alt="Rust Logo" class="tw-w-10 tw-h-10">
<h2 class="tw-text-xl tw-font-semibold tw-text-gray-700">WASM (Rust) 实现</h2>
</div>
<label for="file-input2" class="tw-font-medium tw-mb-2">选择 Excel 文件 (.xlsx, .xls)</label>
<input type="file" id="file-input2" accept=".xlsx, .xls" class="tw-border tw-border-gray-300 tw-rounded-lg tw-p-2 tw-mb-4 tw-w-full tw-cursor-pointer tw-text-gray-600">
<button id="convert-btn2" class="tw-bg-purple-600 hover:tw-bg-purple-700 tw-text-white tw-px-6 tw-py-2 tw-rounded-xl tw-font-semibold tw-transition">转换为 VCF 文件</button>
<pre id="status-output2" class="tw-mt-4 tw-text-sm tw-text-gray-500 tw-bg-gray-50 tw-p-2 tw-rounded tw-w-full tw-overflow-x-auto tw-hidden"></pre>
</div>
</div>
</div>
</div>

<script src="/js/xlsx2vcf.js"></script>
<script type="module">
import init, { xlsx_to_vcf } from '/wasm/xlsx2vcf.js';
const statusOutput = document.getElementById('status-output2');
(async function run() {
    await init();
    document.getElementById('convert-btn2').addEventListener('click', () => {
        const fileInput = document.getElementById('file-input2');
        statusOutput.classList.remove('tw-hidden');
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
