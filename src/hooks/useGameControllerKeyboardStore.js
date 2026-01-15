import { create } from 'zustand'

const useGameControllerKeyboardStore = create((set) => ({

    visible: false,
    setVisible: (visible) => set({ visible }),

}))

export default useGameControllerKeyboardStore
