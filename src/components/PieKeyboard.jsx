// "use client";
// import React from 'react';
// import '#root/src/styles/components/GamepadPreview.scss';
// import '../styles/components/PieMenu.css';

import React, { useState, useEffect, useRef, useCallback, memo, useMemo, use } from 'react';

// import xboxLbIcon from '../img/Xbox UI/icons8-xbox-lb-96.png';
import lb from "../../public/img/Xbox UI/icons8-xbox-lb-96.png";
import rb from "../../public/img/Xbox UI/icons8-xbox-rb-96.png";

import usePieMenuStore from '../hooks/usePieMenuStore';

const LETTER_OPTIONS = [
    { label: 'a', value: 'a' },
    { label: 'b', value: 'b' },
    { label: 'c', value: 'c' },
    { label: 'd', value: 'd' },
    { label: 'e', value: 'e' },
    { label: 'f', value: 'f' },
    { label: 'g', value: 'g' },
    { label: 'h', value: 'h' },
    { label: 'i', value: 'i' },
    { label: 'j', value: 'j' },
    { label: 'k', value: 'k' },
    { label: 'l', value: 'l' },
    { label: 'm', value: 'm' },
    { label: 'n', value: 'n' },
    { label: 'o', value: 'o' },
    { label: 'p', value: 'p' },
    { label: 'q', value: 'q' },
    { label: 'r', value: 'r' },
    { label: 's', value: 's' },
    { label: 't', value: 't' },
    { label: 'u', value: 'u' },
    { label: 'v', value: 'v' },
    { label: 'w', value: 'w' },
    { label: 'x', value: 'x' },
    { label: 'y', value: 'y' },
    { label: 'z', value: 'z' },
    { label: 'Backspace', value: 'backspace' },
    { label: 'Space', value: ' ' },
    { label: 'Enter', value: 'enter' },
    { label: 'Switch Case', value: 'switch_case' },
    { label: 'Numbers', value: 'numbers' },
];

const NUMBER_OPTIONS = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '0', value: '0' },
    { label: '.', value: '.' },
    { label: ',', value: ',' },
    { label: '!', value: '!' },
    { label: '?', value: '?' },
    { label: '@', value: '@' },
    { label: '#', value: '#' },
    { label: '$', value: '$' },
    { label: '%', value: '%' },
    { label: '&', value: '&' },
    { label: '*', value: '*' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '-', value: '-' },
    { label: '+', value: '+' },
    { label: '=', value: '=' },
    { label: '/', value: '/' },
    { label: 'Backspace', value: 'backspace' },
    { label: 'Space', value: ' ' },
    { label: 'Enter', value: 'enter' },
    // { label: 'Switch Case', value: 'switch_case' },
    { label: 'Letters', value: 'letters' },
];

/**
 * A reusable pie keyboard component.
 * @param {object} props - The component props.
 * @param {string} props.value - If provided, makes the component controlled with this value.
 * @param {string} props.onFinish - ...
 * @param {string} props.className - If provided, makes the component controlled with this value.
 * @param {string} props.id - Optional id for the component.
 * @param {number} props.menuItemRadius - Radius for menu items in single mode.
 * @param {number} props.dualMenuItemRadius - Radius for menu items in dual mode.
 * @param {function} props.onCancel - Callback to closes the pie menu without selection if in controlled visibility mode.
 * @param {boolean} [props.dual] - Optional dual thumb stick usage state.
 * @param {boolean} [props.allowDualSwitching] - Optional state to allow switching between single and dual mode.
 * @param {boolean} [props.isDisabled] - Optional disable state.
 */
