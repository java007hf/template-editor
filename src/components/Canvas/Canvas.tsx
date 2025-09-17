import React, { useRef, useCallback } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { v4 as uuidv4 } from 'uuid'
import { useEditor } from '../../contexts/EditorContext'
import { TemplateElement, Position } from '../../types/editor'
import { CanvasElement } from './CanvasElement'
import { CanvasGrid } from './CanvasGrid'
import { SelectionBox } from './SelectionBox'

interface CanvasProps {
  className?: string
}

export function Canvas({ className }: CanvasProps) {
  const { state, addElement, selectElements } = useEditor()
  const canvasRef = useRef<HTMLDivElement>(null)
  
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
    data: {
      type: 'canvas'
    }
  })

  // 处理画布点击
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // 如果点击的是画布本身（不是元素），清除选择
    if (e.target === e.currentTarget) {
      selectElements([])
    }
  }, [selectElements])

  // 计算画布样式
  const canvasStyle = {
    width: state.currentTemplate.canvasSize.width,
    height: state.currentTemplate.canvasSize.height,
    transform: `scale(${state.zoom})`,
    transformOrigin: 'top left'
  }

  return (
    <div className={`flex-1 overflow-auto bg-gray-100 p-8 ${className}`}>
      <div className="flex items-center justify-center min-h-full">
        <div
          ref={(node) => {
            setNodeRef(node)
            canvasRef.current = node
          }}
          className={`
            relative bg-white shadow-lg border border-gray-200 
            ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
          `}
          style={canvasStyle}
          onClick={handleCanvasClick}
        >
          {/* 网格背景 */}
          {state.showGrid && (
            <CanvasGrid 
              size={state.gridSize} 
              canvasSize={state.currentTemplate.canvasSize}
            />
          )}

          {/* 渲染所有元素 */}
          {state.currentTemplate.elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={state.selectedElements.includes(element.id)}
              snapToGrid={state.snapToGrid}
              gridSize={state.gridSize}
            />
          ))}

          {/* 选择框 */}
          <SelectionBox />

          {/* 拖放提示 */}
          {isOver && (
            <div className="absolute inset-0 bg-blue-50 bg-opacity-30 border-2 border-dashed border-blue-400 flex items-center justify-center">
              <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                <span className="text-blue-600 font-medium">释放以添加元素</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Canvas