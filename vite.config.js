import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// PlaceIQ frontend-only mode. API requests are handled by LocalStorage in React.
export default defineConfig({
  plugins: [react(), tailwindcss()]
});
