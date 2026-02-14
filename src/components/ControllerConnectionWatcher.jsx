import { useEffect, useState } from 'react';

import '../styles/components/ControllerConnectionWatcher.scss';

export default function ControllerConnectionWatcher() {

    const [isGamepadConnected, setIsGamepadConnected] = useState(false);

    useEffect(() => {
        const updateGamepadStatus = () => {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const connected = Array.from(gamepads).some(gp => gp !== null);
            console.log("Gamepad status:", connected);
            setIsGamepadConnected(connected);
        };

        // window.ongamepaddisconnected = (event) => {
        //     console.log("Lost connection with the gamepad.");
        //     console.log("Gamepad object:", event.gamepad);
        //     // Update game state as needed
        // };

        window.addEventListener("gamepadconnected", updateGamepadStatus);
        window.addEventListener("gamepaddisconnected", updateGamepadStatus);
        updateGamepadStatus();

        return () => {
            window.removeEventListener("gamepadconnected", updateGamepadStatus);
            window.removeEventListener("gamepaddisconnected", updateGamepadStatus);
        }
    }, []);

    useEffect(() => {
        if (isGamepadConnected) {
            document.body.setAttribute("data-gamepad-helper-controller-connected", 'true');
        } else {
            document.body.removeAttribute("data-gamepad-helper-controller-connected");
        }
    }, [isGamepadConnected]);

    // This component is intentionally left blank as it only serves to trigger the useControllerStatus hook
    return null;
}