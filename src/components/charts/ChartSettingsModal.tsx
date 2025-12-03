import { useState, useEffect } from 'react'
import { Button } from '../Button'
import type { ChartItemConfig } from '../../stores'

const COLOR_PALETTE = [
  '#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
]

interface ChartSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  items: ChartItemConfig[]
  onApply: (items: ChartItemConfig[]) => void
}

export const ChartSettingsModal = ({
  isOpen,
  onClose,
  items,
  onApply,
}: ChartSettingsModalProps) => {
  const [localItems, setLocalItems] = useState<ChartItemConfig[]>(items)
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setLocalItems(items)
      setActiveColorPicker(null)
    }
  }, [isOpen, items])

  if (!isOpen) return null

  const handleToggleVisibility = (key: string) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, visible: !item.visible } : item
      )
    )
  }

  const handleColorChange = (key: string, color: string) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, color } : item
      )
    )
  }

  const handleApply = () => {
    onApply(localItems)
    onClose()
  }

  const handleReset = () => {
    setLocalItems(items)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">차트 설정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 max-h-80 overflow-y-auto space-y-3">
          {localItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setActiveColorPicker(activeColorPicker === item.key ? null : item.key)}
                    className="w-8 h-8 rounded-lg border-2 border-gray-600 cursor-pointer hover:border-gray-500 transition"
                    style={{ backgroundColor: item.color }}
                  />
                  {activeColorPicker === item.key && (
                    <div className="absolute top-10 left-0 bg-gray-900 border border-gray-700 rounded-lg p-3 z-10 w-60">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {COLOR_PALETTE.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorChange(item.key, color)}
                            className="w-9 h-9 rounded-lg cursor-pointer hover:scale-105 transition"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                        <input
                          type="color"
                          value={item.color}
                          onChange={(e) => handleColorChange(item.key, e.target.value)}
                          className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span className="text-gray-400 text-xs">직접 선택</span>
                      </div>
                      <button
                        onClick={() => setActiveColorPicker(null)}
                        className="w-full mt-2 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition cursor-pointer"
                      >
                        확인
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-white text-sm">{item.label}</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-gray-400 text-xs">
                  {item.visible ? '보임' : '숨김'}
                </span>
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={() => handleToggleVisibility(item.key)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-blue-500 cursor-pointer"
                />
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700">
          <Button variant="secondary" onClick={handleReset}>
            초기화
          </Button>
          <Button variant="primary" onClick={handleApply}>
            적용
          </Button>
        </div>
      </div>
    </div>
  )
}

