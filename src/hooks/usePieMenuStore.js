import { create } from 'zustand'

const usePieMenuStore = create((set) => ({

    visible: false,
    setVisible: (visible) => set({ visible }),

}))

export default usePieMenuStore
