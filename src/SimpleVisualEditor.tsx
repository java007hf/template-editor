import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { 
  Type, 
  Image, 
  Square, 
  Trash2, 
  Copy, 
  Palette,
  Save,
  FolderOpen,
  Download,
  Plus,
  Edit3
} from 'lucide-react'

// 简化的元素类型
interface SimpleElement {
  id: string
  type: 'text' | 'image' | 'shape'
  content: string
  style: {
    x: number
    y: number
    width: number
    height: number
    backgroundColor: string
    color: string
    fontSize: number
    borderRadius: number
  }
}

// 模板类型
interface Template {
  id: string
  name: string
  elements: SimpleElement[]
  canvasSize: { width: number; height: number }
  createdAt: Date
  updatedAt: Date
}

// 预设元素模板
const elementTemplates = {
  text: {
    type: 'text' as const,
    content: '新文本',
    style: {
      x: 50,
      y: 50,
      width: 200,
      height: 40,
      backgroundColor: 'transparent',
      color: '#000000',
      fontSize: 16,
      borderRadius: 0
    }
  },
  image: {
    type: 'image' as const,
    content: '',
    style: {
      x: 50,
      y: 100,
      width: 200,
      height: 150,
      backgroundColor: '#f3f4f6',
      color: '#000000',
      fontSize: 14,
      borderRadius: 8
    }
  },
  shape: {
    type: 'shape' as const,
    content: '',
    style: {
      x: 50,
      y: 200,
      width: 150,
      height: 100,
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      fontSize: 14,
      borderRadius: 8
    }
  }
}

