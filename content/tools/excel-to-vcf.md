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

<a href="#" id="download-template-btn" style="font-weight: bold; text-decoration: underline;">点击这里下载模板文件 (通讯录模板.xlsx)</a>

### 2. 上传并转换

<div class="converter-container">
    <label for="file-input">选择 Excel 文件 (.xlsx, .xls):</label>
    <input type="file" id="file-input" accept=".xlsx, .xls, .csv">
    <button id="convert-btn">转换为 VCF 文件</button>
    <pre id="status-output"></pre>
</div>

<!-- 引入 SheetJS 库 -->
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

<script>
// ==========================================================
// 模板下载功能 (新添加)
// ==========================================================
document.getElementById('download-template-btn').addEventListener('click', (e) => {
    e.preventDefault(); // 阻止 <a> 标签的默认跳转行为
    
    // 1. 定义模板数据
    const templateData = [
        { "姓名": "张三", "手机": "13800138000", "公司": "示例科技有限公司", "职位": "经理", "邮箱": "zhangsan@example.com", "固话": "010-12345678" },
        { "姓名": "李四", "手机": "13900139001", "公司": "", "职位": "", "邮箱": "lisi@example.com", "固话": "" }
    ];

    // 2. 使用 SheetJS 将 JSON 数据转换为工作表
    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // 3. 创建一个新的工作簿并添加工作表
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "通讯录");

    // 4. 生成 Excel 文件并触发浏览器下载
    XLSX.writeFile(workbook, "通讯录模板.xlsx");
});


// ==========================================================
// 核心转换功能 (与之前相同)
// ==========================================================
document.getElementById('convert-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('file-input');
    const statusOutput = document.getElementById('status-output');
    
    if (fileInput.files.length === 0) {
        statusOutput.textContent = '错误：请先选择一个 Excel 文件。';
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    statusOutput.textContent = '正在读取文件...';
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            const contacts = XLSX.utils.sheet_to_json(worksheet);
            
            statusOutput.textContent = `成功读取 ${contacts.length} 个联系人，正在生成 VCF 文件...`;
            
            if (contacts.length === 0) {
                statusOutput.textContent = '错误：Excel文件中没有找到任何联系人数据。';
                return;
            }

            const firstContact = contacts[0];
            if (!firstContact['姓名'] || !firstContact['手机']) {
                statusOutput.textContent = '错误：Excel 文件必须包含 "姓名" 和 "手机" 列。请检查您的表头。';
                return;
            }
            
            let vcfContent = '';
            contacts.forEach(contact => {
                const name = contact['姓名'] || '';
                const mobile = String(contact['手机'] || '').trim(); // 确保手机号是字符串并去除空格
                const company = contact['公司'] || '';
                const title = contact['职位'] || '';
                const email = contact['邮箱'] || '';
                const workPhone = String(contact['固话'] || '').trim();

                // 只有姓名和手机号都存在时才创建 vCard
                if (name && mobile) {
                    let card = "BEGIN:VCARD\n";
                    card += "VERSION:3.0\n";
                    card += `FN;CHARSET=UTF-8:${name}\n`;
                    card += `N;CHARSET=UTF-8:${name};;;;\n`; // 简化N字段
                    
                    if (mobile) card += `TEL;TYPE=CELL:${mobile}\n`;
                    if (workPhone) card += `TEL;TYPE=WORK:${workPhone}\n`;
                    if (email) card += `EMAIL:${email}\n`;
                    if (company) card += `ORG;CHARSET=UTF-8:${company}\n`;
                    if (title) card += `TITLE;CHARSET=UTF-8:${title}\n`;
                    
                    card += "END:VCARD\n";
                    vcfContent += card;
                }
            });
            
            if (!vcfContent) {
                statusOutput.textContent = '未生成任何有效的联系人卡片，请检查数据是否完整。';
                return;
            }
            
            downloadVcf(vcfContent, 'contacts.vcf');
            statusOutput.textContent = `成功生成 VCF 文件！请在浏览器下载中查看。`;

        } catch (error) {
            console.error(error);
            statusOutput.textContent = '文件处理失败，请确保文件是有效的 Excel 格式。';
        }
    };
    
    reader.onerror = function() {
        statusOutput.textContent = '读取文件时发生错误。';
    };
    
    reader.readAsArrayBuffer(file);
});

function downloadVcf(content, fileName) {
    const blob = new Blob([content], { type: 'text/vcard;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // 释放内存
    }
}
</script>

<!-- (可选) 样式保持不变 -->
<style>
.converter-container {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    max-width: 600px;
}
.converter-container input[type="file"] {
    display: block;
    margin: 10px 0;
}
.converter-container button {
    padding: 10px 15px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}
.converter-container button:hover {
    background-color: #0056b3;
}
.converter-container pre {
    margin-top: 15px;
    background-color: #eee;
    padding: 10px;
    border-radius: 5px;
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>