import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useEditor } from '../../contexts/EditorContext'
import { TemplateElement } from '../../types/editor'

interface StylePanelProps {
  elements: TemplateElement[]
}

export function StylePanel({ elements }: StylePanelProps) {
  const { updateElement } = useEditor()

  // 获取通用值
  const getCommonValue = (key: string, subKey?: string) => {
    if (elements.length === 0) return ''
    
    const values = elements.map(el => {
      if (subKey) {
        return (el as any)[key]?.[subKey]
      }
      return (el as any)[key]
    })
    
    const firstValue = values[0]
    const allSame = values.every(v => v === firstValue)
    return allSame ? firstValue : ''
  }

  // 更新多个元素的样式
  const updateElementsStyle = (styleUpdates: any) => {
    elements.forEach(element => {
      updateElement(element.id, {
        style: {
          ...element.style,
          ...styleUpdates
        }
      })
    })
  }

  // 预设颜色
  const presetColors = [
    '#000000', '#ffffff', '#f3f4f6', '#374151', '#6b7280',
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f59e0b'
  ]

  return (
    <div className="space-y-4">
      {/* 颜色设置 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">颜色</Label>
        <div className="space-y-3 mt-2">
          {/* 背景颜色 */}
          <div>
            <Label className="text-xs text-gray-500">背景颜色</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={getCommonValue('style', 'backgroundColor') || '#ffffff'}
                onChange={(e) => updateElementsStyle({ backgroundColor: e.target.value })}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                type="text"
                value={getCommonValue('style', 'backgroundColor') || ''}
                onChange={(e) => updateElementsStyle({ backgroundColor: e.target.value })}
                placeholder="#ffffff"
                className="flex-1 h-8 text-xs"
              />
            </div>
            {/* 预设颜色 */}
            <div className="grid grid-cols-5 gap-1 mt-2">
              {presetColors.map(color => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => updateElementsStyle({ backgroundColor: color })}
                />
              ))}
            </div>
          </div>

          {/* 文字颜色（仅文本元素） */}
          {elements.some(el => el.type === 'text') && (
            <div>
              <Label className="text-xs text-gray-500">文字颜色</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={getCommonValue('style', 'color') || '#000000'}
                  onChange={(e) => updateElementsStyle({ color: e.target.value })}
                  className="w-12 h-8 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={getCommonValue('style', 'color') || ''}
                  onChange={(e) => updateElementsStyle({ color: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 h-8 text-xs"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* 字体设置（仅文本元素） */}
      {elements.some(el => el.type === 'text') && (
        <>
          <div>
            <Label className="text-xs font-medium text-gray-600">字体</Label>
            <div className="space-y-3 mt-2">
              {/* 字体大小 */}
              <div>
                <Label className="text-xs text-gray-500">字体大小</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="number"
                    value={getCommonValue('style', 'fontSize') || 16}
                    onChange={(e) => updateElementsStyle({ fontSize: parseInt(e.target.value) || 16 })}
                    className="w-20 h-8 text-xs"
                    min="8"
                    max="72"
                  />
                  <div className="flex-1">
                    <Slider
                      value={[getCommonValue('style', 'fontSize') || 16]}
                      onValueChange={(value) => updateElementsStyle({ fontSize: value[0] })}
                      max={72}
                      min={8}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* 字体粗细 */}
              <div>
                <Label className="text-xs text-gray-500">字体粗细</Label>
                <Select
                  value={getCommonValue('style', 'fontWeight') || 'normal'}
                  onValueChange={(value) => updateElementsStyle({ fontWeight: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">正常</SelectItem>
                    <SelectItem value="bold">粗体</SelectItem>
                    <SelectItem value="100">极细</SelectItem>
                    <SelectItem value="300">细</SelectItem>
                    <SelectItem value="500">中等</SelectItem>
                    <SelectItem value="600">半粗</SelectItem>
                    <SelectItem value="700">粗</SelectItem>
                    <SelectItem value="900">极粗</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 文字对齐 */}
              <div>
                <Label className="text-xs text-gray-500">文字对齐</Label>
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {[
                    { value: 'left', label: '左对齐' },
                    { value: 'center', label: '居中' },
                    { value: 'right', label: '右对齐' },
                    { value: 'justify', label: '两端对齐' }
                  ].map(align => (
                    <Button
                      key={align.value}
                      variant={getCommonValue('style', 'textAlign') === align.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateElementsStyle({ textAlign: align.value })}
                      className="h-8 text-xs"
                    >
                      {align.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* 边框和圆角 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">边框</Label>
        <div className="space-y-3 mt-2">
          {/* 边框 */}
          <div>
            <Label className="text-xs text-gray-500">边框</Label>
            <Input
              type="text"
              value={getCommonValue('style', 'border') || ''}
              onChange={(e) => updateElementsStyle({ border: e.target.value })}
              placeholder="1px solid #000000"
              className="h-8 text-xs"
            />
          </div>

          {/* 圆角 */}
          <div>
            <Label className="text-xs text-gray-500">圆角</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="number"
                value={getCommonValue('style', 'borderRadius') || 0}
                onChange={(e) => updateElementsStyle({ borderRadius: parseInt(e.target.value) || 0 })}
                className="w-20 h-8 text-xs"
                min="0"
                max="50"
              />
              <div className="flex-1">
                <Slider
                  value={[getCommonValue('style', 'borderRadius') || 0]}
                  onValueChange={(value) => updateElementsStyle({ borderRadius: value[0] })}
                  max={50}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* 间距 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">间距</Label>
        <div className="space-y-3 mt-2">
          {/* 内边距 */}
          <div>
            <Label className="text-xs text-gray-500">内边距</Label>
            <Input
              type="number"
              value={getCommonValue('style', 'padding') || 0}
              onChange={(e) => updateElementsStyle({ padding: parseInt(e.target.value) || 0 })}
              className="h-8 text-xs"
              min="0"
            />
          </div>

          {/* 外边距 */}
          <div>
            <Label className="text-xs text-gray-500">外边距</Label>
            <Input
              type="number"
              value={getCommonValue('style', 'margin') || 0}
              onChange={(e) => updateElementsStyle({ margin: parseInt(e.target.value) || 0 })}
              className="h-8 text-xs"
              min="0"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* 透明度 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">透明度</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="number"
            value={Math.round((getCommonValue('style', 'opacity') || 1) * 100)}
            onChange={(e) => updateElementsStyle({ opacity: (parseInt(e.target.value) || 100) / 100 })}
            className="w-20 h-8 text-xs"
            min="0"
            max="100"
          />
          <div className="flex-1">
            <Slider
              value={[Math.round((getCommonValue('style', 'opacity') || 1) * 100)]}
              onValueChange={(value) => updateElementsStyle({ opacity: value[0] / 100 })}
              max={100}
              min={0}
              step={1}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StylePanel