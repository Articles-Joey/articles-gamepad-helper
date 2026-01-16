// "use client";
// import React from 'react';
// import '#root/src/styles/components/GamepadPreview.scss';
// import '../styles/components/PieMenu.css';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import xboxLbIcon from '../img/Xbox UI/icons8-xbox-lb-96.png';

const DEFAULT_OPTIONS = [
    { label: 'Credits', value: 'credits' },
    { label: 'Map', value: 'map' },
    { label: 'Skills', value: 'skills' },
    { label: 'Quests', value: 'quests' },
    { label: 'Friends', value: 'friends' },
    { label: 'Achievements', value: 'achievements' },
    { label: 'GitHub', value: 'github' },
    { label: 'Go Back', value: 'go_back' },
    // { label: 'Settings', value: 'settings' },
    // { label: 'Inventory', value: 'inventory' },
    // { label: 'Map', value: 'map' },
    // { label: 'Skills', value: 'skills' },
    // { label: 'Quests', value: 'quests' },
    // { label: 'Magic', value: 'magic' },
    { label: 'Stats', value: 'stats' },
    // { label: 'Save', value: 'save' },
    { label: 'Settings', value: 'settings' },
];

const LETTER_OPTIONS = [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
    { label: 'C', value: 'c' },
    { label: 'D', value: 'd' },
    { label: 'E', value: 'e' },
    { label: 'F', value: 'f' },
    { label: 'G', value: 'g' },
    { label: 'H', value: 'h' },
    { label: 'I', value: 'i' },
    { label: 'J', value: 'j' },
    { label: 'K', value: 'k' },
    { label: 'L', value: 'l' },
    { label: 'M', value: 'm' },
    { label: 'N', value: 'n' },
    { label: 'O', value: 'o' },
    { label: 'P', value: 'p' },
    { label: 'Q', value: 'q' },
    { label: 'R', value: 'r' },
    { label: 'S', value: 's' },
    { label: 'T', value: 't' },
    { label: 'U', value: 'u' },
    { label: 'V', value: 'v' },
    { label: 'W', value: 'w' },
    { label: 'X', value: 'x' },
    { label: 'Y', value: 'y' },
    { label: 'Z', value: 'z' },
];

function PieMenu({
    onFinish,
    onCancel,
    options = DEFAULT_OPTIONS,
    // keyboardMode = true
    keyboardMode = false
}) {
    const [visible, setVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [thumbstick, setThumbstick] = useState({ x: 0, y: 0 });
    const requestRef = useRef();

    const calculatedOptions = keyboardMode ? LETTER_OPTIONS : options;

    // Check for gamepad input
    const updateLoop = useCallback(() => {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0]; // Assuming first gamepad

        if (gp) {
            // Check LB (Button 4)
            const lbPressed = gp.buttons[4].pressed;

            if (lbPressed) {
                if (!visible) setVisible(true);

                // Read Left Stick (axes 0 and 1)
                let x = gp.axes[0];
                let y = gp.axes[1];

                // Deadzone check
                const magnitude = Math.sqrt(x * x + y * y);
                if (magnitude > 0.3) { // 30% deadzone
                    setThumbstick({ x, y });

                    // Calculate angle
                    // atan2 returns -PI to PI. 
                    // 0 is Right. -PI/2 is Up. PI/2 is Down. PI/-PI is Left.
                    let angle = Math.atan2(y, x) * (180 / Math.PI);

                    // Normalize to 0-360 starting from Right (0) counter-clockwise?
                    // actually atan2 is counter-clockwise from positive X.
                    // y is often inverted on gamepads (Up is -1).
                    // Let's normalize to 0-360 positive.
                    if (angle < 0) angle += 360;

                    // 0 is Right. 90 is Down. 180 is Left. 270 is Up.

                    // We want to map this to our 8 segments.
                    // Segment size = 45 degrees.
                    // To center the first item (at index 0) maybe at the top?
                    // If options[0] is Top, we want angle around 270.

                    const segmentSize = 360 / calculatedOptions.length;

                    // Adjust angle so 0 starts at the beginning of a segment?
                    // Let's align logically.
                    // visual 0 degrees is usually top for users.
                    // math 0 degrees is right.
                    // let's shift angle so 0 is top.
                    // angle = (angle + 90) % 360; 

                    // Now: 0 is Up (was 270 + 90 = 360 -> 0).
                    // 90 is Right (was 0 + 90).
                    // 180 is Down (was 90 + 90).
                    // 270 is Left (was 180 + 90).

                    let shiftedAngle = (angle + 90) % 360;

                    // Calculate index
                    // We want rounding to nearest segment center.
                    // segment centers are 0, 45, 90...
                    // simple int div: 
                    const index = Math.round(shiftedAngle / segmentSize) % calculatedOptions.length;
                    setSelectedIndex(index);

                } else {
                    // Inside deadzone
                    setSelectedIndex(-1);
                    setThumbstick({ x: 0, y: 0 }); // reset stick vis
                }

            } else {
                if (visible) {
                    setVisible(false);
                    if (selectedIndex !== -1) {
                        // Action confirmed on release
                        console.log("Selected:", calculatedOptions[selectedIndex]);
                        if (onFinish) onFinish(calculatedOptions[selectedIndex]);
                    }
                }
            }
        }

        requestRef.current = requestAnimationFrame(updateLoop);
    }, [visible, selectedIndex, onFinish, calculatedOptions]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateLoop);
        return () => cancelAnimationFrame(requestRef.current);
    }, [updateLoop]);


    if (!visible) {
        return (
            <div style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 10000 }}>
                <img src={xboxLbIcon} alt="Hold LB" style={{ width: '64px', opacity: 0.7 }} />
            </div>
        );
    }

    const radius = 120; // Distance of items from center

    return (
        <div
            className="articles-PieMenu-component"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999
            }}
        >

            <div
                className="orb"
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "rgba(0, 0, 0, 0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    zIndex: "10000",
                }}
            >
                {/* Center Icon */}
                <div style={{ position: 'relative', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={xboxLbIcon} alt="Pie Menu" style={{ width: '100%', opacity: 0.8 }} />
                    {/* Thumbstick indicator */}
                    {thumbstick.x !== 0 && (
                        <div style={{
                            position: 'absolute',
                            width: '10px',
                            height: '10px',
                            background: 'cyan',
                            borderRadius: '50%',
                            transform: `translate(${thumbstick.x * 20}px, ${thumbstick.y * 20}px)`,
                            boxShadow: '0 0 5px cyan'
                        }} />
                    )}
                </div>

                {/* Radial Options */}
                {calculatedOptions.map((opt, i) => {
                    // Position calculations
                    // -90 degrees offset to start from top because Math.cos/sin starts from Right
                    const angleRad = ((i * (360 / calculatedOptions.length)) - 90) * (Math.PI / 180);
                    const x = Math.cos(angleRad) * radius;
                    const y = Math.sin(angleRad) * radius;

                    const isSelected = i === selectedIndex;

                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                transform: `translate(${x}px, ${y}px)`,
                                background: isSelected ? 'cyan' : 'rgba(50,50,50,0.8)',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                color: isSelected ? 'black' : 'white',
                                fontWeight: isSelected ? 'bold' : 'normal',
                                whiteSpace: 'nowrap',
                                boxShadow: isSelected ? '0 0 10px cyan' : 'none',
                                pointerEvents: 'none', // Let input pass through if needed
                                transition: 'all 0.1s ease'
                            }}
                        >
                            {opt.label}
                        </div>
                    );
                })}


            </div>

        </div>
    );
};

export default memo(PieMenu);
