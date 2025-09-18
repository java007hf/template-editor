#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建测试HTML，模拟SimpleVisualEditor的文字元素
const testHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Center Test</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .test-container {
            width: 600px;
            margin: 20px auto;
            background: white;
            border: 1px solid #ccc;
        }
        .method-title {
            background: #f0f0f0;
            padding: 10px;
            font-weight: bold;
            text-align: center;
        }
        
        /* 方法1：使用transform（SimpleVisualEditor原始方法） */
        .text-element-transform {
            position: relative;
            width: 300px;
            height: 100px;
            background-color: #e0e0e0;
            border: 1px solid #ccc;
            margin: 20px;
        }
        .text-content-transform {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
            word-wrap: break-word;
        }
        
        /* 方法2：使用flexbox（修复后的方法） */
        .text-element-flex {
            width: 300px;
            height: 100px;
            background-color: #e0e0e0;
            border: 1px solid #ccc;
            margin: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            word-wrap: break-word;
            white-space: pre-wrap;
            overflow: hidden;
        }
        
        /* 方法3：使用table-cell */
        .text-element-table {
            width: 300px;
            height: 100px;
            background-color: #e0e0e0;
            border: 1px solid #ccc;
            margin: 20px;
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            word-wrap: break-word;
        }
        
        .export-buttons {
            text-align: center;
            margin: 20px;
        }
        button {
            margin: 5px;
            padding: 10px 20px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1 style="text-align: center;">文字居中方法对比测试</h1>
    
    <div class="test-container">
        <div class="method-title">方法1：transform translate(-50%, -50%)</div>
        <div class="text-element-transform">
            <div class="text-content-transform">
                测试文字居中效果
            </div>
        </div>
    </div>
    
    <div class="test-container">
        <div class="method-title">方法2：flexbox (align-items: center)</div>
        <div class="text-element-flex">
            测试文字居中效果
        </div>
    </div>
    
    <div class="test-container">
        <div class="method-title">方法3：table-cell (vertical-align: middle)</div>
        <div class="text-element-table">
            测试文字居中效果
        </div>
    </div>
    
    <div class="export-buttons">
        <button onclick="exportWithHtml2Canvas()">使用 html2canvas 导出</button>
        <button onclick="exportWithPuppeteer()">模拟 Puppeteer 效果</button>
    </div>
    
    <script>
        async function exportWithHtml2Canvas() {
            try {
                const containers = document.querySelectorAll('.test-container');
                for (let i = 0; i < containers.length; i++) {
                    const canvas = await html2canvas(containers[i], {
                        backgroundColor: '#ffffff',
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        foreignObjectRendering: false,
                        logging: true
                    });
                    
                    const link = document.createElement('a');
                    link.download = \`html2canvas-method\${i+1}-\${Date.now()}.png\`;
                    link.href = canvas.toDataURL('image/png', 1.0);
                    link.click();
                }
                alert('html2canvas 导出完成！');
            } catch (error) {
                console.error('html2canvas 导出失败:', error);
                alert('导出失败: ' + error.message);
            }
        }
        
        function exportWithPuppeteer() {
            alert('Puppeteer 导出需要在服务器端运行，这里只是模拟效果');
        }
    </script>
</body>
</html>
`;

async function createTestAndExport() {
    // 创建测试HTML文件
    const htmlPath = join(__dirname, 'text-center-test.html');
    writeFileSync(htmlPath, testHTML, 'utf8');
    console.log('✅ 测试HTML文件已创建:', htmlPath);
    
    // 使用Puppeteer导出测试
    let browser;
    try {
        console.log('🚀 启动浏览器进行Puppeteer测试...');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.goto(`file://${htmlPath}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 分别截图每个测试容器
        const containers = await page.$$('.test-container');
        for (let i = 0; i < containers.length; i++) {
            const screenshot = await containers[i].screenshot({
                type: 'png',
                omitBackground: false
            });
            
            const filename = \`puppeteer-method\${i+1}-\${Date.now()}.png\`;
            const outputPath = join(__dirname, filename);
            writeFileSync(outputPath, screenshot);
            console.log(\`✅ Puppeteer 方法\${i+1} 导出成功:`, outputPath);
        }
        
    } catch (error) {
        console.error('❌ Puppeteer 测试失败:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
    console.log('\\n📖 请在浏览器中打开', htmlPath);
    console.log('📖 然后点击"使用 html2canvas 导出"按钮进行对比测试');
    console.log('\\n🔍 对比说明:');
    console.log('- Puppeteer 导出的图片应该显示正确的文字居中');
    console.log('- html2canvas 导出的图片可能显示文字位置偏移');
    console.log('- 这解释了为什么CLI导出正确而网页导出有问题');
}

createTestAndExport();