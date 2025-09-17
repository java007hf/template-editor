import React from 'react'
import { Size } from '../../types/editor'

interface CanvasGridProps {
  size: number
  canvasSize: Size
}

export function CanvasGrid({ size, canvasSize }: CanvasGridProps) {
  // 创建网格线
  const createGridLines = () => {
    const lines = []
    
    // 垂直线
    for (let x = 0; x <= canvasSize.width; x += size) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={canvasSize.height}
          stroke="#e5e7eb"
          strokeWidth={0.5}
          opacity={0.5}
        />
      )
    }
    
    // 水平线
    for (let y = 0; y <= canvasSize.height; y += size) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={canvasSize.width}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth={0.5}
          opacity={0.5}
        />
      )
    }
    
    return lines
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasSize.width}
      height={canvasSize.height}
      style={{ zIndex: 0 }}
    >
      {createGridLines()}
    </svg>
  )
}

export default CanvasGrid