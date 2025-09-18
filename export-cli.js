#!/usr/bin/env node

import { createServer } from 'http';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 简单的命令行参数解析
const args = process.argv.slice(2);
const text = args[0] || '测试文本';
const fontSize = parseInt(args[1]) || 24;
const backgroundColor = args[2] || '#ffffff';
const textColor = args[3] || '#000000';

console.log('导出参数:');
console.log('- 文本:', text);
console.log('- 字体大小:', fontSize);
console.log('- 背景色:', backgroundColor);
console.log('- 文字色:', textColor);

// 创建HTML模板
const htmlTemplate = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Export Test</title>
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .canvas-container {
            width: 400px;
            height: 200px;
            background: white;
            border: 1px solid #ccc;
            position: relative;
            margin: 20px auto;
        }
        .text-element {
            position: absolute;
            left: 50px;
            top: 50px;
            width: 300px;
            height: 100px;
            background-color: ${backgroundColor};
            color: ${textColor};
            font-size: ${fontSize}px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            border: 1px solid #e5e7eb;
            word-wrap: break-word;
            white-space: pre-wrap;
            overflow: hidden;
        }
        .controls {
            text-align: center;
            margin: 20px;
        }
        button {
            padding: 10px 20px;
            font-size: 16px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #2563eb;
        }
    </style>
</head>
<body>
    <div class="controls">
        <h1>文字导出测试</h1>
        <p>文本: "${text}" | 字体: ${fontSize}px | 背景: ${backgroundColor} | 文字: ${textColor}</p>
        <button onclick="exportImage()">导出图片</button>
    </div>
    
    <div class="canvas-container" id="canvas">
        <div class="text-element">
            ${text}
        </div>
    </div>

    <script>
        async function exportImage() {
            try {
                const canvas = document.getElementById('canvas');
                console.log('开始导出，画布元素:', canvas);
                
                // 等待一小段时间确保样式完全应用
                await new Promise(resolve => setTimeout(resolve, 200));
                
                const canvasElement = await html2canvas(canvas, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    foreignObjectRendering: false,
                    logging: true,
                    width: canvas.clientWidth,
                    height: canvas.clientHeight,
                    scrollX: 0,
                    scrollY: 0
                });
                
                // 创建下载链接
                const link = document.createElement('a');
                link.download = 'test-export-' + Date.now() + '.png';
                link.href = canvasElement.toDataURL('image/png', 1.0);
                link.click();
                
                console.log('导出完成');
                alert('图片导出成功！');
            } catch (error) {
                console.error('导出失败:', error);
                alert('导出失败: ' + error.message);
            }
        }
        
        // 自动导出（可选）
        // setTimeout(exportImage, 1000);
    </script>
</body>
</html>
`;

// 写入HTML文件
const outputPath = join(__dirname, 'test-export.html');
writeFileSync(outputPath, htmlTemplate, 'utf8');

console.log('\n✅ HTML文件已生成:', outputPath);
console.log('📖 请在浏览器中打开此文件，然后点击"导出图片"按钮进行测试');
console.log('\n使用方法:');
console.log('node export-cli.js "你的文本" 字体大小 背景色 文字色');
console.log('例如: node export-cli.js "Hello World" 32 "#ff0000" "#ffffff"');