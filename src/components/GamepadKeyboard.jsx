"use client";
// import React from 'react';
// import '#root/src/styles/components/GamepadPreview.scss';
import '../styles/components/GamepadKeyboard.scss';

// export default function GamepadPreview() {
//   return (
//     <div className='articles-gamepad-helper-component articles-GamepadPreview'>
//     </div>
//   );
// };

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import useGameControllerKeyboardStore from '#root/src/hooks/useGameControllerKeyboardStore';

const KEYS = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.'],
    ['SPACE', 'BACKSPACE', 'FINISH']
];

export default function GamepadKeyboard({ onFinish, onCancel }) {

    const visible = useGameControllerKeyboardStore((state) => state.visible);
    // const visible = true;

    const setVisible = useGameControllerKeyboardStore((state) => state.setVisible);

    // const [isVisible, setIsVisible] = useState(false);

    const [text, setText] = useState('');
    const [currentRow, setCurrentRow] = useState(1);
    const [currentCol, setCurrentCol] = useState(0);
    
    const lastInputTime = useRef(0);
    const requestRef = useRef();

    const handleInput = useCallback(() => {
        const gamepads = navigator.getGamepads();
        if (!gamepads) return;
        const gp = gamepads[0];
        if (!gp) return;

        const now = performance.now();
        
        // Toggle Visibility with Y (Button 3)
        if (gp.buttons[3].pressed) {
             if (now - lastInputTime.current > 300) { // Longer debounce for toggle
                setVisible(prev => !prev);
                lastInputTime.current = now;
             }
             return;
        }

        if (!visible) return;

        if (now - lastInputTime.current < 150) return; // 150ms debounce for navigation

        // Navigation
        let moved = false;
        // Up
        if (gp.buttons[12].pressed || gp.axes[1] < -0.5) {
            if (currentRow > 0) {
                setCurrentRow(prev => prev - 1);
                // Adjust col if needed
                const maxCol = KEYS[currentRow - 1].length - 1;
                setCurrentCol(prev => Math.min(prev, maxCol));
                moved = true;
            }
        }
        // Down
        else if (gp.buttons[13].pressed || gp.axes[1] > 0.5) {
            if (currentRow < KEYS.length - 1) {
                setCurrentRow(prev => prev + 1);
                const maxCol = KEYS[currentRow + 1].length - 1;
                setCurrentCol(prev => Math.min(prev, maxCol));
                moved = true;
            }
        }
        // Left
        else if (gp.buttons[14].pressed || gp.axes[0] < -0.5) {
            if (currentCol > 0) {
                setCurrentCol(prev => prev - 1);
                moved = true;
            }
        }
        // Right
        else if (gp.buttons[15].pressed || gp.axes[0] > 0.5) {
            if (currentCol < KEYS[currentRow].length - 1) {
                setCurrentCol(prev => prev + 1);
                moved = true;
            }
        }

        // Select with A (Button 0)
        if (gp.buttons[0].pressed) {
            const key = KEYS[currentRow][currentCol];
            if (key === 'SPACE') {
                setText(prev => prev + ' ');
            } else if (key === 'BACKSPACE') {
                setText(prev => prev.slice(0, -1));
            } else if (key === 'FINISH') {
                if (onFinish) onFinish(text);
                setVisible(false);
            } else {
                setText(prev => prev + key);
            }
            moved = true;
        }
        
        // Close/Cancel with B (Button 1)
        if (gp.buttons[1].pressed) {
             setVisible(false);
             if (onCancel) onCancel();
             moved = true;
        }

        if (moved) {
            lastInputTime.current = now;
        }

    }, [visible, currentRow, currentCol, text, onFinish, onCancel]);

    useEffect(() => {
        const loop = () => {
            handleInput();
            requestRef.current = requestAnimationFrame(loop);
        };
        requestRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(requestRef.current);
    }, [handleInput]);

    if (!visible) return null;

    return (
        <div className="keyboard-overlay">
            <div className="keyboard-display">{text}</div>
            <div className="keyboard-grid">
                {KEYS.map((row, rIndex) => (
                    <div key={rIndex} className="keyboard-row">
                        {row.map((key, cIndex) => (
                            <div 
                                key={key} 
                                className={`key ${rIndex === currentRow && cIndex === currentCol ? 'active' : ''} ${['SPACE', 'BACKSPACE', 'FINISH'].includes(key) ? 'wide' : ''}`}
                            >
                                {key}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="instructions">
                <p>D-Pad to Navigate | A to Select | Y to Close</p>
            </div>
        </div>
    );
};