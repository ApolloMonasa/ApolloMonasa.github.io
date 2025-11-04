---
# -------------------------------------------------------------------------------------
# |                           核心元数据 (Core Metadata)                            |
# -------------------------------------------------------------------------------------
title: "Excel 通讯录转 VCF 工具 (支持深色模式)"
date: 2025-10-25T23:21:51+08:00
lastmod: 2025-10-26T11:00:00+08:00
author: "wmsnp"
draft: false
weight: 0

# -------------------------------------------------------------------------------------
# |                             SEO 与分享 (SEO & Sharing)                           |
# -------------------------------------------------------------------------------------
description: "一个安全、纯前端的在线工具，可以快速将您的 Excel (.xlsx, .xls) 通讯录文件转换为通用的 VCF (vCard) 格式，方便导入手机或邮箱联系人。完美支持Hugo主题的深色和浅色模式。"
keywords: ["Excel to VCF", "通讯录转换", "Excel转vCard", "在线工具", "VCF生成器", "深色模式"]
images: []

# -------------------------------------------------------------------------------------
# |                            内容组织 (Taxonomies)                               |
# -------------------------------------------------------------------------------------
tags: ["Tool", "Excel", "VCF"]
categories: ["实用工具"]

# -------------------------------------------------------------------------------------
# |                         FixIt 主题特定配置 (Theme-Specific)                     |
# -------------------------------------------------------------------------------------
comment: true
toc: true
featuredImage: ""
---

## Excel 通讯录转 VCF 工具

这是一个完全在浏览器中运行的工具，您的数据不会上传到任何服务器，请放心使用。它能自动适应网站的浅色和深色主题。

### 1. 准备您的 Excel 文件

请确保您的 Excel 文件第一行为表头，并且包含至少 **"姓名"** 和 **"手机"** 两列。建议的列名如下：

*   `姓名` (必填)
*   `手机` (必填)
*   `公司`
*   `职位`
*   `邮箱`
*   `固话`
*   `备注`

<a href="#" id="download-template-btn" class="template-link">👇 点击这里下载模板文件 (通讯录模板.xlsx)</a>

### 2. 上传并转换

<!-- NEW: 全新的HTML结构，更易于样式化 -->
<div class="converter-container">
    <div class="converter__input-area">
        <label for="file-input" class="converter__file-label">
            <span>📁</span> 选择 Excel 文件
        </label>
        <input type="file" id="file-input" accept=".xlsx, .xls, .csv" hidden>
        <span id="file-name-display" class="converter__file-name">未选择任何文件</span>
    </div>
    <button id="convert-btn" class="converter__button">转换为 VCF 文件</button>
    <div id="status-output" class="converter__status"></div>
</div>

<!-- 引入 SheetJS 库 -->
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

<!-- NEW: JavaScript 增强了 UX -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const convertBtn = document.getElementById('convert-btn');
    const statusOutput = document.getElementById('status-output');
    const fileNameDisplay = document.getElementById('file-name-display');
    const downloadTemplateBtn = document.getElementById('download-template-btn');

    // ==========================================================
    // 模板下载功能
    // ==========================================================
    downloadTemplateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const templateData = [
            { "姓名": "张三", "手机": "13800138000", "公司": "示例科技有限公司", "职位": "经理", "邮箱": "zhangsan@example.com", "固话": "010-12345678", "备注": "重要客户" },
            { "姓名": "李四", "手机": "13900139001", "公司": "", "职位": "", "邮箱": "lisi@example.com", "固话": "", "备注": "同事，技术部" }
        ];
        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "通讯录");
        XLSX.writeFile(workbook, "通讯录模板.xlsx");
    });

    // ==========================================================
    // 文件选择反馈
    // ==========================================================
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
            updateStatus('文件已选择，请点击转换。', 'info');
        } else {
            fileNameDisplay.textContent = '未选择任何文件';
            statusOutput.innerHTML = '';
        }
    });
    
    // ==========================================================
    // 核心转换功能
    // ==========================================================
    convertBtn.addEventListener('click', () => {
        if (fileInput.files.length === 0) {
            updateStatus('❌ 错误：请先选择一个 Excel 文件。', 'error');
            return;
        }
        
        // 禁用按钮，防止重复点击
        convertBtn.disabled = true;
        convertBtn.textContent = '正在转换...';
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        updateStatus('正在读取文件...', 'info');
        
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const contacts = XLSX.utils.sheet_to_json(worksheet);
                
                if (contacts.length === 0) {
                    updateStatus('❌ 错误：Excel文件中没有找到任何联系人数据。', 'error');
                    resetButton();
                    return;
                }

                if (!contacts[0]['姓名'] || !contacts[0]['手机']) {
                    updateStatus('❌ 错误：Excel 文件必须包含 "姓名" 和 "手机" 列。', 'error');
                    resetButton();
                    return;
                }
                
                let vcfContent = '';
                contacts.forEach(contact => {
                    const name = contact['姓名'] || '';
                    const mobile = String(contact['手机'] || '').trim();
                    const company = contact['公司'] || '';
                    const title = contact['职位'] || '';
                    const email = contact['邮箱'] || '';
                    const workPhone = String(contact['固话'] || '').trim();
                    const note = contact['备注'] || '';

                    if (name && mobile) {
                        let card = "BEGIN:VCARD\nVERSION:3.0\n";
                        card += `FN;CHARSET=UTF-8:${name}\n`;
                        card += `N;CHARSET=UTF-8:${name};;;;\n`;
                        if (mobile) card += `TEL;TYPE=CELL:${mobile}\n`;
                        if (workPhone) card += `TEL;TYPE=WORK:${workPhone}\n`;
                        if (email) card += `EMAIL:${email}\n`;
                        if (company) card += `ORG;CHARSET=UTF-8:${company}\n`;
                        if (title) card += `TITLE;CHARSET=UTF-8:${title}\n`;
                        if (note) card += `NOTE;CHARSET=UTF-8:${note}\n`;
                        card += "END:VCARD\n";
                        vcfContent += card;
                    }
                });
                
                if (!vcfContent) {
                    updateStatus('⚠️ 警告：未生成任何有效的联系人卡片，请检查数据是否完整。', 'error');
                    resetButton();
                    return;
                }
                
                downloadVcf(vcfContent, 'contacts.vcf');
                updateStatus(`✅ 成功！已生成包含 ${contacts.length} 个联系人的 VCF 文件。`, 'success');

            } catch (error) {
                console.error(error);
                updateStatus('❌ 文件处理失败，请确保文件是有效的 Excel 格式。', 'error');
            } finally {
                resetButton();
            }
        };
        
        reader.onerror = function() {
            updateStatus('❌ 读取文件时发生错误。', 'error');
            resetButton();
        };
        
        reader.readAsArrayBuffer(file);
    });

    // ==========================================================
    // 辅助函数
    // ==========================================================
    function updateStatus(message, type) {
        statusOutput.innerHTML = message;
        statusOutput.className = 'converter__status'; // Reset classes
        if (type === 'success') {
            statusOutput.classList.add('status--success');
        } else if (type === 'error') {
            statusOutput.classList.add('status--error');
        } else {
            statusOutput.classList.add('status--info');
        }
    }

    function resetButton() {
        convertBtn.disabled = false;
        convertBtn.textContent = '转换为 VCF 文件';
    }

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
            URL.revokeObjectURL(url);
        }
    }
});
</script>

