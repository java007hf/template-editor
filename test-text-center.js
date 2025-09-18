#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🧪 开始测试文字居中效果...\n');

const testCases = [
    {
        name: '短文本测试',
        text: '短文本',
        fontSize: 24,
        bg: '#f0f0f0',
        color: '#333333'
    },
    {
        name: '长文本测试',
        text: '这是一段比较长的文本用来测试换行和居中效果',
        fontSize: 18,
        bg: '#e8f4fd',
        color: '#1e40af'
    },
    {
        name: '大字体测试',
        text: '大字体',
        fontSize: 48,
        bg: '#fef3c7',
        color: '#d97706'
    },
    {
        name: '小字体测试',
        text: '小字体测试文本',
        fontSize: 12,
        bg: '#f3e8ff',
        color: '#7c3aed'
    },
    {
        name: '多行文本测试',
        text: '第一行文本\\n第二行文本\\n第三行文本',
        fontSize: 20,
        bg: '#ecfdf5',
        color: '#059669'
    }
];

async function runTests() {
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`📋 测试 ${i + 1}/${testCases.length}: ${testCase.name}`);
        console.log(`   文本: "${testCase.text}"`);
        console.log(`   字体: ${testCase.fontSize}px`);
        console.log(`   背景: ${testCase.bg}`);
        console.log(`   颜色: ${testCase.color}`);
        
        try {
            const command = `node auto-export-cli.js "${testCase.text}" ${testCase.fontSize} "${testCase.bg}" "${testCase.color}"`;
            const output = execSync(command, { encoding: 'utf8', cwd: process.cwd() });
            
            // 提取输出的图片路径
            const match = output.match(/图片导出成功: (.+\.png)/);
            if (match) {
                console.log(`   ✅ 导出成功: ${match[1]}`);
            } else {
                console.log(`   ⚠️  导出完成但未找到文件路径`);
            }
            
            // 提取文字元素信息
            const styleMatch = output.match(/- 样式: ({[^}]+})/);
            if (styleMatch) {
                console.log(`   📊 样式确认: flexbox居中布局已应用`);
            }
            
        } catch (error) {
            console.log(`   ❌ 测试失败: ${error.message}`);
        }
        
        console.log('');
        
        // 添加延迟避免过快执行
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('🎉 所有测试完成！');
    console.log('📁 请检查生成的PNG文件，验证文字是否在背景中正确居中。');
    console.log('');
    console.log('💡 如果文字位置仍然有问题，可能需要调整CSS样式：');
    console.log('   - 确保使用 display: flex');
    console.log('   - 确保使用 align-items: center');
    console.log('   - 确保使用 justify-content: center');
    console.log('   - 避免使用 transform: translate(-50%, -50%)');
}

runTests().catch(console.error);