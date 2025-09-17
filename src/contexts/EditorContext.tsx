import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { 
  EditorState, 
  TemplateConfig, 
  TemplateElement, 
  HistoryState,
  Position,
  Size 
} from '../types/editor'

// 编辑器动作类型
type EditorAction = 
  | { type: 'SET_TEMPLATE'; payload: TemplateConfig }
  | { type: 'ADD_ELEMENT'; payload: TemplateElement }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<TemplateElement> } }
  | { type: 'DELETE_ELEMENT'; payload: string }
  | { type: 'SELECT_ELEMENTS'; payload: string[] }
  | { type: 'MOVE_ELEMENT'; payload: { id: string; position: Position } }
  | { type: 'RESIZE_ELEMENT'; payload: { id: string; size: Size } }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'SET_RESIZING'; payload: boolean }
  | { type: 'TOGGLE_GRID'; payload?: boolean }
  | { type: 'TOGGLE_SNAP'; payload?: boolean }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_STATE'; payload: { action: string; description: string } }
  | { type: 'COPY_ELEMENTS' }
  | { type: 'PASTE_ELEMENTS'; payload: Position }

// 初始状态
const initialState: EditorState = {
  currentTemplate: {
    id: uuidv4(),
    name: '新模板',
    description: '',
    thumbnail: '',
    layout: {
      type: 'custom',
      columns: 1,
      rows: 1,
      gap: 16,
      padding: 24
    },
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Inter, sans-serif',
      fontSize: 16
    },
    elements: [],
    canvasSize: { width: 800, height: 600 },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0',
      tags: []
    }
  },
  selectedElements: [],
  clipboard: [],
  history: [],
  historyIndex: -1,
  isDragging: false,
  isResizing: false,
  showGrid: true,
  snapToGrid: true,
  gridSize: 20,
  zoom: 1
}

// 状态管理器
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_TEMPLATE':
      return {
        ...state,
        currentTemplate: action.payload,
        selectedElements: [],
        history: [],
        historyIndex: -1
      }

    case 'ADD_ELEMENT': {
      const newElement = action.payload
      const newTemplate = {
        ...state.currentTemplate,
        elements: [...state.currentTemplate.elements, newElement],
        metadata: {
          ...state.currentTemplate.metadata,
          updatedAt: new Date()
        }
      }
      return {
        ...state,
        currentTemplate: newTemplate,
        selectedElements: [newElement.id]
      }
    }

    case 'UPDATE_ELEMENT': {
      const { id, updates } = action.payload
      const newElements = state.currentTemplate.elements.map(element =>
        element.id === id ? { ...element, ...updates } : element
      )
      const newTemplate = {
        ...state.currentTemplate,
        elements: newElements,
        metadata: {
          ...state.currentTemplate.metadata,
          updatedAt: new Date()
        }
      }
      return {
        ...state,
        currentTemplate: newTemplate
      }
    }

    case 'DELETE_ELEMENT': {
      const elementId = action.payload
      const newElements = state.currentTemplate.elements.filter(
        element => element.id !== elementId
      )
      const newTemplate = {
        ...state.currentTemplate,
        elements: newElements,
        metadata: {
          ...state.currentTemplate.metadata,
          updatedAt: new Date()
        }
      }
      return {
        ...state,
        currentTemplate: newTemplate,
        selectedElements: state.selectedElements.filter(id => id !== elementId)
      }
    }

    case 'SELECT_ELEMENTS':
      return {
        ...state,
        selectedElements: action.payload
      }

    case 'MOVE_ELEMENT': {
      const { id, position } = action.payload
      const newElements = state.currentTemplate.elements.map(element =>
        element.id === id 
          ? { ...element, position: { ...element.position, ...position } }
          : element
      )
      const newTemplate = {
        ...state.currentTemplate,
        elements: newElements,
        metadata: {
          ...state.currentTemplate.metadata,
          updatedAt: new Date()
        }
      }
      return {
        ...state,
        currentTemplate: newTemplate
      }
    }

    case 'RESIZE_ELEMENT': {
      const { id, size } = action.payload
      const newElements = state.currentTemplate.elements.map(element =>
        element.id === id 
          ? { ...element, position: { ...element.position, ...size } }
          : element
      )
      const newTemplate = {
        ...state.currentTemplate,
        elements: newElements,
        metadata: {
          ...state.currentTemplate.metadata,
          updatedAt: new Date()
        }
      }
      return {
        ...state,
        currentTemplate: newTemplate
      }
    }

    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: action.payload
      }

    case 'SET_RESIZING':
      return {
        ...state,
        isResizing: action.payload
      }

    case 'TOGGLE_GRID':
      return {
        ...state,
        showGrid: action.payload !== undefined ? action.payload : !state.showGrid
      }

    case 'TOGGLE_SNAP':
      return {
        ...state,
        snapToGrid: action.payload !== undefined ? action.payload : !state.snapToGrid
      }

    case 'SET_ZOOM':
      return {
        ...state,
        zoom: Math.max(0.1, Math.min(5, action.payload))
      }

    case 'SAVE_STATE': {
      const historyState: HistoryState = {
        id: uuidv4(),
        action: action.payload.action as any,
        timestamp: new Date(),
        templateState: { ...state.currentTemplate },
        description: action.payload.description
      }
      
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        historyState
      ].slice(-50) // 限制历史记录数量
      
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1
      }
    }

    case 'UNDO': {
      if (state.historyIndex > 0) {
        const previousState = state.history[state.historyIndex - 1]
        return {
          ...state,
          currentTemplate: previousState.templateState,
          historyIndex: state.historyIndex - 1
        }
      }
      return state
    }

    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const nextState = state.history[state.historyIndex + 1]
        return {
          ...state,
          currentTemplate: nextState.templateState,
          historyIndex: state.historyIndex + 1
        }
      }
      return state
    }

    case 'COPY_ELEMENTS': {
      const selectedElements = state.currentTemplate.elements.filter(
        element => state.selectedElements.includes(element.id)
      )
      return {
        ...state,
        clipboard: selectedElements
      }
    }

    case 'PASTE_ELEMENTS': {
      const pastePosition = action.payload
      const newElements = state.clipboard.map((element, index) => ({
        ...element,
        id: uuidv4(),
        position: {
          ...element.position,
          x: pastePosition.x + (index * 20),
          y: pastePosition.y + (index * 20)
        }
      }))
      
      const newTemplate = {
        ...state.currentTemplate,
        elements: [...state.currentTemplate.elements, ...newElements],
        metadata: {
          ...state.currentTemplate.metadata,
          updatedAt: new Date()
        }
      }
      
      return {
        ...state,
        currentTemplate: newTemplate,
        selectedElements: newElements.map(el => el.id)
      }
    }

    default:
      return state
  }
}

