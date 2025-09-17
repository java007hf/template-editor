import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Type, 
  Image, 
  Square, 
  Circle, 
  Triangle, 
  Container,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'
import { ElementLibraryItem } from '../../types/editor'
import { DraggableElement } from './DraggableElement'

// 元素库配置
const elementLibraryItems: ElementLibraryItem[] = [
  // 文本元素
  {
    id: 'text-heading',
    name: '标题',
    icon: 'Type',
    type: 'text',
    defaultProps: {
      type: 'text',
      position: { x: 0, y: 0, width: 200, height: 40 },
      style: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'left'
      },
      content: {
        text: '标题文本',
        placeholder: '请输入标题'
      },
      zIndex: 1,
      locked: false,
      visible: true
    }
  },
  {
    id: 'text-paragraph',
    name: '段落',
    icon: 'AlignLeft',
    type: 'text',
    defaultProps: {
      type: 'text',
      position: { x: 0, y: 0, width: 300, height: 80 },
      style: {
        fontSize: 16,
        color: '#374151',
        textAlign: 'left'
      },
      content: {
        text: '这是一段示例文本，您可以编辑这段内容。',
        placeholder: '请输入段落内容'
      },
      zIndex: 1,
      locked: false,
      visible: true
    }
  },
  {
    id: 'text-subtitle',
    name: '副标题',
    icon: 'AlignCenter',
    type: 'text',
    defaultProps: {
      type: 'text',
      position: { x: 0, y: 0, width: 250, height: 30 },
      style: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4b5563',
        textAlign: 'center'
      },
      content: {
        text: '副标题',
        placeholder: '请输入副标题'
      },
      zIndex: 1,
      locked: false,
      visible: true
    }
  },

  // 图片元素
  {
    id: 'image-placeholder',
    name: '图片',
    icon: 'Image',
    type: 'image',
    defaultProps: {
      type: 'image',
      position: { x: 0, y: 0, width: 200, height: 150 },
      style: {
        borderRadius: 8,
        border: '2px dashed #d1d5db'
      },
      content: {
        src: '',
        alt: '图片',
        fit: 'cover'
      },
      zIndex: 1,
      locked: false,
      visible: true
    }
  },

  // 形状元素
  {
    id: 'shape-rectangle',
    name: '矩形',
    icon: 'Square',
    type: 'shape',
    defaultProps: {
      type: 'shape',
      position: { x: 0, y: 0, width: 150, height: 100 },
      style: {
        backgroundColor: '#3b82f6',
        borderRadius: 8
      },
      content: {
        shape: 'rectangle',
        fillColor: '#3b82f6'
      },
      zIndex: 1,
      locked: false,
      visible: true
    }
  },
  {
    id: 'shape-circle',
    name: '圆形',
    icon: 'Circle',
    type: 'shape',
    defaultProps: {
      type: 'shape',
      position: { x: 0, y: 0, width: 100, height: 100 },
      style: {
        backgroundColor: '#10b981',
        borderRadius: 50
      },
      content: {
        shape: 'circle',
        fillColor: '#10b981'
      },
      zIndex: 1,
      locked: false,
      visible: true
    }
  },

  // 容器元素
  {
    id: 'container-flex-row',
    name: '水平容器',
    icon: 'Container',
    type: 'container',
    defaultProps: {
      type: 'container',
      position: { x: 0, y: 0, width: 300, height: 150 },
      style: {
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 16
      },
      content: {
        layout: 'flex',
        direction: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 16
      },
      zIndex: 1,
      locked: false,
      visible: true,
      children: []
    }
  },
  {
    id: 'container-flex-column',
    name: '垂直容器',
    icon: 'Layout',
    type: 'container',
    defaultProps: {
      type: 'container',
      position: { x: 0, y: 0, width: 200, height: 300 },
      style: {
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 16
      },
      content: {
        layout: 'flex',
        direction: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 16
      },
      zIndex: 1,
      locked: false,
      visible: true,
      children: []
    }
  }
]

// 图标组件映射
const IconComponents = {
  Type,
  Image,
  Square,
  Circle,
  Triangle,
  Container,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight
}

interface ElementLibraryProps {
  className?: string
}

export function ElementLibrary({ className }: ElementLibraryProps) {
  // 按类型分组元素
  const groupedElements = elementLibraryItems.reduce((groups, item) => {
    const category = item.type === 'text' ? '文本' : 
                    item.type === 'image' ? '图片' : 
                    item.type === 'shape' ? '形状' : 
                    item.type === 'container' ? '容器' : '其他'
    
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {} as Record<string, ElementLibraryItem[]>)

  return (
    <Card className={`w-64 h-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">元素库</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto px-4 pb-4">
          {Object.entries(groupedElements).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-medium text-gray-600 mb-2 px-2">
                {category}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {items.map((item) => {
                  const IconComponent = IconComponents[item.icon as keyof typeof IconComponents]
                  return (
                    <DraggableElement
                      key={item.id}
                      item={item}
                      className="aspect-square"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-full flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-50 hover:border-blue-300 cursor-grab active:cursor-grabbing"
                      >
                        {IconComponent && (
                          <IconComponent className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="text-xs text-gray-700 text-center leading-tight">
                          {item.name}
                        </span>
                      </Button>
                    </DraggableElement>
                  )
                })}
              </div>
              {category !== Object.keys(groupedElements)[Object.keys(groupedElements).length - 1] && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ElementLibrary