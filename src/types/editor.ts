// 模板编辑器相关类型定义

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface ElementStyle {
  backgroundColor?: string
  color?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  border?: string
  borderRadius?: number
  padding?: number
  margin?: number
  opacity?: number
  boxShadow?: string
}

export interface TemplateElement {
  id: string
  type: 'text' | 'image' | 'shape' | 'container'
  position: Position & Size
  style: ElementStyle
  content: any
  zIndex: number
  locked: boolean
  visible: boolean
  parentId?: string
  children?: string[]
}

export interface TextElement extends TemplateElement {
  type: 'text'
  content: {
    text: string
    placeholder?: string
  }
}

export interface ImageElement extends TemplateElement {
  type: 'image'
  content: {
    src: string
    alt: string
    fit: 'cover' | 'contain' | 'fill' | 'scale-down'
  }
}

export interface ShapeElement extends TemplateElement {
  type: 'shape'
  content: {
    shape: 'rectangle' | 'circle' | 'triangle' | 'line'
    strokeWidth?: number
    strokeColor?: string
    fillColor?: string
  }
}

export interface ContainerElement extends TemplateElement {
  type: 'container'
  content: {
    layout: 'flex' | 'grid' | 'absolute'
    direction?: 'row' | 'column'
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
    gap?: number
  }
}

export interface LayoutConfig {
  type: 'single' | 'double' | 'multi' | 'grid' | 'custom' | 'mixed' | 'sidebar' | 'header-footer' | 'three-column' | 'card' | 'masonry' | 'magazine' | 'dashboard'
  columns: number
  rows: number
  gap: number
  padding: number
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  fontSize: number
}

export interface TemplateConfig {
  id: string
  name: string
  description: string
  thumbnail: string
  layout: LayoutConfig
  theme: ThemeConfig
  elements: TemplateElement[]
  canvasSize: Size
  metadata: {
    createdAt: Date
    updatedAt: Date
    version: string
    tags: string[]
    author?: string
  }
}

export interface HistoryState {
  id: string
  action: 'add' | 'delete' | 'move' | 'edit' | 'style' | 'resize'
  timestamp: Date
  templateState: TemplateConfig
  description: string
}

export interface EditorState {
  currentTemplate: TemplateConfig
  selectedElements: string[]
  clipboard: TemplateElement[]
  history: HistoryState[]
  historyIndex: number
  isDragging: boolean
  isResizing: boolean
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
  zoom: number
}

export interface DragItem {
  type: string
  elementType?: 'text' | 'image' | 'shape' | 'container'
  element?: TemplateElement
  isNew?: boolean
}

export interface DropResult {
  position: Position
  targetId?: string
}

// 预设模板类型
export interface PresetTemplate {
  id: string
  name: string
  description: string
  preview: string
  category: string
  config: TemplateConfig
}

// 元素库项目
export interface ElementLibraryItem {
  id: string
  name: string
  icon: string
  type: 'text' | 'image' | 'shape' | 'container'
  defaultProps: Partial<TemplateElement>
}

// 工具栏操作
export type ToolbarAction = 
  | 'select'
  | 'text'
  | 'image'
  | 'shape'
  | 'container'
  | 'zoom-in'
  | 'zoom-out'
  | 'zoom-fit'
  | 'grid'
  | 'snap'
  | 'undo'
  | 'redo'
  | 'copy'
  | 'paste'
  | 'delete'
  | 'save'
  | 'export'

// 属性面板配置
export interface PropertyPanelConfig {
  position: boolean
  size: boolean
  style: boolean
  content: boolean
  advanced: boolean
}