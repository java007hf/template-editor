import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Folder, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Trash2, 
  Edit, 
  Copy,
  Star,
  Clock,
  Tag
} from 'lucide-react'
import { useEditor } from '../../contexts/EditorContext'
import { TemplateConfig } from '../../types/editor'

export function TemplateManager() {
  const { state, dispatch } = useEditor()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 模拟的模板库数据（实际应用中应该从本地存储或服务器获取）
  const [savedTemplates, setSavedTemplates] = useState<TemplateConfig[]>([
    {
      ...state.currentTemplate,
      id: 'template-1',
      name: '教育海报模板',
      description: '适用于教育类宣传海报',
      layout: { type: 'single', columns: 1, rows: 1, gap: 16, padding: 20 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['教育', '海报', '蓝色']
      }
    },
    {
      ...state.currentTemplate,
      id: 'template-2',
      name: '商务名片模板',
      description: '简洁的商务名片设计',
      layout: { type: 'double', columns: 2, rows: 1, gap: 12, padding: 16 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['商务', '名片', '简洁']
      }
    },
    {
      ...state.currentTemplate,
      id: 'template-3',
      name: '三栏新闻布局',
      description: '适合新闻网站和信息展示',
      layout: { type: 'three-column', columns: 3, rows: 1, gap: 16, padding: 20 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['新闻', '三栏', '信息']
      }
    },
    {
      ...state.currentTemplate,
      id: 'template-4',
      name: '产品卡片展示',
      description: '电商产品展示卡片布局',
      layout: { type: 'card', columns: 3, rows: 2, gap: 20, padding: 24 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['电商', '产品', '卡片']
      }
    },
    {
      ...state.currentTemplate,
      id: 'template-5',
      name: '仪表盘模板',
      description: '数据监控仪表盘布局',
      layout: { type: 'dashboard', columns: 4, rows: 3, gap: 12, padding: 16 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['仪表盘', '数据', '监控']
      }
    },
    {
      ...state.currentTemplate,
      id: 'template-6',
      name: '杂志排版',
      description: '类似杂志的复杂排版布局',
      layout: { type: 'magazine', columns: 2, rows: 3, gap: 16, padding: 20 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['杂志', '排版', '复杂']
      }
    },
    {
      ...state.currentTemplate,
      id: 'template-7',
      name: '侧边栏布局',
      description: '带侧边栏的管理后台布局',
      layout: { type: 'sidebar', columns: 2, rows: 1, gap: 0, padding: 0 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['后台', '侧边栏', '管理']
      }
    },
    {
      ...state.currentTemplate,
      id: 'template-8',
      name: '头尾布局',
      description: '经典的页头页尾结构',
      layout: { type: 'header-footer', columns: 1, rows: 3, gap: 0, padding: 0 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['经典', '页头', '页尾']
      }
    },
    {
      ...state.currentTemplate,
      id: 'template-9',
      name: '瀑布流相册',
      description: '不规则高度的图片展示',
      layout: { type: 'masonry', columns: 3, rows: 4, gap: 8, padding: 16 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['相册', '瀑布流', '图片']
      }
    },
    {
      ...state.currentTemplate,
      id: 'template-10',
      name: '混合布局',
      description: '结合多种布局方式的复杂页面',
      layout: { type: 'mixed', columns: 4, rows: 3, gap: 16, padding: 20 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['混合', '复杂', '多样']
      }
    },
    {
      ...state.currentTemplate,
      id: 'template-11',
      name: '社交媒体帖子',
      description: '适合社交媒体的正方形布局',
      layout: { type: 'single', columns: 1, rows: 1, gap: 0, padding: 20 },
      canvasSize: { width: 1080, height: 1080 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['社交', '媒体', '正方形']
      }
    },
    {
      ...state.currentTemplate,
      id: 'template-12',
      name: '横幅广告',
      description: '网站横幅广告模板',
      layout: { type: 'single', columns: 1, rows: 1, gap: 0, padding: 16 },
      canvasSize: { width: 1200, height: 400 },
      metadata: {
        ...state.currentTemplate.metadata,
        tags: ['广告', '横幅', '网站']
      }
    }
  ])

  // 预设模板分类
  const categories = [
    { id: 'all', name: '全部', count: savedTemplates.length },
    { id: 'recent', name: '最近使用', count: 5 },
    { id: 'favorites', name: '收藏', count: 3 },
    { id: 'education', name: '教育', count: 1 },
    { id: 'business', name: '商务', count: 1 },
    { id: 'social', name: '社交媒体', count: 2 },
    { id: 'ecommerce', name: '电商', count: 1 },
    { id: 'dashboard', name: '仪表盘', count: 1 },
    { id: 'news', name: '新闻', count: 1 },
    { id: 'magazine', name: '杂志', count: 1 },
    { id: 'admin', name: '后台管理', count: 1 }
  ]

  // 过滤模板
  const filteredTemplates = savedTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
                           template.metadata.tags.some(tag => {
                             const tagLower = tag.toLowerCase()
                             switch(selectedCategory) {
                               case 'education': return tagLower === '教育'
                               case 'business': return tagLower === '商务'
                               case 'social': return tagLower === '社交' || tagLower === '媒体'
                               case 'ecommerce': return tagLower === '电商' || tagLower === '产品'
                               case 'dashboard': return tagLower === '仪表盘' || tagLower === '数据'
                               case 'news': return tagLower === '新闻' || tagLower === '信息'
                               case 'magazine': return tagLower === '杂志' || tagLower === '排版'
                               case 'admin': return tagLower === '后台' || tagLower === '管理'
                               default: return tagLower === selectedCategory
                             }
                           })
    
    return matchesSearch && matchesCategory
  })

  // 保存当前模板
  const handleSaveCurrentTemplate = () => {
    const templateName = prompt('请输入模板名称:', state.currentTemplate.name)
    if (templateName) {
      const newTemplate: TemplateConfig = {
        ...state.currentTemplate,
        id: `template-${Date.now()}`,
        name: templateName,
        metadata: {
          ...state.currentTemplate.metadata,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      setSavedTemplates(prev => [...prev, newTemplate])
      alert('模板保存成功！')
    }
  }

  // 加载模板
  const handleLoadTemplate = (template: TemplateConfig) => {
    dispatch({ type: 'SET_TEMPLATE', payload: template })
    setIsOpen(false)
  }

  // 删除模板
  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('确定要删除这个模板吗？')) {
      setSavedTemplates(prev => prev.filter(t => t.id !== templateId))
    }
  }

  // 复制模板
  const handleDuplicateTemplate = (template: TemplateConfig) => {
    const newTemplate: TemplateConfig = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} 副本`,
      metadata: {
        ...template.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
    setSavedTemplates(prev => [...prev, newTemplate])
  }

  // 导出模板
  const handleExportTemplate = (template: TemplateConfig) => {
    const templateData = JSON.stringify(template, null, 2)
    const blob = new Blob([templateData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${template.name}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Folder className="w-4 h-4 mr-1" />
          模板库
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>模板管理</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveCurrentTemplate}
            >
              <Plus className="w-4 h-4 mr-2" />
              保存当前模板
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[600px]">
          {/* 左侧分类栏 */}
          <div className="w-48 border-r pr-4">
            <div className="space-y-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* 右侧内容区 */}
          <div className="flex-1 pl-4">
            {/* 搜索栏 */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索模板..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 模板网格 */}
            <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[500px]">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    {/* 模板预览缩略图 */}
                    <div className="aspect-video bg-gray-100 rounded border mb-2 flex items-center justify-center">
                      <span className="text-xs text-gray-500">预览</span>
                    </div>
                    <CardTitle className="text-sm truncate">{template.name}</CardTitle>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* 标签 */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.metadata.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.metadata.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.metadata.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadTemplate(template)}
                        className="flex-1 h-7 text-xs"
                      >
                        使用
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateTemplate(template)}
                        className="h-7 px-2"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportTemplate(template)}
                        className="h-7 px-2"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="h-7 px-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* 元数据 */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(template.metadata.updatedAt).toLocaleDateString()}
                      </span>
                      <span>{template.elements.length} 元素</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 空状态 */}
            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">没有找到匹配的模板</p>
                <p className="text-sm text-gray-500">
                  {searchTerm ? '尝试使用其他关键词搜索' : '开始创建您的第一个模板'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TemplateManager