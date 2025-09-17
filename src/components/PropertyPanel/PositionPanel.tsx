import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react'
import { useEditor } from '../../contexts/EditorContext'
import { TemplateElement } from '../../types/editor'

interface PositionPanelProps {
  elements: TemplateElement[]
}

export function PositionPanel({ elements }: PositionPanelProps) {
  const { updateElement } = useEditor()

  // 获取通用值（如果所有元素都有相同值）
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

  // 更新多个元素的属性
  const updateElements = (updates: any) => {
    elements.forEach(element => {
      updateElement(element.id, updates)
    })
  }

  // 处理位置变化
  const handlePositionChange = (key: 'x' | 'y' | 'width' | 'height', value: string) => {
    const numValue = parseFloat(value) || 0
    updateElements({
      position: {
        ...elements[0].position,
        [key]: numValue
      }
    })
  }

  // 处理锁定状态切换
  const handleLockToggle = () => {
    const newLocked = !elements[0].locked
    updateElements({ locked: newLocked })
  }

  // 处理可见性切换
  const handleVisibilityToggle = () => {
    const newVisible = !elements[0].visible
    updateElements({ visible: newVisible })
  }

  // 处理层级调整
  const handleZIndexChange = (direction: 'up' | 'down' | 'top' | 'bottom') => {
    elements.forEach(element => {
      let newZIndex = element.zIndex
      
      switch (direction) {
        case 'up':
          newZIndex += 1
          break
        case 'down':
          newZIndex = Math.max(0, newZIndex - 1)
          break
        case 'top':
          newZIndex = 1000
          break
        case 'bottom':
          newZIndex = 0
          break
      }
      
      updateElement(element.id, { zIndex: newZIndex })
    })
  }

  return (
    <div className="space-y-4">
      {/* 位置和尺寸 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">位置和尺寸</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <Label htmlFor="x" className="text-xs text-gray-500">X</Label>
            <Input
              id="x"
              type="number"
              value={getCommonValue('position', 'x')}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="y" className="text-xs text-gray-500">Y</Label>
            <Input
              id="y"
              type="number"
              value={getCommonValue('position', 'y')}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="width" className="text-xs text-gray-500">宽度</Label>
            <Input
              id="width"
              type="number"
              value={getCommonValue('position', 'width')}
              onChange={(e) => handlePositionChange('width', e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-xs text-gray-500">高度</Label>
            <Input
              id="height"
              type="number"
              value={getCommonValue('position', 'height')}
              onChange={(e) => handlePositionChange('height', e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* 层级控制 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">层级</Label>
        <div className="flex gap-1 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZIndexChange('top')}
            className="flex-1 h-8 text-xs"
          >
            置顶
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZIndexChange('up')}
            className="flex-1 h-8 text-xs"
          >
            上移
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZIndexChange('down')}
            className="flex-1 h-8 text-xs"
          >
            下移
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZIndexChange('bottom')}
            className="flex-1 h-8 text-xs"
          >
            置底
          </Button>
        </div>
        <div className="mt-2">
          <Label htmlFor="zIndex" className="text-xs text-gray-500">层级值</Label>
          <Input
            id="zIndex"
            type="number"
            value={getCommonValue('zIndex')}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              updateElements({ zIndex: value })
            }}
            className="h-8 text-xs"
          />
        </div>
      </div>

      <Separator />

      {/* 状态控制 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">状态</Label>
        <div className="flex gap-2 mt-2">
          <Button
            variant={elements[0]?.locked ? "default" : "outline"}
            size="sm"
            onClick={handleLockToggle}
            className="flex-1 h-8 text-xs"
          >
            {elements[0]?.locked ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
            {elements[0]?.locked ? '已锁定' : '未锁定'}
          </Button>
          <Button
            variant={elements[0]?.visible ? "default" : "outline"}
            size="sm"
            onClick={handleVisibilityToggle}
            className="flex-1 h-8 text-xs"
          >
            {elements[0]?.visible ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
            {elements[0]?.visible ? '可见' : '隐藏'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PositionPanel