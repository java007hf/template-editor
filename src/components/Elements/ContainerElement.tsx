import React from 'react'
import { ContainerElement as ContainerElementType } from '../../types/editor'
import { useEditor } from '../../contexts/EditorContext'
import { CanvasElement } from '../Canvas/CanvasElement'

interface ContainerElementProps {
  element: ContainerElementType
}

export function ContainerElement({ element }: ContainerElementProps) {
  const { state } = useEditor()

  // 获取子元素
  const childElements = element.children 
    ? state.currentTemplate.elements.filter(el => element.children?.includes(el.id))
    : []

  // 容器样式
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: element.style.backgroundColor,
    border: element.style.border,
    borderRadius: element.style.borderRadius || 0,
    padding: element.style.padding || 0,
    margin: element.style.margin || 0,
    opacity: element.style.opacity || 1,
    boxShadow: element.style.boxShadow,
    display: element.content.layout === 'flex' ? 'flex' : 
             element.content.layout === 'grid' ? 'grid' : 'relative',
    flexDirection: element.content.direction || 'row',
    justifyContent: element.content.justifyContent || 'flex-start',
    alignItems: element.content.alignItems || 'stretch',
    gap: element.content.gap || 0,
    overflow: 'hidden'
  }

  // 如果是空容器，显示提示
  if (childElements.length === 0) {
    return (
      <div 
        style={containerStyle}
        className="flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50"
      >
        <div className="text-center text-gray-500">
          <div className="text-sm">容器</div>
          <div className="text-xs">拖拽元素到此处</div>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {element.content.layout === 'absolute' ? (
        // 绝对定位布局 - 渲染子元素
        childElements.map((childElement) => (
          <CanvasElement
            key={childElement.id}
            element={childElement}
            isSelected={state.selectedElements.includes(childElement.id)}
            snapToGrid={state.snapToGrid}
            gridSize={state.gridSize}
          />
        ))
      ) : (
        // Flex 或 Grid 布局 - 简化渲染
        childElements.map((childElement) => (
          <div
            key={childElement.id}
            style={{
              width: element.content.layout === 'flex' && element.content.direction === 'row' 
                ? 'auto' : childElement.position.width,
              height: element.content.layout === 'flex' && element.content.direction === 'column' 
                ? 'auto' : childElement.position.height,
              flexShrink: element.content.layout === 'flex' ? 0 : undefined,
              ...childElement.style
            }}
          >
            {/* 这里可以根据元素类型渲染具体内容 */}
            <div className="w-full h-full bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-xs text-blue-600">
              {childElement.type}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ContainerElement