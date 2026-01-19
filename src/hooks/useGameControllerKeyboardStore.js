import { create } from 'zustand'

const useGameControllerKeyboardStore = create((set) => ({

    visible: false,
    setVisible: (visible) => set({ visible }),

    lastClosedTime: null,
    setLastClosedTime: (time) => set({ lastClosedTime: time }),

}))

export default useGameControllerKeyboardStore
