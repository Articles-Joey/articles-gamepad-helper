import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias: {
  //     '@': resolve(__dirname, './src'),
  //   },
  // },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'index.js'),
        GamepadPreview: resolve(__dirname, 'src/components/GamepadPreview.jsx'),
        GamepadKeyboard: resolve(__dirname, 'src/components/GamepadKeyboard.jsx'),
        PieMenu: resolve(__dirname, 'src/components/PieMenu.jsx'),
        PieKeyboard: resolve(__dirname, 'src/components/PieKeyboard.jsx'),
        useGameControllerKeyboardStore: resolve(__dirname, 'src/hooks/useGameControllerKeyboardStore.js'),
        usePieMenuStore: resolve(__dirname, 'src/hooks/usePieMenuStore.js'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