<!-- NEW: 全新的CSS，使用CSS变量以支持主题切换 -->
<style>
/* 下载模板链接样式 */
.template-link {
    font-weight: bold;
    text-decoration: none;
    color: var(--theme-primary-color, #007bff);
    border-bottom: 2px solid var(--theme-primary-color, #007bff);
    transition: color 0.3s, border-bottom-color 0.3s;
}
.template-link:hover {
    color: var(--theme-primary-color-darken, #0056b3);
    border-bottom-color: var(--theme-primary-color-darken, #0056b3);
}

/* 转换器容器主样式 */
.converter-container {
    /* 使用 CSS 变量，并提供后备值 */
    background-color: var(--card-background-color, #ffffff);
    color: var(--theme-text-color-primary, #222);
    border: 1px solid var(--theme-border-color, #e0e0e0);
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 12px var(--theme-shadow-color, rgba(0, 0, 0, 0.08));
    max-width: 600px;
    margin: 20px 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    transition: background-color 0.3s, border-color 0.3s;
}

/* 文件输入区域 */
.converter__input-area {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap; /* 在小屏幕上换行 */
}
.converter__file-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background-color: var(--theme-button-background-color, #f0f0f0);
    color: var(--theme-button-text-color, #333);
    border: 1px solid var(--theme-border-color, #ccc);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s, box-shadow 0.3s;
}
.converter__file-label:hover {
    background-color: var(--theme-button-hover-background-color, #e6e6e6);
    box-shadow: 0 2px 4px var(--theme-shadow-color, rgba(0, 0, 0, 0.1));
}
.converter__file-name {
    font-size: 0.9em;
    color: var(--theme-text-color-secondary, #666);
    flex-grow: 1; /* 占据剩余空间 */
}

/* 主转换按钮 */
.converter__button {
    width: 100%;
    padding: 12px 20px;
    font-size: 1.1em;
    font-weight: bold;
    color: #fff;
    background-color: var(--theme-primary-color, #007bff);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}
.converter__button:hover:not(:disabled) {
    background-color: var(--theme-primary-color-darken, #0056b3);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
    transform: translateY(-2px);
}
.converter__button:disabled {
    background-color: var(--theme-disabled-color, #a0a0a0);
    cursor: not-allowed;
    opacity: 0.7;
}

/* 状态输出区域 */
.converter__status {
    margin-top: 20px;
    padding: 12px;
    border-radius: 8px;
    background-color: var(--theme-code-background-color, #f5f5f5);
    min-height: 20px;
    font-size: 0.95em;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
    transition: background-color 0.3s, color 0.3s;
}
.converter__status.status--info {
    color: var(--theme-text-color-secondary, #555);
}
.converter__status.status--success {
    background-color: var(--theme-success-bg-color, rgba(40, 167, 69, 0.1));
    color: var(--theme-success-text-color, #155724);
}
.converter__status.status--error {
    background-color: var(--theme-error-bg-color, rgba(220, 53, 69, 0.1));
    color: var(--theme-error-text-color, #721c24);
}
</style>