import React from 'react'
import { ShapeElement as ShapeElementType } from '../../types/editor'

interface ShapeElementProps {
  element: ShapeElementType
}

export function ShapeElement({ element }: ShapeElementProps) {
  // 基础样式
  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: element.content.fillColor || element.style.backgroundColor || '#3b82f6',
    border: element.content.strokeWidth 
      ? `${element.content.strokeWidth}px solid ${element.content.strokeColor || '#000000'}`
      : element.style.border,
    borderRadius: element.style.borderRadius || 0,
    opacity: element.style.opacity || 1
  }

  // 根据形状类型渲染不同的元素
  const renderShape = () => {
    switch (element.content.shape) {
      case 'rectangle':
        return (
          <div 
            style={baseStyle}
            className="w-full h-full"
          />
        )
      
      case 'circle':
        return (
          <div 
            style={{
              ...baseStyle,
              borderRadius: '50%'
            }}
            className="w-full h-full"
          />
        )
      
      case 'triangle':
        return (
          <div className="w-full h-full relative">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <polygon
                points="50,10 90,90 10,90"
                fill={element.content.fillColor || element.style.backgroundColor || '#3b82f6'}
                stroke={element.content.strokeColor}
                strokeWidth={element.content.strokeWidth || 0}
                opacity={element.style.opacity || 1}
              />
            </svg>
          </div>
        )
      
      case 'line':
        return (
          <div className="w-full h-full relative">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                stroke={element.content.strokeColor || element.style.backgroundColor || '#3b82f6'}
                strokeWidth={element.content.strokeWidth || 2}
                opacity={element.style.opacity || 1}
              />
            </svg>
          </div>
        )
      
      default:
        return (
          <div 
            style={baseStyle}
            className="w-full h-full flex items-center justify-center text-gray-500 text-sm"
          >
            未知形状
          </div>
        )
    }
  }

  return (
    <div className="w-full h-full">
      {renderShape()}
    </div>
  )
}

export default ShapeElement