import React from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { EditorProvider, useEditor } from './contexts/EditorContext'
import { ElementLibrary } from './components/ElementLibrary/ElementLibrary'
import { Canvas } from './components/Canvas/Canvas'
import { PropertyPanel } from './components/PropertyPanel/PropertyPanel'
import { Toolbar } from './components/Toolbar/Toolbar'
import { TemplateElement } from './types/editor'
import { v4 as uuidv4 } from 'uuid'

// 可视化编辑器主界面
function VisualEditorInterface() {
  const { addElement, moveElement, dispatch } = useEditor()
  const [draggedElement, setDraggedElement] = React.useState<TemplateElement | null>(null)

  // 处理拖拽开始
  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    const { active } = event

    // 如果是从元素库拖拽
    if (active.data.current?.type === 'library-element') {
      const { defaultProps } = active.data.current
      const newElement: TemplateElement = {
        id: uuidv4(),
        ...defaultProps,
        position: {
          ...defaultProps.position,
          x: 0,
          y: 0
        }
      }
      setDraggedElement(newElement)
    }
    // 如果是画布上的元素
    else if (active.data.current?.type === 'canvas-element') {
      setDraggedElement(active.data.current.element)
    }

    dispatch({ type: 'SET_DRAGGING', payload: true })
  }, [dispatch])

  // 处理拖拽结束
  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over, delta } = event
    
    setDraggedElement(null)
    dispatch({ type: 'SET_DRAGGING', payload: false })

    if (!over) return

    // 如果拖拽到画布上
    if (over.id === 'canvas') {
      // 从元素库添加新元素
      if (active.data.current?.type === 'library-element') {
        const { defaultProps } = active.data.current
        
        const newElement: TemplateElement = {
          id: uuidv4(),
          ...defaultProps,
          position: {
            ...defaultProps.position,
            x: Math.random() * 200 + 50, // 随机位置避免重叠
            y: Math.random() * 200 + 50
          }
        }
        
        addElement(newElement)
      }
      // 移动画布上的现有元素
      else if (active.data.current?.type === 'canvas-element' && delta) {
        const element = active.data.current.element as TemplateElement
        const newPosition = {
          x: element.position.x + delta.x,
          y: element.position.y + delta.y
        }
        
        // 确保元素不会被拖拽到画布外
        const constrainedPosition = {
          x: Math.max(0, Math.min(newPosition.x, 800 - element.position.width)),
          y: Math.max(0, Math.min(newPosition.y, 600 - element.position.height))
        }
        
        moveElement(element.id, constrainedPosition)
      }
    }
  }, [addElement, moveElement, dispatch])

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col bg-gray-50">
        {/* 工具栏 */}
        <Toolbar />
      
      {/* 主编辑区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧元素库 */}
        <div className="flex-shrink-0">
          <ElementLibrary />
        </div>
        
        {/* 中间画布区域 */}
        <div className="flex-1 relative">
          <Canvas />
        </div>
        
        {/* 右侧属性面板 */}
        <div className="flex-shrink-0">
          <PropertyPanel />
        </div>
      </div>

      {/* 拖拽覆盖层 */}
      <DragOverlay>
        {draggedElement ? (
          <div className="bg-white border-2 border-blue-400 rounded-lg p-2 shadow-lg opacity-80">
            <div className="text-sm font-medium text-blue-700">
              {draggedElement.type === 'text' ? '文本元素' :
               draggedElement.type === 'image' ? '图片元素' :
               draggedElement.type === 'shape' ? '形状元素' :
               draggedElement.type === 'container' ? '容器元素' : '元素'}
            </div>
          </div>
        ) : null}
      </DragOverlay>
      </div>
    </DndContext>
  )
}

// 可视化编辑器应用
export function VisualEditorApp() {
  return (
    <EditorProvider>
      <VisualEditorInterface />
    </EditorProvider>
  )
}

export default VisualEditorApp