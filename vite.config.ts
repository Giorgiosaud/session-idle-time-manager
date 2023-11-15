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
    setupFiles:[
      'setupFiles/localStorage.ts'
    ]
    // ...
  },
})