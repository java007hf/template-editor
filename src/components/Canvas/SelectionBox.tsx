import React, { useState, useCallback } from 'react'
import { useEditor } from '../../contexts/EditorContext'

export function SelectionBox() {
  const { state, selectElements } = useEditor()
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 })
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 })

  // 开始框选
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return // 只处理左键
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setSelectionStart({ x, y })
    setSelectionEnd({ x, y })
    setIsSelecting(true)
  }, [])

  // 框选中
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isSelecting) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setSelectionEnd({ x, y })
  }, [isSelecting])

  // 结束框选
  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return
    
    setIsSelecting(false)
    
    // 计算选择区域
    const minX = Math.min(selectionStart.x, selectionEnd.x)
    const maxX = Math.max(selectionStart.x, selectionEnd.x)
    const minY = Math.min(selectionStart.y, selectionEnd.y)
    const maxY = Math.max(selectionStart.y, selectionEnd.y)
    
    // 找到在选择区域内的元素
    const selectedElementIds = state.currentTemplate.elements
      .filter(element => {
        const elementLeft = element.position.x
        const elementRight = element.position.x + element.position.width
        const elementTop = element.position.y
        const elementBottom = element.position.y + element.position.height
        
        return (
          elementLeft < maxX &&
          elementRight > minX &&
          elementTop < maxY &&
          elementBottom > minY
        )
      })
      .map(element => element.id)
    
    selectElements(selectedElementIds)
  }, [isSelecting, selectionStart, selectionEnd, state.currentTemplate.elements, selectElements])

  // 计算选择框样式
  const getSelectionBoxStyle = () => {
    if (!isSelecting) return { display: 'none' }
    
    const minX = Math.min(selectionStart.x, selectionEnd.x)
    const maxX = Math.max(selectionStart.x, selectionEnd.x)
    const minY = Math.min(selectionStart.y, selectionEnd.y)
    const maxY = Math.max(selectionStart.y, selectionEnd.y)
    
    return {
      position: 'absolute' as const,
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY,
      border: '1px dashed #3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      pointerEvents: 'none' as const,
      zIndex: 1000
    }
  }

  return (
    <>
      {/* 选择区域覆盖层 */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 999 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* 选择框 */}
      <div style={getSelectionBoxStyle()} />
    </>
  )
}

export default SelectionBox