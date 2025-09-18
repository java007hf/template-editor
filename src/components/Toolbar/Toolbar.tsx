import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Save, 
  Download, 
  Upload, 
  Undo, 
  Redo, 
  Copy, 
  Clipboard, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Grid, 
  Magnet,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  RotateCcw,
  Settings
} from 'lucide-react'
import { useEditor } from '../../contexts/EditorContext'
import { TemplateManager } from './TemplateManager'

interface ToolbarProps {
  className?: string
}

export function Toolbar({ className }: ToolbarProps) {
  const { 
    state, 
    dispatch, 
    undo, 
    redo, 
    copyElements, 
    pasteElements, 
    deleteElement,
    saveState 
  } = useEditor()

  // 处理保存模板
  const handleSaveTemplate = () => {
    // 这里可以实现保存到本地存储或服务器
    const templateData = JSON.stringify(state.currentTemplate, null, 2)
    const blob = new Blob([templateData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${state.currentTemplate.name || '模板'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 处理导入模板
  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const templateData = JSON.parse(e.target?.result as string)
          dispatch({ type: 'SET_TEMPLATE', payload: templateData })
        } catch (error) {
          alert('导入失败：文件格式不正确')
        }
      }
      reader.readAsText(file)
    }
  }

  // 处理导出PNG
  const handleExportPNG = async () => {
    const canvas = document.querySelector('[data-canvas="true"]') as HTMLElement
    if (!canvas) {
      console.error('找不到画布元素')
      return
    }

    try {
      const html2canvas = (await import('html2canvas')).default
      
      // 调试：输出画布信息
      console.log('画布元素:', canvas)
      console.log('画布尺寸:', canvas.offsetWidth, 'x', canvas.offsetHeight)
      
      // 调试：检查文字元素
      const textElements = canvas.querySelectorAll('[data-element-type="text"]')
      console.log('找到文字元素数量:', textElements.length)
      textElements.forEach((el, index) => {
        const computedStyle = window.getComputedStyle(el)
        console.log(`文字元素 ${index}:`, {
          element: el,
          display: computedStyle.display,
          alignItems: computedStyle.alignItems,
          justifyContent: computedStyle.justifyContent,
          width: computedStyle.width,
          height: computedStyle.height,
          textContent: el.textContent
        })
      })
      
      // 等待一小段时间确保样式完全应用
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const canvasElement = await html2canvas(canvas, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        logging: true, // 启用日志来调试
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (element) => {
          // 忽略选择框、调整手柄等UI元素
          const shouldIgnore = element.classList.contains('ring-2') || 
                 element.classList.contains('resize-handle') ||
                 element.getAttribute('data-ignore-export') === 'true'
          if (shouldIgnore) {
            console.log('忽略元素:', element)
          }
          return shouldIgnore
        }
      })
      
      const link = document.createElement('a')
      link.download = `${state.currentTemplate.name || '模板'}-fixed-${Date.now()}.png`
      link.href = canvasElement.toDataURL('image/png', 1.0)
      link.click()
      
      console.log('导出完成')
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败: ' + error.message)
    }
  }

  // 处理删除选中元素
  const handleDeleteSelected = () => {
    if (state.selectedElements.length > 0) {
      saveState('delete', `删除${state.selectedElements.length}个元素`)
      state.selectedElements.forEach(id => deleteElement(id))
    }
  }

  // 处理粘贴
  const handlePaste = () => {
    if (state.clipboard.length > 0) {
      pasteElements({ x: 50, y: 50 })
    }
  }

  // 处理缩放
  const handleZoom = (direction: 'in' | 'out' | 'fit') => {
    let newZoom = state.zoom
    
    switch (direction) {
      case 'in':
        newZoom = Math.min(3, state.zoom + 0.1)
        break
      case 'out':
        newZoom = Math.max(0.1, state.zoom - 0.1)
        break
      case 'fit':
        newZoom = 1
        break
    }
    
    dispatch({ type: 'SET_ZOOM', payload: newZoom })
  }

  // 处理锁定/解锁选中元素
  const handleToggleLock = () => {
    const isLocked = state.selectedElements.some(id => {
      const element = state.currentTemplate.elements.find(el => el.id === id)
      return element?.locked
    })
    
    // 这里需要实现批量更新元素锁定状态的逻辑
  }

  // 处理显示/隐藏选中元素
  const handleToggleVisibility = () => {
    const isVisible = state.selectedElements.some(id => {
      const element = state.currentTemplate.elements.find(el => el.id === id)
      return element?.visible
    })
    
    // 这里需要实现批量更新元素可见性的逻辑
  }

  return (
    <div className={`bg-white border-b border-gray-200 px-4 py-2 ${className}`}>
      <div className="flex items-center justify-between">
        {/* 左侧工具组 */}
        <div className="flex items-center space-x-1">
          {/* 文件操作 */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveTemplate}
              className="h-8 px-2"
            >
              <Save className="w-4 h-4 mr-1" />
              保存
            </Button>
            
            <input
              type="file"
              accept=".json"
              onChange={handleImportTemplate}
              className="hidden"
              id="import-template"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('import-template')?.click()}
              className="h-8 px-2"
            >
              <Upload className="w-4 h-4 mr-1" />
              导入
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportPNG}
              className="h-8 px-2"
            >
              <Download className="w-4 h-4 mr-1" />
              导出
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* 编辑操作 */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={state.historyIndex <= 0}
              className="h-8 px-2"
            >
              <Undo className="w-4 h-4 mr-1" />
              撤销
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={state.historyIndex >= state.history.length - 1}
              className="h-8 px-2"
            >
              <Redo className="w-4 h-4 mr-1" />
              重做
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={copyElements}
              disabled={state.selectedElements.length === 0}
              className="h-8 px-2"
            >
              <Copy className="w-4 h-4 mr-1" />
              复制
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handlePaste}
              disabled={state.clipboard.length === 0}
              className="h-8 px-2"
            >
              <Clipboard className="w-4 h-4 mr-1" />
              粘贴
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={state.selectedElements.length === 0}
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              删除
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* 元素操作 */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleLock}
              disabled={state.selectedElements.length === 0}
              className="h-8 px-2"
            >
              <Lock className="w-4 h-4 mr-1" />
              锁定
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleVisibility}
              disabled={state.selectedElements.length === 0}
              className="h-8 px-2"
            >
              <Eye className="w-4 h-4 mr-1" />
              显示
            </Button>
          </div>
        </div>

        {/* 中间信息 */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>
            画布: {state.currentTemplate.canvasSize.width} × {state.currentTemplate.canvasSize.height}
          </span>
          <span>
            元素: {state.currentTemplate.elements.length}
          </span>
          <span>
            选中: {state.selectedElements.length}
          </span>
        </div>

        {/* 右侧工具组 */}
        <div className="flex items-center space-x-1">
          {/* 视图操作 */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom('out')}
              className="h-8 px-2"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <span className="text-sm text-gray-600 min-w-[50px] text-center">
              {Math.round(state.zoom * 100)}%
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom('in')}
              className="h-8 px-2"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom('fit')}
              className="h-8 px-2"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* 辅助工具 */}
          <div className="flex items-center space-x-1">
            <Button
              variant={state.showGrid ? "default" : "ghost"}
              size="sm"
              onClick={() => dispatch({ type: 'TOGGLE_GRID' })}
              className="h-8 px-2"
            >
              <Grid className="w-4 h-4" />
            </Button>

            <Button
              variant={state.snapToGrid ? "default" : "ghost"}
              size="sm"
              onClick={() => dispatch({ type: 'TOGGLE_SNAP' })}
              className="h-8 px-2"
            >
              <Magnet className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* 模板管理 */}
          <TemplateManager />
        </div>
      </div>
    </div>
  )
}

export default Toolbar