// 编辑器上下文
interface EditorContextType {
  state: EditorState
  dispatch: React.Dispatch<EditorAction>
  // 便捷方法
  addElement: (element: TemplateElement) => void
  updateElement: (id: string, updates: Partial<TemplateElement>) => void
  deleteElement: (id: string) => void
  selectElements: (ids: string[]) => void
  moveElement: (id: string, position: Position) => void
  resizeElement: (id: string, size: Size) => void
  undo: () => void
  redo: () => void
  copyElements: () => void
  pasteElements: (position: Position) => void
  saveState: (action: string, description: string) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

// 编辑器提供者组件
interface EditorProviderProps {
  children: ReactNode
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, initialState)

  // 便捷方法
  const addElement = useCallback((element: TemplateElement) => {
    dispatch({ type: 'SAVE_STATE', payload: { action: 'add', description: `添加${element.type}元素` } })
    dispatch({ type: 'ADD_ELEMENT', payload: element })
  }, [])

  const updateElement = useCallback((id: string, updates: Partial<TemplateElement>) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } })
  }, [])

  const deleteElement = useCallback((id: string) => {
    dispatch({ type: 'SAVE_STATE', payload: { action: 'delete', description: '删除元素' } })
    dispatch({ type: 'DELETE_ELEMENT', payload: id })
  }, [])

  const selectElements = useCallback((ids: string[]) => {
    dispatch({ type: 'SELECT_ELEMENTS', payload: ids })
  }, [])

  const moveElement = useCallback((id: string, position: Position) => {
    dispatch({ type: 'MOVE_ELEMENT', payload: { id, position } })
  }, [])

  const resizeElement = useCallback((id: string, size: Size) => {
    dispatch({ type: 'RESIZE_ELEMENT', payload: { id, size } })
  }, [])

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' })
  }, [])

  const copyElements = useCallback(() => {
    dispatch({ type: 'COPY_ELEMENTS' })
  }, [])

  const pasteElements = useCallback((position: Position) => {
    dispatch({ type: 'SAVE_STATE', payload: { action: 'add', description: '粘贴元素' } })
    dispatch({ type: 'PASTE_ELEMENTS', payload: position })
  }, [])

  const saveState = useCallback((action: string, description: string) => {
    dispatch({ type: 'SAVE_STATE', payload: { action, description } })
  }, [])

  const contextValue: EditorContextType = {
    state,
    dispatch,
    addElement,
    updateElement,
    deleteElement,
    selectElements,
    moveElement,
    resizeElement,
    undo,
    redo,
    copyElements,
    pasteElements,
    saveState
  }

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  )
}

// 使用编辑器上下文的 Hook
export function useEditor() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}