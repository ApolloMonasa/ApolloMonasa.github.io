---
# -------------------------------------------------------------------------------------
# |                           核心元数据 (Core Metadata)                            |
# -------------------------------------------------------------------------------------
# NEW: 使用您提供的完整元数据
title: "Excel to VCF Converter (JS & WASM Comparison)"
date: 2025-10-25T23:21:51+08:00
lastmod: 2025-10-26T14:00:00+08:00
author:
  - name: "wmsnp"
draft: false
weight: 0

# -------------------------------------------------------------------------------------
# |                             SEO 与分享 (SEO & Sharing)                           |
# -------------------------------------------------------------------------------------
description: "一个安全、纯前端的在线工具，可以快速将 Excel 通讯录文件转换为 VCF (vCard) 格式。同时对比了原生 JavaScript 和 Rust/WASM 的实现性能。完美支持深色模式。"
keywords: ["Excel to VCF", "通讯录转换", "Excel转vCard", "WASM", "Rust", "在线工具", "VCF生成器"]
images: []

# -------------------------------------------------------------------------------------
# |                            内容组织 (Taxonomies)                               |
# -------------------------------------------------------------------------------------
tags: ["Tool", "Excel", "VCF", "WASM", "JavaScript"]
categories: ["实用工具"]

# -------------------------------------------------------------------------------------
# |                         FixIt 主题特定配置 (Theme-Specific)                     |
# -------------------------------------------------------------------------------------
comment: true
toc: true
featuredImage: ""
---
<!-- 保留朋友的样式表 -->
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

请确保您的 Excel 文件第一行为表头，并且包含至少 **"姓名"** 和 **"手机"** 两列。建议的列名如下 (左侧的JS版本支持所有列，右侧的WASM版本仅支持基础列)：

*   `姓名` (必填)
*   `手机` (必填)
*   `公司`
*   `职位`
*   `邮箱`
*   `固话`
*   `生日` <!-- NEW: 更新说明，支持新字段 -->
*   `备注` <!-- NEW: 更新说明，支持新字段 -->

<a href="#" id="download-template-btn" style="font-weight: bold; text-decoration: underline;">点击这里下载模板文件 (支持所有字段)</a>

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

<!-- 引入 SheetJS 库 (JS版本需要) -->
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

<!-- NEW: 注入您功能完整的 JavaScript 逻辑 -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // ==========================================================
    // 模板下载功能 (已更新，支持新字段)
    // ==========================================================
    document.getElementById('download-template-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const templateData = [
            { "姓名": "张三", "手机": "13800138000", "公司": "示例科技", "职位": "经理", "邮箱": "zhangsan@example.com", "固话": "010-12345678", "生日": "1990-05-20", "备注": "重要客户" },
            { "姓名": "李四", "手机": "13900139001", "公司": "", "职位": "", "邮箱": "lisi@example.com", "固话": "", "生日": "1992-11-11", "备注": "同事" }
        ];
        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "通讯录");
        XLSX.writeFile(workbook, "通讯录模板.xlsx");
    });

    // ==========================================================
    // JavaScript 版本转换器逻辑
    // ==========================================================
    const fileInputJs = document.getElementById('file-js');
    const convertBtnJs = document.getElementById('convert-js');
    const statusOutputJs = document.getElementById('status-js');

    convertBtnJs.addEventListener('click', () => {
        if (fileInputJs.files.length === 0) {
            updateStatus(statusOutputJs, '❌ 错误：请先选择一个 Excel 文件。', 'error');
            return;
        }
        
        convertBtnJs.disabled = true;
        convertBtnJs.textContent = '正在转换...';
        
        const file = fileInputJs.files[0];
        const reader = new FileReader();
        
        updateStatus(statusOutputJs, '正在读取文件...', 'info');
        
        reader.onload = function(e) {
            const startTime = performance.now();
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const contacts = XLSX.utils.sheet_to_json(worksheet);
                
                if (contacts.length === 0) {
                    updateStatus(statusOutputJs, '❌ 错误：Excel文件中没有找到数据。', 'error'); return;
                }
                if (!contacts[0]['姓名'] || !contacts[0]['手机']) {
                    updateStatus(statusOutputJs, '❌ 错误：必须包含 "姓名" 和 "手机" 列。', 'error'); return;
                }
                
                let vcfContent = '';
                contacts.forEach(contact => {
                    const name = contact['姓名'] || '';
                    const mobile = String(contact['手机'] || '').trim();
                    if (!name || !mobile) return;

                    // NEW: 读取新增字段
                    const birthday = contact['生日'] || '';
                    const note = contact['备注'] || '';
                    
                    let card = "BEGIN:VCARD\nVERSION:3.0\n";
                    card += `FN;CHARSET=UTF-8:${name}\n`;
                    card += `N;CHARSET=UTF-8:${name};;;;\n`;
                    if (contact['公司']) card += `ORG;CHARSET=UTF-8:${contact['公司']}\n`;
                    if (contact['职位']) card += `TITLE;CHARSET=UTF-8:${contact['职位']}\n`;
                    if (contact['邮箱']) card += `EMAIL:${contact['邮箱']}\n`;
                    if (mobile) card += `TEL;TYPE=CELL:${mobile}\n`;
                    if (contact['固话']) card += `TEL;TYPE=WORK:${String(contact['固话']).trim()}\n`;
                    if (birthday) card += `BDAY:${birthday}\n`;
                    if (note) card += `NOTE;CHARSET=UTF-8:${note}\n`;
                    card += "END:VCARD\n";
                    vcfContent += card;
                });
                
                if (!vcfContent) {
                    updateStatus(statusOutputJs, '⚠️ 警告：未生成任何有效联系人。', 'error'); return;
                }
                
                downloadVcf(vcfContent, 'contacts.vcf');
                const timeTaken = (performance.now() - startTime).toFixed(2);
                updateStatus(statusOutputJs, `✅ 成功生成 VCF！耗时 ${timeTaken} 毫秒。`, 'success');

            } catch (error) {
                console.error(error);
                updateStatus(statusOutputJs, '❌ 文件处理失败，请确保格式正确。', 'error');
            } finally {
                resetButton(convertBtnJs, '转换为 VCF 文件');
            }
        };
        reader.readAsArrayBuffer(file);
    });

    // ==========================================================
    // 辅助函数
    // ==========================================================
    function updateStatus(element, message, type) {
        element.style.display = 'block';
        element.textContent = message;
        element.className = 'p2 mt2 w-full'; // Reset classes from friend's style
        if (type === 'success') element.style.color = '#155724';
        else if (type === 'error') element.style.color = '#721c24';
        else element.style.color = '#555';
    }
    function resetButton(button, text) {
        button.disabled = false;
        button.textContent = text;
    }
    function downloadVcf(content, fileName) {
        const blob = new Blob([content], { type: 'text/vcard;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }
});
</script>

<!-- 保留朋友的 WASM 逻辑 -->
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