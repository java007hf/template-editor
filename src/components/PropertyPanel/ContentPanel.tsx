import React, { useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Upload } from 'lucide-react'
import { useEditor } from '../../contexts/EditorContext'
import { TemplateElement, TextElement, ImageElement, ShapeElement, ContainerElement } from '../../types/editor'

interface ContentPanelProps {
  element: TemplateElement
}

export function ContentPanel({ element }: ContentPanelProps) {
  const { updateElement } = useEditor()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 更新元素内容
  const updateContent = (contentUpdates: any) => {
    updateElement(element.id, {
      content: {
        ...element.content,
        ...contentUpdates
      }
    })
  }

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const src = e.target?.result as string
        updateContent({
          src,
          alt: file.name
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // 根据元素类型渲染不同的内容编辑器
  const renderContentEditor = () => {
    switch (element.type) {
      case 'text':
        const textElement = element as TextElement
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-gray-600">文本内容</Label>
              <Textarea
                value={textElement.content.text}
                onChange={(e) => updateContent({ text: e.target.value })}
                placeholder={textElement.content.placeholder || '请输入文本'}
                className="mt-2 text-sm"
                rows={4}
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-600">占位符</Label>
              <Input
                value={textElement.content.placeholder || ''}
                onChange={(e) => updateContent({ placeholder: e.target.value })}
                placeholder="请输入占位符文本"
                className="mt-2 h-8 text-xs"
              />
            </div>
          </div>
        )

      case 'image':
        const imageElement = element as ImageElement
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-gray-600">图片</Label>
              <div className="mt-2 space-y-2">
                {imageElement.content.src && (
                  <div className="relative">
                    <img
                      src={imageElement.content.src}
                      alt={imageElement.content.alt}
                      className="w-full h-24 object-cover rounded border"
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-8 text-xs"
                >
                  <Upload className="w-3 h-3 mr-2" />
                  {imageElement.content.src ? '更换图片' : '上传图片'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600">图片URL</Label>
              <Input
                value={imageElement.content.src}
                onChange={(e) => updateContent({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="mt-2 h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600">替代文本</Label>
              <Input
                value={imageElement.content.alt}
                onChange={(e) => updateContent({ alt: e.target.value })}
                placeholder="图片描述"
                className="mt-2 h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600">适应方式</Label>
              <Select
                value={imageElement.content.fit}
                onValueChange={(value) => updateContent({ fit: value })}
              >
                <SelectTrigger className="mt-2 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">覆盖</SelectItem>
                  <SelectItem value="contain">包含</SelectItem>
                  <SelectItem value="fill">填充</SelectItem>
                  <SelectItem value="scale-down">缩小</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'shape':
        const shapeElement = element as ShapeElement
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-gray-600">形状类型</Label>
              <Select
                value={shapeElement.content.shape}
                onValueChange={(value) => updateContent({ shape: value })}
              >
                <SelectTrigger className="mt-2 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rectangle">矩形</SelectItem>
                  <SelectItem value="circle">圆形</SelectItem>
                  <SelectItem value="triangle">三角形</SelectItem>
                  <SelectItem value="line">直线</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600">填充颜色</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="color"
                  value={shapeElement.content.fillColor || '#3b82f6'}
                  onChange={(e) => updateContent({ fillColor: e.target.value })}
                  className="w-12 h-8 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={shapeElement.content.fillColor || ''}
                  onChange={(e) => updateContent({ fillColor: e.target.value })}
                  placeholder="#3b82f6"
                  className="flex-1 h-8 text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600">边框颜色</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="color"
                  value={shapeElement.content.strokeColor || '#000000'}
                  onChange={(e) => updateContent({ strokeColor: e.target.value })}
                  className="w-12 h-8 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={shapeElement.content.strokeColor || ''}
                  onChange={(e) => updateContent({ strokeColor: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 h-8 text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600">边框宽度</Label>
              <Input
                type="number"
                value={shapeElement.content.strokeWidth || 0}
                onChange={(e) => updateContent({ strokeWidth: parseInt(e.target.value) || 0 })}
                className="mt-2 h-8 text-xs"
                min="0"
                max="20"
              />
            </div>
          </div>
        )

      case 'container':
        const containerElement = element as ContainerElement
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-gray-600">布局类型</Label>
              <Select
                value={containerElement.content.layout}
                onValueChange={(value) => updateContent({ layout: value })}
              >
                <SelectTrigger className="mt-2 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex">弹性布局</SelectItem>
                  <SelectItem value="grid">网格布局</SelectItem>
                  <SelectItem value="absolute">绝对定位</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {containerElement.content.layout === 'flex' && (
              <>
                <div>
                  <Label className="text-xs font-medium text-gray-600">方向</Label>
                  <Select
                    value={containerElement.content.direction}
                    onValueChange={(value) => updateContent({ direction: value })}
                  >
                    <SelectTrigger className="mt-2 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="row">水平</SelectItem>
                      <SelectItem value="column">垂直</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-600">主轴对齐</Label>
                  <Select
                    value={containerElement.content.justifyContent}
                    onValueChange={(value) => updateContent({ justifyContent: value })}
                  >
                    <SelectTrigger className="mt-2 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flex-start">开始</SelectItem>
                      <SelectItem value="center">居中</SelectItem>
                      <SelectItem value="flex-end">结束</SelectItem>
                      <SelectItem value="space-between">两端对齐</SelectItem>
                      <SelectItem value="space-around">环绕对齐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-600">交叉轴对齐</Label>
                  <Select
                    value={containerElement.content.alignItems}
                    onValueChange={(value) => updateContent({ alignItems: value })}
                  >
                    <SelectTrigger className="mt-2 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flex-start">开始</SelectItem>
                      <SelectItem value="center">居中</SelectItem>
                      <SelectItem value="flex-end">结束</SelectItem>
                      <SelectItem value="stretch">拉伸</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-600">间距</Label>
                  <Input
                    type="number"
                    value={containerElement.content.gap || 0}
                    onChange={(e) => updateContent({ gap: parseInt(e.target.value) || 0 })}
                    className="mt-2 h-8 text-xs"
                    min="0"
                  />
                </div>
              </>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center text-gray-500 text-sm py-8">
            该元素类型暂不支持内容编辑
          </div>
        )
    }
  }

  return (
    <div>
      <Label className="text-xs font-medium text-gray-600 mb-4 block">
        {element.type === 'text' ? '文本设置' :
         element.type === 'image' ? '图片设置' :
         element.type === 'shape' ? '形状设置' :
         element.type === 'container' ? '容器设置' : '内容设置'}
      </Label>
      {renderContentEditor()}
    </div>
  )
}

export default ContentPanel