import React, { useRef, useCallback } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { useEditor } from '../../contexts/EditorContext'
import { TemplateElement } from '../../types/editor'
import { TextElement } from '../Elements/TextElement'
import { ImageElement } from '../Elements/ImageElement'
import { ShapeElement } from '../Elements/ShapeElement'
import { ContainerElement } from '../Elements/ContainerElement'
import { ResizeHandles } from './ResizeHandles'

interface CanvasElementProps {
  element: TemplateElement
  isSelected: boolean
  snapToGrid: boolean
  gridSize: number
}

export function CanvasElement({ 
  element, 
  isSelected, 
  snapToGrid, 
  gridSize 
}: CanvasElementProps) {
  const { selectElements, updateElement } = useEditor()
  const elementRef = useRef<HTMLDivElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: element.id,
    data: {
      type: 'canvas-element',
      element
    }
  })

  // 处理元素点击选择
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (e.ctrlKey || e.metaKey) {
      // 多选模式
      selectElements([element.id])
    } else {
      // 单选模式
      selectElements([element.id])
    }
  }, [element.id, selectElements])

  // 处理双击编辑
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    // 进入编辑模式（如果是文本元素）
    if (element.type === 'text') {
      // 可以在这里实现内联编辑功能
    }
  }, [element.type])

  // 计算元素位置（考虑拖拽和网格对齐）
  const getPosition = () => {
    let x = element.position.x
    let y = element.position.y

    if (transform) {
      x += transform.x
      y += transform.y
    }

    if (snapToGrid && !isDragging) {
      x = Math.round(x / gridSize) * gridSize
      y = Math.round(y / gridSize) * gridSize
    }

    return { x, y }
  }

  const position = getPosition()

  // 元素样式
  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: element.position.width,
    height: element.position.height,
    zIndex: element.zIndex + (isDragging ? 1000 : 0),
    opacity: element.visible ? (isDragging ? 0.7 : 1) : 0.3,
    pointerEvents: element.locked ? 'none' : 'auto',
    ...element.style
  }

  // 渲染不同类型的元素
  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return <TextElement element={element as any} />
      case 'image':
        return <ImageElement element={element as any} />
      case 'shape':
        return <ShapeElement element={element as any} />
      case 'container':
        return <ContainerElement element={element as any} />
      default:
        return <div>未知元素类型</div>
    }
  }

  return (
    <div
      ref={(node) => {
        setNodeRef(node)
        elementRef.current = node
      }}
      style={elementStyle}
      className={`
        group cursor-pointer transition-all duration-150
        ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${element.locked ? 'cursor-not-allowed' : ''}
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      {...listeners}
      {...attributes}
    >
      {/* 元素内容 */}
      <div className="w-full h-full">
        {renderElement()}
      </div>

      {/* 选中状态的调整手柄 */}
      {isSelected && !element.locked && (
        <ResizeHandles
          element={element}
          onResize={(newSize) => {
            updateElement(element.id, {
              position: { ...element.position, ...newSize }
            })
          }}
        />
      )}

      {/* 锁定指示器 */}
      {element.locked && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs">
          🔒
        </div>
      )}

      {/* 不可见指示器 */}
      {!element.visible && (
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs">
          👁️
        </div>
      )}
    </div>
  )
}

export default CanvasElement