const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
document.head.appendChild(script);
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
document.getElementById('convert-js').addEventListener('click', () => {
    const fileInput = document.getElementById('file-js');
    const statusOutput = document.getElementById('status-js');
    statusOutput.style.display = 'block';
    if (fileInput.files.length === 0) {
        statusOutput.textContent = '错误：请先选择一个 Excel 文件。';
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    statusOutput.textContent = '正在读取文件...';
    
    reader.onload = function(e) {
        const startTime = performance.now();
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
            const endTime = performance.now();
            statusOutput.textContent = `成功生成 VCF 文件！耗时 ${(endTime - startTime).toFixed(2)} 毫秒。请在浏览器下载中查看。`;

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