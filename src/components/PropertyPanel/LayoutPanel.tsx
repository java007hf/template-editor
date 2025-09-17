import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { useEditor } from '../../contexts/EditorContext'

export function LayoutPanel() {
  const { state, dispatch } = useEditor()
  const { currentTemplate } = state

  // 更新画布配置
  const updateCanvasConfig = (updates: any) => {
    const newTemplate = {
      ...currentTemplate,
      ...updates,
      metadata: {
        ...currentTemplate.metadata,
        updatedAt: new Date()
      }
    }
    dispatch({ type: 'SET_TEMPLATE', payload: newTemplate })
  }

  // 更新画布尺寸
  const updateCanvasSize = (key: 'width' | 'height', value: number) => {
    updateCanvasConfig({
      canvasSize: {
        ...currentTemplate.canvasSize,
        [key]: value
      }
    })
  }

  // 更新布局配置
  const updateLayoutConfig = (updates: any) => {
    updateCanvasConfig({
      layout: {
        ...currentTemplate.layout,
        ...updates
      }
    })
  }

  // 更新主题配置
  const updateThemeConfig = (updates: any) => {
    updateCanvasConfig({
      theme: {
        ...currentTemplate.theme,
        ...updates
      }
    })
  }

  // 预设画布尺寸
  const presetSizes = [
    { name: 'A4 (纵向)', width: 595, height: 842 },
    { name: 'A4 (横向)', width: 842, height: 595 },
    { name: '社交媒体', width: 1080, height: 1080 },
    { name: '横幅', width: 1200, height: 400 },
    { name: '名片', width: 350, height: 200 },
    { name: '海报', width: 600, height: 800 },
    { name: '自定义', width: currentTemplate.canvasSize.width, height: currentTemplate.canvasSize.height }
  ]

  return (
    <div className="space-y-4">
      {/* 模板信息 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">模板信息</Label>
        <div className="space-y-2 mt-2">
          <div>
            <Label className="text-xs text-gray-500">名称</Label>
            <Input
              value={currentTemplate.name}
              onChange={(e) => updateCanvasConfig({ name: e.target.value })}
              className="h-8 text-xs"
              placeholder="模板名称"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">描述</Label>
            <Input
              value={currentTemplate.description}
              onChange={(e) => updateCanvasConfig({ description: e.target.value })}
              className="h-8 text-xs"
              placeholder="模板描述"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* 画布尺寸 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">画布尺寸</Label>
        <div className="space-y-2 mt-2">
          {/* 预设尺寸 */}
          <div>
            <Label className="text-xs text-gray-500">预设尺寸</Label>
            <Select
              value={presetSizes.find(size => 
                size.width === currentTemplate.canvasSize.width && 
                size.height === currentTemplate.canvasSize.height
              )?.name || '自定义'}
              onValueChange={(value) => {
                const preset = presetSizes.find(size => size.name === value)
                if (preset) {
                  updateCanvasConfig({
                    canvasSize: { width: preset.width, height: preset.height }
                  })
                }
              }}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {presetSizes.map(size => (
                  <SelectItem key={size.name} value={size.name}>
                    {size.name} ({size.width}×{size.height})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 自定义尺寸 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">宽度</Label>
              <Input
                type="number"
                value={currentTemplate.canvasSize.width}
                onChange={(e) => updateCanvasSize('width', parseInt(e.target.value) || 800)}
                className="h-8 text-xs"
                min="100"
                max="2000"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">高度</Label>
              <Input
                type="number"
                value={currentTemplate.canvasSize.height}
                onChange={(e) => updateCanvasSize('height', parseInt(e.target.value) || 600)}
                className="h-8 text-xs"
                min="100"
                max="2000"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* 布局设置 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">布局设置</Label>
        <div className="space-y-2 mt-2">
          <div>
            <Label className="text-xs text-gray-500">布局类型</Label>
            <Select
              value={currentTemplate.layout.type}
              onValueChange={(value) => updateLayoutConfig({ type: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">单栏布局</SelectItem>
                <SelectItem value="double">双栏布局</SelectItem>
                <SelectItem value="three-column">三栏布局</SelectItem>
                <SelectItem value="multi">多栏布局</SelectItem>
                <SelectItem value="grid">网格布局</SelectItem>
                <SelectItem value="mixed">混合布局</SelectItem>
                <SelectItem value="sidebar">侧边栏布局</SelectItem>
                <SelectItem value="header-footer">头尾布局</SelectItem>
                <SelectItem value="card">卡片布局</SelectItem>
                <SelectItem value="masonry">瀑布流布局</SelectItem>
                <SelectItem value="magazine">杂志布局</SelectItem>
                <SelectItem value="dashboard">仪表盘布局</SelectItem>
                <SelectItem value="custom">自定义布局</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 布局描述 */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            {currentTemplate.layout.type === 'single' && '单栏布局：适合文章、博客等内容展示'}
            {currentTemplate.layout.type === 'double' && '双栏布局：适合新闻、产品对比等场景'}
            {currentTemplate.layout.type === 'three-column' && '三栏布局：适合门户网站、信息展示'}
            {currentTemplate.layout.type === 'multi' && '多栏布局：灵活的多列内容排列'}
            {currentTemplate.layout.type === 'grid' && '网格布局：规整的网格排列，适合图片展示'}
            {currentTemplate.layout.type === 'mixed' && '混合布局：结合多种布局方式，适合复杂页面'}
            {currentTemplate.layout.type === 'sidebar' && '侧边栏布局：主内容区+侧边栏，适合管理后台'}
            {currentTemplate.layout.type === 'header-footer' && '头尾布局：页头+内容+页脚的经典结构'}
            {currentTemplate.layout.type === 'card' && '卡片布局：以卡片形式展示内容，适合产品展示'}
            {currentTemplate.layout.type === 'masonry' && '瀑布流布局：不规则高度的流式布局，适合图片墙'}
            {currentTemplate.layout.type === 'magazine' && '杂志布局：类似杂志排版的复杂布局'}
            {currentTemplate.layout.type === 'dashboard' && '仪表盘布局：适合数据展示和监控面板'}
            {currentTemplate.layout.type === 'custom' && '自定义布局：完全自由的布局方式'}
          </div>

          {/* 快速配置 */}
          {currentTemplate.layout.type === 'three-column' && (
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">快速配置</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLayoutConfig({ columns: 3, rows: 1, gap: 16 })}
                  className="flex-1 h-8 text-xs"
                >
                  标准三栏
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLayoutConfig({ columns: 3, rows: 2, gap: 12 })}
                  className="flex-1 h-8 text-xs"
                >
                  双行三栏
                </Button>
              </div>
            </div>
          )}

          {currentTemplate.layout.type === 'card' && (
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">快速配置</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLayoutConfig({ columns: 2, rows: 2, gap: 20 })}
                  className="flex-1 h-8 text-xs"
                >
                  2×2卡片
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLayoutConfig({ columns: 3, rows: 2, gap: 16 })}
                  className="flex-1 h-8 text-xs"
                >
                  3×2卡片
                </Button>
              </div>
            </div>
          )}

          {currentTemplate.layout.type === 'dashboard' && (
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">快速配置</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLayoutConfig({ columns: 4, rows: 3, gap: 12 })}
                  className="flex-1 h-8 text-xs"
                >
                  标准仪表盘
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLayoutConfig({ columns: 6, rows: 4, gap: 8 })}
                  className="flex-1 h-8 text-xs"
                >
                  密集型
                </Button>
              </div>
            </div>
          )}

          {(currentTemplate.layout.type === 'multi' || 
            currentTemplate.layout.type === 'grid' || 
            currentTemplate.layout.type === 'three-column' ||
            currentTemplate.layout.type === 'card' ||
            currentTemplate.layout.type === 'masonry' ||
            currentTemplate.layout.type === 'magazine' ||
            currentTemplate.layout.type === 'dashboard') && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-500">列数</Label>
                <Input
                  type="number"
                  value={currentTemplate.layout.columns}
                  onChange={(e) => updateLayoutConfig({ columns: parseInt(e.target.value) || 1 })}
                  className="h-8 text-xs"
                  min="1"
                  max="12"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">行数</Label>
                <Input
                  type="number"
                  value={currentTemplate.layout.rows}
                  onChange={(e) => updateLayoutConfig({ rows: parseInt(e.target.value) || 1 })}
                  className="h-8 text-xs"
                  min="1"
                  max="12"
                />
              </div>
            </div>
          )}

          <div>
            <Label className="text-xs text-gray-500">间距</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="number"
                value={currentTemplate.layout.gap}
                onChange={(e) => updateLayoutConfig({ gap: parseInt(e.target.value) || 0 })}
                className="w-20 h-8 text-xs"
                min="0"
                max="100"
              />
              <div className="flex-1">
                <Slider
                  value={[currentTemplate.layout.gap]}
                  onValueChange={(value) => updateLayoutConfig({ gap: value[0] })}
                  max={100}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-500">内边距</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="number"
                value={currentTemplate.layout.padding}
                onChange={(e) => updateLayoutConfig({ padding: parseInt(e.target.value) || 0 })}
                className="w-20 h-8 text-xs"
                min="0"
                max="100"
              />
              <div className="flex-1">
                <Slider
                  value={[currentTemplate.layout.padding]}
                  onValueChange={(value) => updateLayoutConfig({ padding: value[0] })}
                  max={100}
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

      {/* 主题设置 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">主题设置</Label>
        <div className="space-y-2 mt-2">
          <div>
            <Label className="text-xs text-gray-500">主色调</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={currentTemplate.theme.primaryColor}
                onChange={(e) => updateThemeConfig({ primaryColor: e.target.value })}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                type="text"
                value={currentTemplate.theme.primaryColor}
                onChange={(e) => updateThemeConfig({ primaryColor: e.target.value })}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-500">辅助色</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={currentTemplate.theme.secondaryColor}
                onChange={(e) => updateThemeConfig({ secondaryColor: e.target.value })}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                type="text"
                value={currentTemplate.theme.secondaryColor}
                onChange={(e) => updateThemeConfig({ secondaryColor: e.target.value })}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-500">背景色</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={currentTemplate.theme.backgroundColor}
                onChange={(e) => updateThemeConfig({ backgroundColor: e.target.value })}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                type="text"
                value={currentTemplate.theme.backgroundColor}
                onChange={(e) => updateThemeConfig({ backgroundColor: e.target.value })}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-500">文字色</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={currentTemplate.theme.textColor}
                onChange={(e) => updateThemeConfig({ textColor: e.target.value })}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                type="text"
                value={currentTemplate.theme.textColor}
                onChange={(e) => updateThemeConfig({ textColor: e.target.value })}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-500">字体</Label>
            <Select
              value={currentTemplate.theme.fontFamily}
              onValueChange={(value) => updateThemeConfig({ fontFamily: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                <SelectItem value="Helvetica, Arial, sans-serif">Helvetica</SelectItem>
                <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                <SelectItem value="'Microsoft YaHei', sans-serif">微软雅黑</SelectItem>
                <SelectItem value="'SimHei', sans-serif">黑体</SelectItem>
                <SelectItem value="'SimSun', serif">宋体</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-500">基础字号</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="number"
                value={currentTemplate.theme.fontSize}
                onChange={(e) => updateThemeConfig({ fontSize: parseInt(e.target.value) || 16 })}
                className="w-20 h-8 text-xs"
                min="8"
                max="72"
              />
              <div className="flex-1">
                <Slider
                  value={[currentTemplate.theme.fontSize]}
                  onValueChange={(value) => updateThemeConfig({ fontSize: value[0] })}
                  max={72}
                  min={8}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* 视图设置 */}
      <div>
        <Label className="text-xs font-medium text-gray-600">视图设置</Label>
        <div className="space-y-2 mt-2">
          <div className="flex gap-2">
            <Button
              variant={state.showGrid ? "default" : "outline"}
              size="sm"
              onClick={() => dispatch({ type: 'TOGGLE_GRID' })}
              className="flex-1 h-8 text-xs"
            >
              网格
            </Button>
            <Button
              variant={state.snapToGrid ? "default" : "outline"}
              size="sm"
              onClick={() => dispatch({ type: 'TOGGLE_SNAP' })}
              className="flex-1 h-8 text-xs"
            >
              对齐
            </Button>
          </div>

          <div>
            <Label className="text-xs text-gray-500">网格大小</Label>
            <Input
              type="number"
              value={state.gridSize}
              onChange={(e) => dispatch({ type: 'SET_ZOOM', payload: parseInt(e.target.value) || 20 })}
              className="h-8 text-xs"
              min="5"
              max="50"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500">缩放比例</Label>
            <div className="flex gap-2 mt-1">
              <span className="text-xs text-gray-500 w-12">{Math.round(state.zoom * 100)}%</span>
              <div className="flex-1">
                <Slider
                  value={[state.zoom]}
                  onValueChange={(value) => dispatch({ type: 'SET_ZOOM', payload: value[0] })}
                  max={3}
                  min={0.1}
                  step={0.1}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LayoutPanel