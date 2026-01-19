# Articles Gamepad Helper

![Preview](/src/img/articles-gamepad-helper.webp)

React components to help with game development. Primarily used for Articles Media related games but made public to help others!

## Getting Started

For local development, navigate to this project and run this command.

```bash
npm link
```

Then go to the consuming project directory and run this command.

```bash
npm link @articles-media/articles-gamepad-helper
```

You will need to have a dev script running to watch for changes and build the dist to see local changes

```bash
npm run dev
```

## Package Exports

- GamepadPreview
    - Live preview of connected gamepad state via dynamic SVG
- GamepadKeyboard
    - Overlay to allow typing with controller without the need for keyboard and mouse. Imagine you are on a couch or arcade machine.
- PieMenu
    - Easily configurable menu that can be used to quickly map actions to a PieMenu hidden behind a held key, defaults to LB
- useGameControllerKeyboardStore
    - Needed store for handling component state, exported so you can watch for and set state if needed
- usePieMenuStore
    - Store associated with the PieMenu component
- XboxIcons
    - Collection of controller button icons 

# Tested and supported gamepads
✅ Wireless Xbox One Controllers (2013+)

# Roadmap
⏹️ Other gamepad support

# TODO
⏹️ Record video demo  
⏹️ Create website demo  
⏹️ Steam Controller UI Elements  
⏹️ Playstation Controller UI Elements  

# Contributing

You are more then welcome to help! Keep pull request small and make sure your builds pass before pushing.

# Support

Support this package by donating to Articles Media or by contributing your time to helping with issues.

# Attributions

Xbox Controller UI buttons - [Icons8](https://icons8.com/)

Steam Controller UI buttons - [Icons8](https://icons8.com/)