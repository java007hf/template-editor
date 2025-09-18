import React, { useState, useRef, useCallback, memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Download, RotateCcw, Save, Image as ImageIcon, Palette } from 'lucide-react'
import { templates } from './config/templates'
import { SimpleVisualEditor } from './SimpleVisualEditor'
import './App.css'

interface TemplateData {
  title: string
  content: string
  image: string | null
  selectedTemplate: string
  wordList: string
  qrCode: string | null
}

// Memoized 输入组件，防止焦点丢失
const MemoizedInput = memo(({ id, value, onChange, placeholder, className }: {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  className: string
}) => (
  <Input
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
  />
))

const MemoizedTextarea = memo(({ id, value, onChange, placeholder, rows, className }: {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder: string
  rows: number
  className: string
}) => (
  <Textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={className}
  />
))


function App() {
  const [templateData, setTemplateData] = useState<TemplateData>({
    title: '示例标题',
    content: '# 这里是正文内容\n\n您可以编辑这段文字来预览效果。支持 **Markdown** 格式：\n\n- 列表项目 1\n- 列表项目 2\n- 列表项目 3\n\n> 这是一个引用块\n\n`代码示例` 和 [链接示例](https://example.com)\n\n也支持 HTML 标签：<span style="background-color: #ffff00; border-radius: 8px; padding: 2px 6px; display: inline-flex; align-items: center; line-height: 1.2;">高亮文本</span>',
    image: null,
    selectedTemplate: 'template1',
    wordList: '示例\n标题\n正文\n内容\n编辑\n文字\n预览\n效果',
    qrCode: null
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const qrCodeInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTemplateData(prev => ({ ...prev, image: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleQrCodeUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTemplateData(prev => ({ ...prev, qrCode: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // 优化输入框事件处理函数 - 使用稳定的引用
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTemplateData(prev => ({ ...prev, title: value }))
  }, [])

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setTemplateData(prev => ({ ...prev, content: value }))
  }, [])

  const handleWordListChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setTemplateData(prev => ({ ...prev, wordList: value }))
  }, [])

  const handleTemplateChange = useCallback((value: string) => {
    setTemplateData(prev => ({ ...prev, selectedTemplate: value }))
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setTemplateData(prev => ({ ...prev, image: e.target?.result as string }))
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const exportAsImage = async () => {
    if (!previewRef.current) return
    
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        logging: false,
        width: previewRef.current.scrollWidth,
        height: previewRef.current.scrollHeight,
        imageTimeout: 15000
      })
      
      const link = document.createElement('a')
      link.download = `template-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出功能需要安装html2canvas库，请稍后再试')
    }
  }

  const resetForm = () => {
    setTemplateData({
      title: '示例标题',
      content: '# 这里是正文内容\n\n您可以编辑这段文字来预览效果。支持 **Markdown** 格式：\n\n- 列表项目 1\n- 列表项目 2\n- 列表项目 3\n\n> 这是一个引用块\n\n`代码示例` 和 [链接示例](https://example.com)\n\n也支持 HTML 标签：<span style="background-color: #ffff00; border-radius: 8px; padding: 2px 6px; display: inline-flex; align-items: center; line-height: 1.2;">高亮文本</span>',
      image: null,
      selectedTemplate: 'template1',
      wordList: '示例\n标题\n正文\n内容\n编辑\n文字\n预览\n效果',
      qrCode: null
    })
  }

  const renderTemplate = useCallback(() => {
    switch (templateData.selectedTemplate) {
      case 'template1':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-white pt-8 pb-8 pl-8 pr-0 rounded-lg shadow-lg min-h-[600px]">
            <div className="grid grid-cols-4 gap-1 h-full relative">
              {/* 左侧：标题+图片+正文 */}
              <div className="col-span-3 space-y-4 pr-8">
                <h1 className="text-2xl font-bold text-gray-800">{templateData.title}</h1>
                {templateData.image && (
                  <div className="w-full flex justify-center">
                    <img 
                      src={templateData.image} 
                      alt="上传的图片" 
                      className="max-w-full h-auto rounded-lg shadow-md"
                      style={{ maxHeight: '400px', width: 'auto', objectFit: 'contain' }}
                    />
                  </div>
                )}
                <div className="prose text-gray-600 leading-relaxed max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {templateData.content}
                  </ReactMarkdown>
                </div>
              </div>
              
              {/* 蓝色虚线分隔线 */}
              <div className="absolute left-3/4 top-0 bottom-0 w-px border-l-2 border-dashed border-blue-400 -ml-4"></div>
              
              {/* 右侧：单词列表 */}
              <div className="space-y-4 pl-1 pr-0">
                {/* 二维码图片 - 自适应尺寸，更紧凑 */}
                {templateData.qrCode && (
                  <div className="text-center mb-2">
                    <img src={templateData.qrCode} alt="二维码" className="max-w-full h-auto mx-auto rounded-lg shadow-sm" style={{ maxHeight: '120px', objectFit: 'contain' }} />
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg" style={{ width: '100%' }}>
                  <div className="space-y-1" style={{ width: '100%' }}>
                    {templateData.wordList.split('\n').filter(word => word.trim()).map((word, index) => (
                      <div 
                        key={index} 
                        className={`px-1 py-0.5 rounded-md text-white text-[10px] font-medium shadow-sm ${
                          index % 2 === 0 ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                        style={{ 
                          textAlign: 'center', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: '100%',
                          lineHeight: '1.2',
                          minHeight: '20px'
                        }}
                      >
                        {word.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'template2':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg min-h-[600px] border border-gray-200">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{templateData.title}</h1>
                <div className="w-16 h-1 bg-blue-500 mx-auto"></div>
              </div>
              
              {templateData.image && (
                <div className="flex justify-center">
                  <img src={templateData.image} alt="插图" className="max-w-md h-auto rounded-lg shadow-md" style={{ maxHeight: '400px', width: 'auto', objectFit: 'contain' }} />
                </div>
              )}
              
              <div className="prose prose-lg text-gray-700 leading-relaxed max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {templateData.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )
      
      case 'template3':
        return (
          <div className="bg-gradient-to-b from-gray-50 to-white p-8 rounded-lg shadow-lg min-h-[600px]">
            <div className="max-w-4xl mx-auto">
              <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{templateData.title}</h1>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-0.5 bg-blue-500"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-8 h-0.5 bg-blue-500"></div>
                </div>
              </header>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                    <div className="prose text-gray-700 leading-relaxed max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {templateData.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {templateData.image && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <img src={templateData.image} alt="配图" className="w-full h-auto rounded-lg" style={{ maxHeight: '300px', width: 'auto', objectFit: 'contain' }} />
                      <p className="text-sm text-gray-500 mt-2 text-center">配图说明</p>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">要点总结</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 核心概念理解</li>
                      <li>• 实践应用方法</li>
                      <li>• 深入学习建议</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      

      default:
        return <div>模板加载中...</div>
    }
  }, [templateData])

  // 简单编辑器组件 - 使用 memo 防止不必要的重新渲染
  const SimpleEditor = useMemo(() => (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧编辑区域 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                模板选择
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={templateData.selectedTemplate} 
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择模板" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>内容编辑</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">标题</Label>
                <MemoizedInput
                  id="title"
                  value={templateData.title}
                  onChange={handleTitleChange}
                  placeholder="请输入标题"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="content">正文内容</Label>
                <MemoizedTextarea
                  id="content"
                  value={templateData.content}
                  onChange={handleContentChange}
                  placeholder="请输入正文内容，支持 Markdown 格式和 HTML 标签（如 **粗体**、<span style='color:red'>HTML样式</span>）"
                  rows={8}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="wordList">重点单词列表</Label>
                <MemoizedTextarea
                  id="wordList"
                  value={templateData.wordList}
                  onChange={handleWordListChange}
                  placeholder="请输入重点单词，每行一个单词"
                  rows={6}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  提示：每行输入一个单词，这些单词将显示在双栏布局模板的右侧
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>图片上传</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {templateData.image ? (
                  <div className="space-y-2">
                    <img src={templateData.image} alt="预览" className="max-w-full h-auto mx-auto rounded" style={{ maxHeight: '200px', width: 'auto', objectFit: 'contain' }} />
                    <p className="text-sm text-gray-600">点击或拖拽更换图片</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-600">点击上传或拖拽图片到此处</p>
                    <p className="text-sm text-gray-400">支持 JPG、PNG 格式</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>二维码上传</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => qrCodeInputRef.current?.click()}
              >
                {templateData.qrCode ? (
                  <div className="space-y-2">
                    <img src={templateData.qrCode} alt="二维码预览" className="max-w-full h-auto mx-auto rounded" style={{ maxHeight: '300px', width: 'auto', objectFit: 'contain' }} />
                    <p className="text-sm text-gray-600">点击更换二维码</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-600">点击上传二维码图片</p>
                    <p className="text-sm text-gray-400">用于双栏布局模板右侧显示</p>
                  </div>
                )}
              </div>
              <input
                ref={qrCodeInputRef}
                type="file"
                accept="image/*"
                onChange={handleQrCodeUpload}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>

        {/* 右侧预览区域 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>实时预览</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={previewRef}
                className="bg-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
                style={{ minHeight: '600px' }}
              >
                {renderTemplate()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ), [templateData, handleTitleChange, handleContentChange, handleWordListChange, handleTemplateChange, renderTemplate])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部工具栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">模板编辑器</h1>
            <div className="flex items-center space-x-3">
              <Button onClick={resetForm} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                重置
              </Button>
              <Button onClick={() => {}} variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
              <Button onClick={exportAsImage} className="bg-blue-600 hover:bg-blue-700" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出PNG
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 - 选项卡界面 */}
      <div className="flex-1">
        <Tabs defaultValue="simple" className="w-full">
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-transparent p-0">
                <TabsTrigger 
                  value="simple" 
                  className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none border-b-2 border-transparent"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>简单编辑器</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="visual" 
                  className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none border-b-2 border-transparent"
                >
                  <Palette className="w-4 h-4" />
                  <span>可视化编辑器</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="simple" className="m-0">
            {SimpleEditor}
          </TabsContent>

          <TabsContent value="visual" className="m-0 h-full">
            <div className="h-[calc(100vh-120px)]">
              <SimpleVisualEditor />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App