import React, { useState, useCallback } from 'react'
import { TemplateElement, Size } from '../../types/editor'

interface ResizeHandlesProps {
  element: TemplateElement
  onResize: (newSize: Size) => void
}

type ResizeDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export function ResizeHandles({ element, onResize }: ResizeHandlesProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 0, height: 0 })

  // 开始调整大小
  const handleMouseDown = useCallback((direction: ResizeDirection) => (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    setIsResizing(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartSize({ 
      width: element.position.width, 
      height: element.position.height 
    })

    // 添加全局事件监听器
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const deltaX = e.clientX - startPos.x
      const deltaY = e.clientY - startPos.y
      
      let newWidth = startSize.width
      let newHeight = startSize.height
      
      // 根据调整方向计算新尺寸
      switch (direction) {
        case 'nw':
          newWidth = startSize.width - deltaX
          newHeight = startSize.height - deltaY
          break
        case 'n':
          newHeight = startSize.height - deltaY
          break
        case 'ne':
          newWidth = startSize.width + deltaX
          newHeight = startSize.height - deltaY
          break
        case 'e':
          newWidth = startSize.width + deltaX
          break
        case 'se':
          newWidth = startSize.width + deltaX
          newHeight = startSize.height + deltaY
          break
        case 's':
          newHeight = startSize.height + deltaY
          break
        case 'sw':
          newWidth = startSize.width - deltaX
          newHeight = startSize.height + deltaY
          break
        case 'w':
          newWidth = startSize.width - deltaX
          break
      }
      
      // 限制最小尺寸
      newWidth = Math.max(20, newWidth)
      newHeight = Math.max(20, newHeight)
      
      onResize({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [element.position, onResize, isResizing, startPos, startSize])

  // 调整手柄样式
  const handleStyle = "absolute w-2 h-2 bg-blue-500 border border-white rounded-sm hover:bg-blue-600 cursor-pointer"
  
  // 获取光标样式
  const getCursorClass = (direction: ResizeDirection) => {
    const cursorMap = {
      'nw': 'cursor-nw-resize',
      'n': 'cursor-n-resize',
      'ne': 'cursor-ne-resize',
      'e': 'cursor-e-resize',
      'se': 'cursor-se-resize',
      's': 'cursor-s-resize',
      'sw': 'cursor-sw-resize',
      'w': 'cursor-w-resize'
    }
    return cursorMap[direction]
  }

  return (
    <>
      {/* 四角调整手柄 */}
      <div 
        className={`${handleStyle} ${getCursorClass('nw')} -top-1 -left-1`}
        onMouseDown={handleMouseDown('nw')}
      />
      <div 
        className={`${handleStyle} ${getCursorClass('ne')} -top-1 -right-1`}
        onMouseDown={handleMouseDown('ne')}
      />
      <div 
        className={`${handleStyle} ${getCursorClass('se')} -bottom-1 -right-1`}
        onMouseDown={handleMouseDown('se')}
      />
      <div 
        className={`${handleStyle} ${getCursorClass('sw')} -bottom-1 -left-1`}
        onMouseDown={handleMouseDown('sw')}
      />
      
      {/* 边缘调整手柄 */}
      <div 
        className={`${handleStyle} ${getCursorClass('n')} -top-1 left-1/2 transform -translate-x-1/2`}
        onMouseDown={handleMouseDown('n')}
      />
      <div 
        className={`${handleStyle} ${getCursorClass('e')} -right-1 top-1/2 transform -translate-y-1/2`}
        onMouseDown={handleMouseDown('e')}
      />
      <div 
        className={`${handleStyle} ${getCursorClass('s')} -bottom-1 left-1/2 transform -translate-x-1/2`}
        onMouseDown={handleMouseDown('s')}
      />
      <div 
        className={`${handleStyle} ${getCursorClass('w')} -left-1 top-1/2 transform -translate-y-1/2`}
        onMouseDown={handleMouseDown('w')}
      />
    </>
  )
}

export default ResizeHandles