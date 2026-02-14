
import { useEffect } from 'react';
import { create } from 'zustand';

// Zustand store for controller status
const useControllerStatusStore = create((set) => ({
    connected: false,
    setConnected: (connected) => set({ connected }),
}));

// Custom hook to sync gamepad connection state
export function useControllerStatus() {
    const setConnected = useControllerStatusStore((state) => state.setConnected);

    useEffect(() => {
        const updateGamepadStatus = () => {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const connected = Array.from(gamepads).some((gp) => gp !== null);
            setConnected(connected);
        };

        window.addEventListener('gamepadconnected', updateGamepadStatus);
        window.addEventListener('gamepaddisconnected', updateGamepadStatus);
        updateGamepadStatus();

        return () => {
            window.removeEventListener('gamepadconnected', updateGamepadStatus);
            window.removeEventListener('gamepaddisconnected', updateGamepadStatus);
        };
    }, [setConnected]);

    // Return the current connection state
    const connected = useControllerStatusStore((state) => state.connected);
    return connected;
}

// For direct store access if needed
export default useControllerStatusStore;

// Use as const isGamepadConnected = useControllerStatus();