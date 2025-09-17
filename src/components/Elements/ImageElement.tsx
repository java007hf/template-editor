import React, { useRef } from 'react'
import { ImageElement as ImageElementType } from '../../types/editor'
import { useEditor } from '../../contexts/EditorContext'
import { Upload, Image } from 'lucide-react'

interface ImageElementProps {
  element: ImageElementType
}

export function ImageElement({ element }: ImageElementProps) {
  const { updateElement } = useEditor()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const src = e.target?.result as string
        updateElement(element.id, {
          content: {
            ...element.content,
            src,
            alt: file.name
          }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // 处理点击上传
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!element.content.src) {
      fileInputRef.current?.click()
    }
  }

  // 处理拖拽上传
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const src = e.target?.result as string
          updateElement(element.id, {
            content: {
              ...element.content,
              src,
              alt: file.name
            }
          })
        }
        reader.readAsDataURL(file)
      }
    }
  }

  // 图片样式
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: element.content.fit || 'cover',
    borderRadius: element.style.borderRadius || 0,
    border: element.style.border
  }

  return (
    <div 
      className="w-full h-full relative group"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {element.content.src ? (
        <>
          <img
            src={element.content.src}
            alt={element.content.alt}
            style={imageStyle}
            className="select-none"
          />
          
          {/* 悬停时显示替换按钮 */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              className="bg-white text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-100 transition-colors"
            >
              更换图片
            </button>
          </div>
        </>
      ) : (
        <div 
          className="w-full h-full border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
          style={{ borderRadius: element.style.borderRadius || 8 }}
        >
          <div className="text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">点击上传图片</p>
            <p className="text-xs text-gray-400">或拖拽图片到此处</p>
          </div>
        </div>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}

export default ImageElement