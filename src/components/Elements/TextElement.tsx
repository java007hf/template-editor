import React, { useState, useRef, useEffect } from 'react'
import { TextElement as TextElementType } from '../../types/editor'
import { useEditor } from '../../contexts/EditorContext'

interface TextElementProps {
  element: TextElementType
}

export function TextElement({ element }: TextElementProps) {
  const { updateElement } = useEditor()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(element.content.text)
  const textRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 处理双击进入编辑模式
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setEditText(element.content.text)
  }

  // 处理编辑完成
  const handleEditComplete = () => {
    setIsEditing(false)
    if (editText !== element.content.text) {
      updateElement(element.id, {
        content: {
          ...element.content,
          text: editText
        }
      })
    }
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEditComplete()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditText(element.content.text)
    }
  }

  // 自动聚焦到输入框
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // 文本样式
  const textStyle: React.CSSProperties = {
    fontSize: element.style.fontSize || 16,
    fontFamily: element.style.fontFamily || 'inherit',
    fontWeight: element.style.fontWeight || 'normal',
    color: element.style.color || '#000000',
    textAlign: element.style.textAlign || 'left',
    lineHeight: 1.4,
    margin: 0,
    padding: element.style.padding || 0,
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap'
  }

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleEditComplete}
        onKeyDown={handleKeyDown}
        style={{
          ...textStyle,
          border: '2px solid #3b82f6',
          outline: 'none',
          resize: 'none',
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
        className="absolute inset-0"
      />
    )
  }

  return (
    <div
      ref={textRef}
      data-element-type="text"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: element.style.textAlign || 'center',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        ...textStyle
      }}
      onDoubleClick={handleDoubleClick}
      className="cursor-text select-none hover:bg-blue-50 hover:bg-opacity-30 transition-colors"
    >
      {element.content.text || element.content.placeholder || '双击编辑文本'}
    </div>
  )
}

export default TextElement