export function SimpleVisualEditor() {
  const [elements, setElements] = useState<SimpleElement[]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [canvasSize] = useState({ width: 800, height: 600 })
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [templates, setTemplates] = useState<Template[]>([])
  const [currentTemplateName, setCurrentTemplateName] = useState<string>('未命名模板')
  const [showTemplateManager, setShowTemplateManager] = useState(false)

  // 添加元素
  const addElement = (type: keyof typeof elementTemplates) => {
    const template = elementTemplates[type]
    const newElement: SimpleElement = {
      id: `element-${Date.now()}`,
      ...template,
      style: {
        ...template.style,
        x: template.style.x + Math.random() * 100,
        y: template.style.y + Math.random() * 100
      }
    }
    setElements(prev => [...prev, newElement])
    setSelectedElementId(newElement.id)
  }

  // 删除元素
  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id))
    if (selectedElementId === id) {
      setSelectedElementId(null)
    }
  }

  // 更新元素
  const updateElement = (id: string, updates: Partial<SimpleElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ))
  }

  // 获取选中的元素
  const selectedElement = elements.find(el => el.id === selectedElementId)

  // 模板管理功能
  const saveTemplate = () => {
    const template: Template = {
      id: `template-${Date.now()}`,
      name: currentTemplateName,
      elements: [...elements],
      canvasSize,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const savedTemplates = JSON.parse(localStorage.getItem('visual-editor-templates') || '[]')
    const updatedTemplates = [...savedTemplates, template]
    localStorage.setItem('visual-editor-templates', JSON.stringify(updatedTemplates))
    setTemplates(updatedTemplates)
    alert(`模板 "${currentTemplateName}" 保存成功！`)
  }

  const loadTemplate = (template: Template) => {
    setElements(template.elements)
    setCurrentTemplateName(template.name)
    setSelectedElementId(null)
    setShowTemplateManager(false)
    alert(`模板 "${template.name}" 加载成功！`)
  }

  const deleteTemplate = (templateId: string) => {
    if (confirm('确定要删除这个模板吗？')) {
      const savedTemplates = JSON.parse(localStorage.getItem('visual-editor-templates') || '[]')
      const updatedTemplates = savedTemplates.filter((t: Template) => t.id !== templateId)
      localStorage.setItem('visual-editor-templates', JSON.stringify(updatedTemplates))
      setTemplates(updatedTemplates)
      alert('模板删除成功！')
    }
  }

  const renameTemplate = (templateId: string, newName: string) => {
    const savedTemplates = JSON.parse(localStorage.getItem('visual-editor-templates') || '[]')
    const updatedTemplates = savedTemplates.map((t: Template) => 
      t.id === templateId ? { ...t, name: newName, updatedAt: new Date() } : t
    )
    localStorage.setItem('visual-editor-templates', JSON.stringify(updatedTemplates))
    setTemplates(updatedTemplates)
  }

  const loadTemplatesFromStorage = () => {
    const savedTemplates = JSON.parse(localStorage.getItem('visual-editor-templates') || '[]')
    setTemplates(savedTemplates)
    setShowTemplateManager(true)
  }

  const newTemplate = () => {
    if (elements.length > 0 && !confirm('创建新模板将清空当前内容，确定继续吗？')) {
      return
    }
    setElements([])
    setSelectedElementId(null)
    setCurrentTemplateName('未命名模板')
  }

  const exportAsImage = async () => {
    try {
      const canvas = document.querySelector('.canvas-container')
      if (!canvas) {
        alert('画布未找到')
        return
      }
      
      const html2canvas = (await import('html2canvas')).default
      const canvasElement = await html2canvas(canvas as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      })
      
      const link = document.createElement('a')
      link.download = `${currentTemplateName}-${Date.now()}.png`
      link.href = canvasElement.toDataURL()
      link.click()
      alert('图片导出成功！')
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请稍后再试')
    }
  }

  const exportAsJSON = () => {
    const template = {
      name: currentTemplateName,
      elements,
      canvasSize,
      exportedAt: new Date()
    }
    
    const dataStr = JSON.stringify(template, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.download = `${currentTemplateName}-config.json`
    link.href = url
    link.click()
    
    URL.revokeObjectURL(url)
    alert('配置文件导出成功！')
  }

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const template = JSON.parse(e.target?.result as string)
        if (template.elements && Array.isArray(template.elements)) {
          setElements(template.elements)
          setCurrentTemplateName(template.name || '导入的模板')
          setSelectedElementId(null)
          alert('模板导入成功！')
        } else {
          alert('无效的模板文件格式')
        }
      } catch (error) {
        console.error('导入失败:', error)
        alert('导入失败，请检查文件格式')
      }
    }
    reader.readAsText(file)
  }

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent, element: SimpleElement) => {
    setDraggedElement(element.id)
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const canvasRect = (e.target as HTMLElement).closest('.canvas-container')?.getBoundingClientRect()
    if (canvasRect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', element.id)
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    setDraggedElement(null)
    setDragOffset({ x: 0, y: 0 })
  }

  // 处理画布拖拽悬停
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  // 处理画布拖拽放下
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const elementId = e.dataTransfer.getData('text/plain');
    if (!elementId) return

    const canvasRect = (e.target as HTMLElement).closest('.canvas-container')?.getBoundingClientRect()
    if (canvasRect) {
      const newX = e.clientX - canvasRect.left - dragOffset.x
      const newY = e.clientY - canvasRect.top - dragOffset.y
      
      // 确保元素不会被拖拽到画布外
      const element = elements.find(el => el.id === elementId)
      if (element) {
        const constrainedX = Math.max(0, Math.min(newX, canvasSize.width - element.style.width))
        const constrainedY = Math.max(0, Math.min(newY, canvasSize.height - element.style.height))
        
        updateElement(elementId, {
          style: {
            ...element.style,
            x: constrainedX,
            y: constrainedY
          }
        })
      }
    }
    
    setDraggedElement(null)
    setDragOffset({ x: 0, y: 0 })
  }

  // 渲染元素
  const renderElement = (element: SimpleElement) => {
    const commonStyle = {
      position: 'absolute' as const,
      left: element.style.x,
      top: element.style.y,
      width: element.style.width,
      height: element.style.height,
      backgroundColor: element.style.backgroundColor,
      color: element.style.color,
      fontSize: element.style.fontSize,
      borderRadius: element.style.borderRadius,
      border: selectedElementId === element.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
      cursor: draggedElement === element.id ? 'grabbing' : 'grab',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      opacity: draggedElement === element.id ? 0.5 : 1,
      userSelect: 'none' as const
    }

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedElementId(element.id)
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault()
      setSelectedElementId(element.id)
    }

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={commonStyle}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            draggable
            onDragStart={(e) => handleDragStart(e, element)}
            onDragEnd={handleDragEnd}
            title="拖拽移动元素"
          >
            {element.content || '文本'}
          </div>
        )
      case 'image':
        return (
          <div
            key={element.id}
            style={commonStyle}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            draggable
            onDragStart={(e) => handleDragStart(e, element)}
            onDragEnd={handleDragEnd}
            title="拖拽移动元素"
          >
            {element.content ? (
              <img src={element.content} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
            ) : (
              <div className="text-gray-500 text-center">
                <Image className="w-8 h-8 mx-auto mb-2" />
                <span className="text-xs">图片</span>
              </div>
            )}
          </div>
        )
      case 'shape':
        return (
          <div
            key={element.id}
            style={commonStyle}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            draggable
            onDragStart={(e) => handleDragStart(e, element)}
            onDragEnd={handleDragEnd}
            title="拖拽移动元素"
          >
            <span className="text-xs">形状</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex bg-gray-50">
      {/* 左侧工具面板 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* 元素库 */}
        <Card className="m-4 flex-shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">元素库</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addElement('text')}
              className="w-full justify-start"
            >
              <Type className="w-4 h-4 mr-2" />
              添加文本
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addElement('image')}
              className="w-full justify-start"
            >
              <Image className="w-4 h-4 mr-2" />
              添加图片
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addElement('shape')}
              className="w-full justify-start"
            >
              <Square className="w-4 h-4 mr-2" />
              添加形状
            </Button>
          </CardContent>
        </Card>

        {/* 元素列表 */}
        <Card className="m-4 flex-1 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">元素列表</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-48 overflow-y-auto">
              {elements.map(element => (
                <div
                  key={element.id}
                  className={`flex items-center justify-between p-2 border-b hover:bg-gray-50 cursor-pointer ${
                    selectedElementId === element.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedElementId(element.id)}
                >
                  <div className="flex items-center">
                    {element.type === 'text' && <Type className="w-4 h-4 mr-2" />}
                    {element.type === 'image' && <Image className="w-4 h-4 mr-2" />}
                    {element.type === 'shape' && <Square className="w-4 h-4 mr-2" />}
                    <span className="text-sm truncate">
                      {element.type === 'text' ? element.content : `${element.type}元素`}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteElement(element.id)
                    }}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 属性面板 */}
        {selectedElement && (
          <Card className="m-4 flex-shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">属性设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedElement.type === 'text' && (
                <div>
                  <Label className="text-xs">文本内容</Label>
                  <Textarea
                    value={selectedElement.content}
                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                    className="mt-1 h-20 text-sm"
                    placeholder="请输入文本内容"
                  />
                </div>
              )}

              {selectedElement.type === 'image' && (
                <div>
                  <Label className="text-xs">图片URL</Label>
                  <Input
                    value={selectedElement.content}
                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                    className="mt-1 h-8 text-xs"
                    placeholder="请输入图片URL"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">X位置</Label>
                  <Input
                    type="number"
                    value={selectedElement.style.x}
                    onChange={(e) => updateElement(selectedElement.id, {
                      style: { ...selectedElement.style, x: parseInt(e.target.value) || 0 }
                    })}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Y位置</Label>
                  <Input
                    type="number"
                    value={selectedElement.style.y}
                    onChange={(e) => updateElement(selectedElement.id, {
                      style: { ...selectedElement.style, y: parseInt(e.target.value) || 0 }
                    })}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">宽度</Label>
                  <Input
                    type="number"
                    value={selectedElement.style.width}
                    onChange={(e) => updateElement(selectedElement.id, {
                      style: { ...selectedElement.style, width: parseInt(e.target.value) || 0 }
                    })}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">高度</Label>
                  <Input
                    type="number"
                    value={selectedElement.style.height}
                    onChange={(e) => updateElement(selectedElement.id, {
                      style: { ...selectedElement.style, height: parseInt(e.target.value) || 0 }
                    })}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">背景颜色</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={selectedElement.style.backgroundColor === 'transparent' ? '#ffffff' : selectedElement.style.backgroundColor}
                    onChange={(e) => updateElement(selectedElement.id, {
                      style: { ...selectedElement.style, backgroundColor: e.target.value }
                    })}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    value={selectedElement.style.backgroundColor}
                    onChange={(e) => updateElement(selectedElement.id, {
                      style: { ...selectedElement.style, backgroundColor: e.target.value }
                    })}
                    className="flex-1 h-8 text-xs"
                    placeholder="transparent"
                  />
                </div>
              </div>

              {selectedElement.type === 'text' && (
                <>
                  <div>
                    <Label className="text-xs">文字颜色</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={selectedElement.style.color}
                        onChange={(e) => updateElement(selectedElement.id, {
                          style: { ...selectedElement.style, color: e.target.value }
                        })}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={selectedElement.style.color}
                        onChange={(e) => updateElement(selectedElement.id, {
                          style: { ...selectedElement.style, color: e.target.value }
                        })}
                        className="flex-1 h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">字体大小</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="number"
                        value={selectedElement.style.fontSize}
                        onChange={(e) => updateElement(selectedElement.id, {
                          style: { ...selectedElement.style, fontSize: parseInt(e.target.value) || 16 }
                        })}
                        className="w-16 h-8 text-xs"
                      />
                      <div className="flex-1">
                        <Slider
                          value={[selectedElement.style.fontSize]}
                          onValueChange={(value) => updateElement(selectedElement.id, {
                            style: { ...selectedElement.style, fontSize: value[0] }
                          })}
                          max={72}
                          min={8}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label className="text-xs">圆角</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="number"
                    value={selectedElement.style.borderRadius}
                    onChange={(e) => updateElement(selectedElement.id, {
                      style: { ...selectedElement.style, borderRadius: parseInt(e.target.value) || 0 }
                    })}
                    className="w-16 h-8 text-xs"
                  />
                  <div className="flex-1">
                    <Slider
                      value={[selectedElement.style.borderRadius]}
                      onValueChange={(value) => updateElement(selectedElement.id, {
                        style: { ...selectedElement.style, borderRadius: value[0] }
                      })}
                      max={50}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 右侧画布区域 */}
      <div className="flex-1 flex flex-col">
        {/* 画布工具栏 */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">可视化编辑器</h2>
              <div className="text-sm text-gray-600">
                画布: {canvasSize.width} × {canvasSize.height} | 元素: {elements.length}
              </div>
              <div className="flex items-center space-x-2">
                <Label className="text-sm">模板名称:</Label>
                <Input
                  value={currentTemplateName}
                  onChange={(e) => setCurrentTemplateName(e.target.value)}
                  className="w-32 h-8 text-sm"
                  placeholder="输入模板名称"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={newTemplate}>
                <Plus className="w-4 h-4 mr-2" />
                新建
              </Button>
              <Button variant="outline" size="sm" onClick={saveTemplate}>
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
              <Button variant="outline" size="sm" onClick={loadTemplatesFromStorage}>
                <FolderOpen className="w-4 h-4 mr-2" />
                加载
              </Button>
              <Button variant="outline" size="sm" onClick={exportAsImage}>
                <Download className="w-4 h-4 mr-2" />
                导出PNG
              </Button>
              <Button variant="outline" size="sm" onClick={exportAsJSON}>
                <Download className="w-4 h-4 mr-2" />
                导出JSON
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importFromJSON}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  导入JSON
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 画布 */}
        <div className="flex-1 p-8 overflow-auto bg-gray-100">
          <div className="flex items-center justify-center min-h-full">
            <div
              className="canvas-container bg-white shadow-lg border border-gray-300 relative"
              style={{
                width: canvasSize.width,
                height: canvasSize.height
              }}
              onClick={() => setSelectedElementId(null)}
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
            >
              {elements.map(renderElement)}
              
              {/* 拖拽提示 */}
              {draggedElement && (
                <div className="absolute inset-0 bg-blue-50 bg-opacity-30 border-2 border-dashed border-blue-400 flex items-center justify-center pointer-events-none">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                    <span className="text-blue-600 font-medium">移动元素到新位置</span>
                  </div>
                </div>
              )}
              
              {/* 空状态提示 */}
              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">开始创建你的模板</p>
                    <p className="text-sm">从左侧元素库添加元素到画布</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 模板管理器弹窗 */}
      {showTemplateManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">模板管理器</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplateManager(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {templates.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无保存的模板</p>
                  <p className="text-sm">创建并保存你的第一个模板吧！</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <div className="text-sm text-gray-500">
                            元素数量: {template.elements.length} | 
                            创建时间: {new Date(template.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadTemplate(template)}
                          >
                            <FolderOpen className="w-4 h-4 mr-1" />
                            加载
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newName = prompt('输入新的模板名称:', template.name)
                              if (newName && newName !== template.name) {
                                renameTemplate(template.id, newName)
                              }
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            重命名
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            删除
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimpleVisualEditor