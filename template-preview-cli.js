#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 增强的命令行参数解析
function parseArgs() {
    const args = process.argv.slice(2);
    
    // 处理转义字符的函数
    function processEscapeSequences(str) {
        return str
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\r/g, '\r')
            .replace(/\\\\/g, '\\');
    }
    
    // 如果没有参数，返回默认值
    if (args.length === 0) {
        return {
            title: '示例标题',
            content: '这里是正文内容。您可以编辑这段文字来预览效果。支持基本格式。',
            wordList: '示例\n标题\n正文\n内容\n编辑\n文字\n预览\n效果',
            templateId: 'template1'
        };
    }
    
    return {
        title: processEscapeSequences(args[0] || '示例标题'),
        content: processEscapeSequences(args[1] || '这里是正文内容。您可以编辑这段文字来预览效果。支持基本格式。'),
        wordList: processEscapeSequences(args[2] || '示例\n标题\n正文\n内容\n编辑\n文字\n预览\n效果'),
        templateId: args[3] || 'template1'
    };
}

const { title, content, wordList, templateId } = parseArgs();

console.log('双栏布局模板导出参数:');
console.log('- 标题:', title);
console.log('- 内容:', content.substring(0, 50) + '...');
console.log('- 单词列表:', wordList.split('\n').join(', '));
console.log('- 模板ID:', templateId);

// 如果内容包含复杂HTML，提供使用提示
if (content.includes('<span') && content.includes('style=')) {
    console.log('\n💡 提示: 检测到HTML样式标签');
    console.log('   如果遇到引号问题，请使用以下格式:');
    console.log('   - 外层使用单引号: \'包含<span style="...">文本</span>\'');
    console.log('   - 或者转义双引号: "包含<span style=\\"...\\">文本</span>"');
}

// 转义HTML字符
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// 增强的Markdown解析，支持HTML标签
function parseMarkdownWithHtml(text) {
    // 先保护HTML标签，避免被Markdown处理破坏
    const htmlTags = [];
    let htmlIndex = 0;
    
    // 提取并保护HTML标签
    text = text.replace(/<[^>]+>/g, (match) => {
        const placeholder = `__HTML_TAG_${htmlIndex}__`;
        htmlTags[htmlIndex] = match;
        htmlIndex++;
        return placeholder;
    });
    
    // 对非HTML部分进行转义，防止XSS
    text = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // 处理Markdown语法
    text = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code style="background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875rem;">$1</code>')
        .replace(/^# (.*$)/gm, '<h1 style="font-size: 1.875rem; margin-bottom: 1rem; font-weight: 600;">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 style="font-size: 1.5rem; margin-bottom: 0.75rem; font-weight: 600;">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 600;">$1</h3>')
        .replace(/^- (.*$)/gm, '<li style="margin-bottom: 0.25rem;">$1</li>')
        .replace(/^> (.*$)/gm, '<blockquote style="border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #6b7280;">$1</blockquote>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #3b82f6; text-decoration: underline;">$1</a>')
        .replace(/\n/g, '<br>');
    
    // 恢复HTML标签
    for (let i = 0; i < htmlTags.length; i++) {
        text = text.replace(`__HTML_TAG_${i}__`, htmlTags[i]);
    }
    
    return text;
}

// 创建HTML模板
const htmlTemplate = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template Preview Export</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: #f3f4f6;
        }
        .preview-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .template-content {
            min-height: 600px;
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="template-content" id="template-preview">
            ${renderTemplateContent()}
        </div>
    </div>
</body>
</html>
`;

function renderTemplateContent() {
    const words = wordList.split('\n').filter(word => word.trim());
    const wordElements = words.map((word, index) => {
        const bgColor = index % 2 === 0 ? 'bg-blue-500' : 'bg-yellow-500';
        return `<div class="px-1 py-0.5 rounded-md text-white text-[10px] font-medium shadow-sm ${bgColor}" style="text-align: center; display: flex; align-items: center; justify-content: center; width: 100%; line-height: 1.2; min-height: 20px;">
            ${escapeHtml(word.trim())}
        </div>`;
    }).join('');

    switch (templateId) {
        case 'template1':
            return `
                <div class="bg-gradient-to-br from-blue-50 to-white pt-8 pb-8 pl-8 pr-0 rounded-lg shadow-lg min-h-[600px]">
                    <div class="grid grid-cols-4 gap-1 h-full relative">
                        <!-- 左侧：标题+正文 -->
                        <div class="col-span-3 space-y-4 pr-8">
                            <h1 class="text-2xl font-bold text-gray-800">${parseMarkdownWithHtml(title)}</h1>
                            <div class="text-gray-600 leading-relaxed">
                                ${parseMarkdownWithHtml(content)}
                            </div>
                        </div>
                        
                        <!-- 蓝色虚线分隔线 -->
                        <div class="absolute left-3/4 top-0 bottom-0 w-px border-l-2 border-dashed border-blue-400 -ml-4"></div>
                        
                        <!-- 右侧：单词列表 -->
                        <div class="space-y-4 pl-1 pr-0">
                            <div class="bg-gray-50 p-3 rounded-lg" style="width: 100%">
                                <div class="space-y-1" style="width: 100%">
                                    ${wordElements}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 'template2':
            return `
                <div class="bg-white p-8 rounded-lg shadow-lg min-h-[600px] border border-gray-200">
                    <div class="max-w-2xl mx-auto space-y-6">
                        <div class="text-center border-b pb-4">
                            <h1 class="text-3xl font-bold text-gray-800 mb-2">${parseMarkdownWithHtml(title)}</h1>
                            <div class="w-16 h-1 bg-blue-500 mx-auto"></div>
                        </div>
                        <div class="text-gray-700 leading-relaxed">
                            ${parseMarkdownWithHtml(content)}
                        </div>
                    </div>
                </div>
            `;

        case 'template3':
            return `
                <div class="bg-gradient-to-b from-gray-50 to-white p-8 rounded-lg shadow-lg min-h-[600px]">
                    <div class="max-w-4xl mx-auto">
                        <header class="text-center mb-8">
                            <h1 class="text-4xl font-bold text-gray-800 mb-4">${parseMarkdownWithHtml(title)}</h1>
                            <div class="flex items-center justify-center space-x-2">
                                <div class="w-8 h-0.5 bg-blue-500"></div>
                                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div class="w-8 h-0.5 bg-blue-500"></div>
                            </div>
                        </header>
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div class="lg:col-span-2 space-y-4">
                                <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                                    <div class="text-gray-700 leading-relaxed">
                                        ${parseMarkdownWithHtml(content)}
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <div class="bg-blue-50 p-4 rounded-lg">
                                    <h3 class="font-semibold text-blue-800 mb-2">要点总结</h3>
                                    <ul class="text-sm text-blue-700 space-y-1">
                                        <li>• 核心概念理解</li>
                                        <li>• 实践应用方法</li>
                                        <li>• 深入学习建议</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        default:
            return `
                <div class="bg-white p-8 rounded-lg shadow-lg min-h-[600px] border-2 border-dashed border-gray-300">
                    <div class="text-center space-y-4">
                        <h1 class="text-2xl font-bold text-gray-800">${parseMarkdownWithHtml(title)}</h1>
                        <div class="text-gray-600 text-left max-w-2xl mx-auto">
                            ${parseMarkdownWithHtml(content)}
                        </div>
                        <div class="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                            模板 ${templateId} 预览
                        </div>
                    </div>
                </div>
            `;
    }
}

async function exportTemplatePreview() {
    let browser;
    try {
        console.log('🚀 启动浏览器...');
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run'
            ]
        });
        
        const page = await browser.newPage();
        
        // 设置高分辨率视口
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 3  // 3倍像素密度，提高清晰度
        });
        
        // 设置页面内容
        await page.setContent(htmlTemplate);
        
        // 等待页面渲染完成
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('📸 开始截图...');
        
        // 获取预览容器元素
        const previewElement = await page.$('.preview-container');
        if (!previewElement) {
            throw new Error('找不到预览容器元素');
        }
        
        // 截图
        const screenshot = await previewElement.screenshot({
            type: 'png',
            omitBackground: false
        });
        
        // 保存图片
        const timestamp = Date.now();
        const filename = `template-preview-${templateId}-${timestamp}.png`;
        const outputPath = join(__dirname, filename);
        
        writeFileSync(outputPath, screenshot);
        
        console.log('✅ 模板预览导出成功:', outputPath);
        
        // 分析预览信息
        const boundingBox = await previewElement.boundingBox();
        console.log('📊 预览容器信息:');
        console.log('- 宽度:', boundingBox.width);
        console.log('- 高度:', boundingBox.height);
        
    } catch (error) {
        console.error('❌ 导出失败:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// 运行导出
exportTemplatePreview();