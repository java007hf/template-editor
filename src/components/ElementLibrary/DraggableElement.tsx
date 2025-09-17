import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { ElementLibraryItem } from '../../types/editor'

interface DraggableElementProps {
  item: ElementLibraryItem
  children: React.ReactNode
  className?: string
}

export function DraggableElement({ item, children, className }: DraggableElementProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: item.id,
    data: {
      type: 'library-element',
      elementType: item.type,
      defaultProps: item.defaultProps
    }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto'
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  )
}