function PieKeyboard({
    onFinish,
    onCancel,
    options = LETTER_OPTIONS,
    className,
    value,
    id,
    disableDefaultHotkey = false,
    active,
    allowEnter,
    onClear,
    dual,
    isDisabled = false,
    allowDualSwitching,
    menuItemRadius = 200,
    dualMenuItemRadius = 160,
}) {
    const storeVisible = usePieMenuStore((state) => state.visible);
    const setStoreVisible = usePieMenuStore((state) => state.setVisible);

    const [upperCase, setUpperCase] = useState(false);
    const [numbers, setNumbers] = useState(false);

    // Single mode state
    const [singleSelectedIndex, setSingleSelectedIndex] = useState(-1);
    const [singleThumbstick, setSingleThumbstick] = useState({ x: 0, y: 0 });

    // Dual mode states
    const [leftVisible, setLeftVisible] = useState(false);
    const [rightVisible, setRightVisible] = useState(false);
    const [leftSelectedIndex, setLeftSelectedIndex] = useState(-1);
    const [rightSelectedIndex, setRightSelectedIndex] = useState(-1);
    const [leftThumbstick, setLeftThumbstick] = useState({ x: 0, y: 0 });
    const [rightThumbstick, setRightThumbstick] = useState({ x: 0, y: 0 });

    const [dualMode, setDualMode] = useState(false);

    useEffect(() => {
        if (dual) {
            setDualMode(dual);
        } else {
            setDualMode(false);
        }
    }, [dual]);

    const requestRef = useRef();

    // Memoized options to handle "Clear" prepending
    const finalOptions = useMemo(() => {
        let opts = numbers ? [...NUMBER_OPTIONS] : [...options];
        if (onClear) {
            opts = [
                ...opts,
                { label: 'Clear', value: 'clear' },
            ];
        }
        if (allowDualSwitching) {
            opts = [
                ...opts,
                { label: 'Dual Mode', value: 'dual_mode' }, 
            ];
        }
        return opts;
    }, [options, onClear, numbers, allowDualSwitching]);

    const { leftOptions, rightOptions } = useMemo(() => {
        if (!dualMode) return { leftOptions: [], rightOptions: [] };

        if (numbers) {
            const numRegex = /^[0-9]$/;
            const left = finalOptions.filter(o => numRegex.test(o.value));
            const right = finalOptions.filter(o => !numRegex.test(o.value));
            return { leftOptions: left, rightOptions: right };
        }

        const mid = Math.ceil(finalOptions.length / 2);
        const left = finalOptions.slice(0, mid);
        const right = finalOptions.slice(mid);

        return { leftOptions: left, rightOptions: right };
    }, [finalOptions, dualMode, numbers]);

    const handleAction = (selectionIndex, currentOptions) => {
        if (selectionIndex === -1) return;
        const selectedOption = currentOptions[selectionIndex];

        if (
            [
                "Enter",
                "Backspace",
                "Switch Case",
                "Numbers",
                "Clear",
                "Letters",
                "Dual Mode"
            ].includes(selectedOption.label)
        ) {
            console.log("Special action:", selectedOption);

            if (selectedOption.label === "Clear") {
                if (onClear) onClear();
            } else if (selectedOption.label === "Switch Case") {
                setUpperCase(prev => !prev);
            } else if (selectedOption.label === "Numbers") {
                setNumbers(prev => !prev);
            } else if (selectedOption.label === "Letters") {
                setNumbers(false);
            } else if (selectedOption.label === "Enter" && allowEnter) {
                onFinish(value + '\n');
            } else if (selectedOption.label === "Backspace") {
                onFinish(value.slice(0, -1));
            } else if (selectedOption.label === "Dual Mode" && allowDualSwitching) {
                setDualMode(!dualMode);
            }

            // if (selectedOption.value === 'enter' || selectedOption.value === 'backspace') {
            //     onFinish(value + selectedOption.value);
            // }

        } else {
            let val = selectedOption.value;
            if (upperCase && typeof val === 'string' && val.length === 1) {
                val = val.toUpperCase();
            }
            onFinish(value + val);
        }
    };

    const processStick = (axX, axY, currentOptions) => {
        const magnitude = Math.sqrt(axX * axX + axY * axY);
        if (magnitude > 0.3) {
            let angle = Math.atan2(axY, axX) * (180 / Math.PI);
            if (angle < 0) angle += 360;
            let shiftedAngle = (angle + 90) % 360;
            const segmentSize = 360 / currentOptions.length;
            const index = Math.round(shiftedAngle / segmentSize) % currentOptions.length;
            return { index, thumb: { x: axX, y: axY } };
        }
        return { index: -1, thumb: { x: 0, y: 0 } };
    };

    const updateLoop = useCallback(() => {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0];

        if (gp) {
            if (dualMode) {
                // === LEFT SIDE (LB) ===
                const lbPressed = gp.buttons[4].pressed;
                if (lbPressed) {
                    if (!leftVisible) setLeftVisible(true);
                    const { index, thumb } = processStick(gp.axes[0], gp.axes[1], leftOptions);
                    setLeftSelectedIndex(index);
                    setLeftThumbstick(thumb);
                } else {
                    if (leftVisible) {
                        setLeftVisible(false);
                        handleAction(leftSelectedIndex, leftOptions);
                        setLeftSelectedIndex(-1);
                    }
                }

                // === RIGHT SIDE (RB) ===
                const rbPressed = gp.buttons[5].pressed; // Xbox RB is Button 5
                if (rbPressed) {
                    if (!rightVisible) setRightVisible(true);
                    const { index, thumb } = processStick(gp.axes[2], gp.axes[3], rightOptions); // Right stick usually 2, 3
                    setRightSelectedIndex(index);
                    setRightThumbstick(thumb);
                } else {
                    if (rightVisible) {
                        setRightVisible(false);
                        handleAction(rightSelectedIndex, rightOptions);
                        setRightSelectedIndex(-1);
                    }
                }

            } else {
                // === SINGLE MODE ===
                const lbPressed = gp.buttons[4].pressed;
                if (lbPressed) {
                    if (!storeVisible) setStoreVisible(true);
                    const { index, thumb } = processStick(gp.axes[0], gp.axes[1], finalOptions);
                    setSingleSelectedIndex(index);
                    setSingleThumbstick(thumb);
                } else {
                    if (storeVisible) {
                        setStoreVisible(false);
                        handleAction(singleSelectedIndex, finalOptions);
                        setSingleSelectedIndex(-1);
                    }
                }
            }
        }
        requestRef.current = requestAnimationFrame(updateLoop);
    }, [dualMode, storeVisible, leftVisible, rightVisible, singleSelectedIndex, leftSelectedIndex, rightSelectedIndex, finalOptions, leftOptions, rightOptions, onFinish, upperCase, value]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateLoop);
        return () => cancelAnimationFrame(requestRef.current);
    }, [updateLoop]);

    // === RENDER HELPERS ===

    const renderOrb = (opts, selectedIdx, thumb, centerIcon, style) => {

        const radius = dualMode ? dualMenuItemRadius : menuItemRadius;

        return (
            <div
                className="orb"
                style={{
                    position: "fixed",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "rgba(0, 0, 0, 0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    zIndex: "10000",
                    ...style
                }}
            >
                {/* Center Icon */}
                <div style={{ position: 'relative', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={centerIcon} alt="Pie Menu" style={{ width: '100%', opacity: 0.8 }} />
                    {thumb.x !== 0 && (
                        <div style={{
                            position: 'absolute',
                            width: '10px',
                            height: '10px',
                            background: 'cyan',
                            borderRadius: '50%',
                            transform: `translate(${thumb.x * 20}px, ${thumb.y * 20}px)`,
                            boxShadow: '0 0 5px cyan'
                        }} />
                    )}
                </div>

                {/* Radial Options */}
                {opts.map((opt, i) => {
                    const angleRad = ((i * (360 / opts.length)) - 90) * (Math.PI / 180);
                    const x = Math.cos(angleRad) * radius;
                    const y = Math.sin(angleRad) * radius;
                    const isSelected = i === selectedIdx;

                    // Style overrides
                    let bg = isSelected ? 'cyan' : 'rgba(50,50,50,0.8)';
                    let fg = isSelected ? 'black' : 'white';

                    if (opt.label === "Switch Case") {
                        if (upperCase) {
                            bg = isSelected ? 'cyan' : 'blue';
                        }
                    }

                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                transform: `translate(${x}px, ${y}px)`,
                                background: bg,
                                padding: '5px 10px',
                                borderRadius: '4px',
                                color: fg,
                                fontWeight: isSelected ? 'bold' : 'normal',
                                whiteSpace: 'nowrap',
                                boxShadow: isSelected ? '0 0 10px cyan' : 'none',
                                pointerEvents: 'none',
                                transition: 'all 0.1s ease',
                                ...(upperCase && { textTransform: 'uppercase' })
                            }}
                        >
                            {opt.label}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (dualMode) {
        if (!leftVisible && !rightVisible) {
            return (
                <>
                    <div style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 10000 }}>
                        <img src={lb} alt="Hold LB" style={{ width: '64px', opacity: 0.7 }} />
                    </div>
                    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 10000 }}>
                        <img src={rb} alt="Hold RB" style={{ width: '64px', opacity: 0.7 }} />
                    </div>
                </>
            )
        }

        return (
            <div className={`articles-PieKeyboard-component dual ${className || ''}`} id={id} style={{ zIndex: 9999 }}>
                {/* Left Overlay */}
                {leftVisible && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '50vw', height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}>
                        {renderOrb(leftOptions, leftSelectedIndex, leftThumbstick, lb, { top: "50%", left: "25%", transform: "translate(-50%, -50%)" })}
                    </div>
                )}

                {/* Right Overlay */}
                {rightVisible && (
                    <div style={{
                        position: 'fixed', top: 0, left: '50vw', width: '50vw', height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}>
                        {renderOrb(rightOptions, rightSelectedIndex, rightThumbstick, rb, { top: "50%", left: "75%", transform: "translate(-50%, -50%)" })}
                    </div>
                )}
            </div>
        );
    }

    // Single Mode
    else {
        if (!storeVisible) {
            return (
                <div style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 10000 }}>
                    <img src={lb} alt="Hold LB" style={{ width: '64px', opacity: 0.7 }} />
                </div>
            );
        }

        return (
            <div
                className={`articles-PieKeyboard-component ${className || ''}`}
                id={id}
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
                {renderOrb(finalOptions, singleSelectedIndex, singleThumbstick, lb, { top: "50%", left: "50%", transform: "translate(-50%, -50%)" })}
            </div>
        );
    }
};

export default memo(PieKeyboard);
