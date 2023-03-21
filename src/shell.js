#!/usr/bin/env node

import shell from 'shelljs'
import pc from 'picocolors'
import keypress from 'keypress'

keypress(process.stdin)
process.stdin.setRawMode(true)
process.stdin.resume()

const INIT_NVM = `
    #!/bin/bash
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
  // Detect ctrl+c in parent process
  process.stdin.on('data', function (data) {
    if (data == '\u0003') {
      console.log(pc.bgRed('parent received SIGINT'))
      process.exit()
    }
    process.stdout.write('Captured Key : ' + data + '\n')
  })

  // Set `process.stdin` into raw mode so that it emits a buffer containing `"\u0003"` when ctrl+c is pressed
  process.stdin.setRawMode(true)

  // Pipe parent stdin to child stdin, so child will receive buffer containing `"\u0003"`.

  // eventually exit example
  if (envConfig) {
    console.log(
      pc.cyan(
        `Ejecutando: ${framework.command} ${framework.envConfig + envConfig}`
      )
    )

    const child = shell.exec(
      `
          ${INIT_NVM}
          nvm use ${nodeVersion} && ${framework.command} ${
        framework.envConfig + envConfig
      }
          `,
      {
        async: true,
      }
    )

    process.stdin.pipe(child.stdin)
    return child
  }

  console.log(pc.cyan(`Ejecutando: ${framework.command}`))
  const child = shell.exec(
    `
    ${INIT_NVM}
    nvm use ${nodeVersion} && ${framework.command}
  `,
    {
      async: true,
      env: {
        ...process.env,
        HANDLE_SIGINT_IN_CHILD: true,
      },
    }
  )
  process.stdin.pipe(child.stdin)
  return child
}
