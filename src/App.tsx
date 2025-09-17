import { useState, useRef, useCallback, memo, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Download, RotateCcw, Save, Image as ImageIcon, Palette } from 'lucide-react'
import template1 from './assets/img_WiZDbk3GDo8GjNxi0iVcFrLMnCa.png'
import template2 from './assets/img_E1xMbpx29oOqn2x8ayDcpwpunLe.png'
import template3 from './assets/img_UkyAbWiOOo8BwpxjbCicagd0n7g.png'
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

const templates = [
  {
    id: 'template1',
    name: '双栏布局模板',
    description: '左侧关键词，右侧内容和图片，蓝白配色',
    preview: template1
  },
  {
    id: 'template2', 
    name: '单栏布局模板',
    description: '标题+正文+插图，简洁教育风格',
    preview: template2
  },
  {
    id: 'template3',
    name: '混合布局模板', 
    description: '支持多段落和图片组合',
    preview: template3
  },
  {
    id: 'template4',
    name: '三栏新闻模板',
    description: '适合新闻网站和信息展示的三栏布局',
    preview: template1
  },
  {
    id: 'template5',
    name: '卡片展示模板',
    description: '电商产品展示卡片布局，适合产品介绍',
    preview: template2
  },
  {
    id: 'template6',
    name: '仪表盘模板',
    description: '数据监控仪表盘布局，适合数据展示',
    preview: template3
  },
  {
    id: 'template7',
    name: '杂志排版模板',
    description: '类似杂志的复杂排版布局，适合文章展示',
    preview: template1
  },
  {
    id: 'template8',
    name: '侧边栏模板',
    description: '带侧边栏的管理后台布局',
    preview: template2
  },
  {
    id: 'template9',
    name: '头尾布局模板',
    description: '经典的页头页尾结构，适合官网',
    preview: template3
  },
  {
    id: 'template10',
    name: '瀑布流模板',
    description: '不规则高度的图片展示，适合相册',
    preview: template1
  },
  {
    id: 'template11',
    name: '社交媒体模板',
    description: '适合社交媒体的正方形布局',
    preview: template2
  },
  {
    id: 'template12',
    name: '横幅广告模板',
    description: '网站横幅广告模板，适合宣传',
    preview: template3
  }
]

function App() {
  const [templateData, setTemplateData] = useState<TemplateData>({
    title: '示例标题',
    content: '这里是正文内容，您可以编辑这段文字来预览效果。',
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
        useCORS: true
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
      content: '这里是正文内容，您可以编辑这段文字来预览效果。',
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
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg shadow-lg min-h-[600px]">
            <div className="grid grid-cols-3 gap-8 h-full">
              {/* 左侧：标题+图片+正文 */}
              <div className="col-span-2 space-y-4">
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
                <div className="prose text-gray-600 leading-relaxed">
                  {templateData.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">{paragraph}</p>
                  ))}
                </div>
              </div>
              {/* 右侧：单词列表 */}
              <div className="space-y-4">
                {/* 二维码图片 - 自适应尺寸，更紧凑 */}
                {templateData.qrCode && (
                  <div className="text-center mb-2">
                    <img src={templateData.qrCode} alt="二维码" className="max-w-full h-auto mx-auto rounded-lg shadow-sm" style={{ maxHeight: '120px', objectFit: 'contain' }} />
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="space-y-1">
                    {templateData.wordList.split('\n').filter(word => word.trim()).map((word, index) => (
                      <div 
                        key={index} 
                        className={`px-1 py-0.5 rounded-md text-white text-[10px] font-medium text-center shadow-sm ${
                          index % 2 === 0 ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
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
              
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                {templateData.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-justify">{paragraph}</p>
                ))}
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
                  {templateData.content.split('\n').map((paragraph, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                      <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                    </div>
                  ))}
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
      
      case 'template4':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg min-h-[600px]">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-2">新闻要点</h2>
                <div className="text-sm text-gray-600 space-y-2">
                  {templateData.content.split('\n').slice(0, 3).map((line, index) => (
                    <p key={index} className="bg-gray-50 p-2 rounded">{line}</p>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-xl font-bold text-gray-800">{templateData.title}</h1>
                <div className="text-gray-600">
                  {templateData.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2">{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {templateData.image && (
                  <img src={templateData.image} alt="新闻图片" className="w-full h-auto rounded" style={{ maxHeight: '200px', width: 'auto', objectFit: 'contain' }} />
                )}
                <div className="bg-blue-50 p-3 rounded">
                  <h3 className="font-semibold text-blue-800 mb-2">相关链接</h3>
                  <div className="text-sm text-blue-600 space-y-1">
                    <p>• 更多详情</p>
                    <p>• 相关报道</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'template5':
        return (
          <div className="bg-gray-50 p-8 rounded-lg shadow-lg min-h-[600px]">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">{templateData.title}</h1>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                {templateData.image && (
                  <img src={templateData.image} alt="产品图片" className="w-full h-auto rounded-lg mb-4" style={{ maxHeight: '300px', width: 'auto', objectFit: 'contain' }} />
                )}
                <h3 className="font-semibold text-gray-800 mb-2">产品特色</h3>
                <p className="text-gray-600 text-sm">{templateData.content}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-800 mb-4">产品详情</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between border-b pb-1">
                    <span>规格:</span>
                    <span>标准版</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>材质:</span>
                    <span>优质材料</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>保修:</span>
                    <span>1年质保</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'template6':
        return (
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg min-h-[600px] text-white">
            <h1 className="text-2xl font-bold mb-6">{templateData.title}</h1>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-600 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm">完成率</div>
              </div>
              <div className="bg-green-600 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-sm">用户数</div>
              </div>
              <div className="bg-yellow-600 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">56</div>
                <div className="text-sm">项目数</div>
              </div>
              <div className="bg-red-600 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm">警告</div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">系统状态</h3>
              <p className="text-gray-300 text-sm">{templateData.content}</p>
            </div>
          </div>
        )

      case 'template7':
      case 'template8':
      case 'template9':
      case 'template10':
      case 'template11':
      case 'template12':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg min-h-[600px] border-2 border-dashed border-gray-300">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">{templateData.title}</h1>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-blue-800 font-medium mb-2">
                  {templates.find(t => t.id === templateData.selectedTemplate)?.name}
                </p>
                <p className="text-blue-600 text-sm">
                  {templates.find(t => t.id === templateData.selectedTemplate)?.description}
                </p>
              </div>
              {templateData.image && (
                <img src={templateData.image} alt="模板图片" className="max-w-md h-auto mx-auto rounded-lg" style={{ maxHeight: '300px', width: 'auto', objectFit: 'contain' }} />
              )}
              <div className="text-gray-600 text-left max-w-2xl mx-auto">
                {templateData.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))}
              </div>
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                此模板正在开发中，敬请期待更丰富的布局效果
              </div>
            </div>
          </div>
        )

      default:
        return <div>模板加载中...</div>
    }
  }, [templateData])

  // 简单编辑器组件
  const SimpleEditor = () => (
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
                <Input
                  id="title"
                  value={templateData.title}
                  onChange={handleTitleChange}
                  placeholder="请输入标题"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="content">正文内容</Label>
                <Textarea
                  id="content"
                  value={templateData.content}
                  onChange={handleContentChange}
                  placeholder="请输入正文内容，支持多行文本"
                  rows={8}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="wordList">重点单词列表</Label>
                <Textarea
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
  )

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
            <SimpleEditor />
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