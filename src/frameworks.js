#!/usr/bin/env node

export const frameworks = [
  {
    key: 'angular',
    name: 'Angular',
    command: 'ng serve',
    envConfig: '--configuration=',
    defaultPort: 4200,
  },
  {
    key: 'ionic',
    name: 'Ionic',
    command: 'ionic serve',
    envConfig: '--configuration=',
    defaultPort: 8100,
  },
  {
    key: 'react',
    name: 'React',
    command: 'npm start',
    envConfig: '--configuration=',
  },
  {
    key: 'vue',
    name: 'Vue',
    command: 'npm run serve',
    envConfig: '--configuration=',
  },
  {
    key: 'svelte',
    name: 'Svelte',
    command: 'npm run dev',
    envConfig: '--configuration=',
  },
]
