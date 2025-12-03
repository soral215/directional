import { create } from 'zustand'
import type { ReactNode } from 'react'

interface ModalState {
  isOpen: boolean
  title: string
  content: ReactNode | null
  openModal: (options: { title: string; content: ReactNode }) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: '',
  content: null,
  openModal: ({ title, content }) =>
    set({
      isOpen: true,
      title,
      content,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      title: '',
      content: null,
    }),
}))

