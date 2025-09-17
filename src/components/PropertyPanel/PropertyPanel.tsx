import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEditor } from '../../contexts/EditorContext'
import { PositionPanel } from './PositionPanel'
import { StylePanel } from './StylePanel'
import { ContentPanel } from './ContentPanel'
import { LayoutPanel } from './LayoutPanel'

interface PropertyPanelProps {
  className?: string
}

export function PropertyPanel({ className }: PropertyPanelProps) {
  const { state } = useEditor()
  
  // 获取选中的元素
  const selectedElements = state.currentTemplate.elements.filter(
    element => state.selectedElements.includes(element.id)
  )

  // 如果没有选中元素，显示画布属性
  if (selectedElements.length === 0) {
    return (
      <Card className={`w-80 h-full ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">画布属性</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LayoutPanel />
        </CardContent>
      </Card>
    )
  }

  // 如果选中多个元素，显示通用属性
  if (selectedElements.length > 1) {
    return (
      <Card className={`w-80 h-full ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            多选属性 ({selectedElements.length} 个元素)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="position" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="position" className="text-xs">位置</TabsTrigger>
              <TabsTrigger value="style" className="text-xs">样式</TabsTrigger>
            </TabsList>
            <TabsContent value="position" className="space-y-4">
              <PositionPanel elements={selectedElements} />
            </TabsContent>
            <TabsContent value="style" className="space-y-4">
              <StylePanel elements={selectedElements} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  // 单个元素的属性面板
  const element = selectedElements[0]
  
  return (
    <Card className={`w-80 h-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {element.type === 'text' ? '文本' :
           element.type === 'image' ? '图片' :
           element.type === 'shape' ? '形状' :
           element.type === 'container' ? '容器' : '元素'} 属性
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mx-4">
              <TabsTrigger value="content" className="text-xs">内容</TabsTrigger>
              <TabsTrigger value="style" className="text-xs">样式</TabsTrigger>
              <TabsTrigger value="position" className="text-xs">位置</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">高级</TabsTrigger>
            </TabsList>
            
            <div className="px-4 pb-4">
              <TabsContent value="content" className="space-y-4 mt-4">
                <ContentPanel element={element} />
              </TabsContent>
              
              <TabsContent value="style" className="space-y-4 mt-4">
                <StylePanel elements={[element]} />
              </TabsContent>
              
              <TabsContent value="position" className="space-y-4 mt-4">
                <PositionPanel elements={[element]} />
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p>元素ID: {element.id}</p>
                    <p>层级: {element.zIndex}</p>
                    <p>类型: {element.type}</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

export default PropertyPanel