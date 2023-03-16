#!/usr/bin/env node

import shell from 'shelljs'
import pc from 'picocolors'

const INIT_NVM = `
     export NVM_DIR=~/.nvm
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

    lazynvm() {
      unset -f nvm node npm
      export NVM_DIR=~/.nvm
      [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
    }

    nvm() {
      lazynvm 
      nvm $@
    }
`

/* await shell.exec(`
   ${INIT_NVM}
    nvm use

    projects
    architect
    build
    configurations
  `) */

export async function getPackages() {
  const stdout = shell.cat('package.json')
  const { dependencies } = JSON.parse(stdout)
  return { dependencies }
}

export async function getNodeVersions() {
  const versions = shell.exec(
    `
  ${INIT_NVM}
  nvm ls --no-alias`,
    { silent: true }
  )
  return versions
    .trim()
    .split('\n')
    .map((v) => v.replace(/ /g, '').replace('->', '').replace('v', ''))
}

export function getActualFramework({ dependencies, frameworks }) {
  const keysDependencies = Object.keys(dependencies)

  if (keysDependencies.some((k) => k.includes('@ionic'))) {
    return { actualFramework: frameworks.find((f) => f.key === 'ionic') }
  }

  if (keysDependencies.some((k) => k.includes('@angular'))) {
    return { actualFramework: frameworks.find((f) => f.key === 'angular') }
  }

  return { actualFramework: null }
}

export function runProyect({ framework, nodeVersion, envConfig }) {
  if (envConfig) {
    console.log(
      pc.cyan(
        `Ejecutando: ${framework.command} ${framework.envConfig + envConfig}`
      )
    )
    shell.exec(`
      ${INIT_NVM}
      nvm use ${nodeVersion} && ${framework.command} ${
      framework.envConfig + envConfig
    }
    `)
    return
  }

  console.log(pc.cyan(`Ejecutando: ${framework.command}`))
  shell.exec(`
    ${INIT_NVM}
    nvm use ${nodeVersion} && ${framework.command}
  `)
}
