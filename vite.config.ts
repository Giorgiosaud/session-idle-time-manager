import { defineConfig } from 'vitest/config'

export default defineConfig({
  build:{
    lib:{
      entry:'src/main.ts',
      name:'session-idle-time-manager',
      formats:['es','umd','cjs'],
    }
  },
  test: {
    browser: {
      enabled: true,
      name: 'chrome', // browser name is required
    },
    setupFiles:[
      'setupFiles/localStorage.ts'
    ]
    // ...
  },
})