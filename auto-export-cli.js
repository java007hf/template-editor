#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
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

console.log('自动导出参数:');
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
    <title>Auto Export Test</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: white;
        }
        .canvas-container {
            width: 400px;
            height: 200px;
            background: white;
            position: relative;
            margin: 0;
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
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div class="canvas-container" id="canvas">
        <div class="text-element">
            ${text}
        </div>
    </div>
</body>
</html>
`;

async function autoExport() {
    let browser;
    try {
        console.log('🚀 启动浏览器...');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // 设置页面内容
        await page.setContent(htmlTemplate);
        
        // 等待页面渲染完成
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('📸 开始截图...');
        
        // 获取canvas元素
        const canvasElement = await page.$('#canvas');
        if (!canvasElement) {
            throw new Error('找不到canvas元素');
        }
        
        // 截图
        const screenshot = await canvasElement.screenshot({
            type: 'png',
            omitBackground: false
        });
        
        // 保存图片
        const timestamp = Date.now();
        const filename = `auto-export-${timestamp}.png`;
        const outputPath = join(__dirname, filename);
        
        writeFileSync(outputPath, screenshot);
        
        console.log('✅ 图片导出成功:', outputPath);
        
        // 分析图片信息
        const boundingBox = await canvasElement.boundingBox();
        console.log('📊 画布信息:');
        console.log('- 宽度:', boundingBox.width);
        console.log('- 高度:', boundingBox.height);
        console.log('- X坐标:', boundingBox.x);
        console.log('- Y坐标:', boundingBox.y);
        
        // 获取文字元素信息
        const textElementInfo = await page.evaluate(() => {
            const textEl = document.querySelector('.text-element');
            if (!textEl) return null;
            
            const rect = textEl.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(textEl);
            
            return {
                rect: {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height
                },
                style: {
                    display: computedStyle.display,
                    alignItems: computedStyle.alignItems,
                    justifyContent: computedStyle.justifyContent,
                    textAlign: computedStyle.textAlign,
                    backgroundColor: computedStyle.backgroundColor,
                    color: computedStyle.color,
                    fontSize: computedStyle.fontSize
                }
            };
        });
        
        if (textElementInfo) {
            console.log('📝 文字元素信息:');
            console.log('- 位置:', textElementInfo.rect);
            console.log('- 样式:', textElementInfo.style);
        }
        
    } catch (error) {
        console.error('❌ 导出失败:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// 运行导出
autoExport();