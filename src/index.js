#!/usr/bin/env node

import pc from 'picocolors'
import fs from 'fs'
import path from 'path'
import { intro, outro, select, spinner, confirm, text } from '@clack/prompts'
import { frameworks } from './frameworks.js'
import { trytm } from '@bdsqqq/try'
import {
  getPackages,
  getActualFramework,
  getNodeVersions,
  runProyect,
} from './shell.js'
import shell from 'shelljs'

function parseColors(str) {
  return str.replace(/\x1B\[[0-9;]*[mGK]/g, '')
}

async function main() {
  intro(
    pc.bgWhite('Bienvenido al selector de versiones de ') +
      pc.bgCyan(' Angular y Ionic ')
  )

  const s = spinner()
  s.start('Buscando package.json')

  const [data, error] = await trytm(getPackages())
  if (error) {
    outro(
      '\n' +
        pc.red(
          'No se encontró el package.json, por favor ejecuta este comando en la raíz de tu proyecto.'
        )
    )
    return
  }

  if (shell.test('-f', 'nvmrc.json')) {
    s.stop('nvmrc.json encontrado')
    outro(pc.cyan('Se encontró un archivo nvmrc.json'))
    const data = JSON.parse(shell.cat('nvmrc.json'))
    runProyect(data)
    return
  }

  const { dependencies } = data
  const { actualFramework } = getActualFramework({ dependencies, frameworks })

  const [versions, error1] = await trytm(getNodeVersions())
  if (error1) {
    console.log(error1)
    outro('\n' + pc.red('No se encontro el nvm, por favor instala nvm.'))
    return
  }

  if (!actualFramework) {
    outro(pc.cyan('No se encontró ningún framework.'))
    return
  }

  s.stop('package.json encontrado')
  const nodeVersion = await select({
    message:
      `${pc.cyan(
        `Hemos detectado que estás utilizando ${actualFramework.name}`
      )}` +
      `\n${pc.dim(
        pc.cyan('Porfavor selecciona la versión de node que deseas usar')
      )}`,
    options: versions.map((v) => ({
      value: v,
      label: v,
      hint: v.includes('\x1B[0;32m') ? pc.green('Actual') : '',
    })),
  })

  if (!nodeVersion) {
    outro(pc.cyan('Gracias por usar el selector. Creado por @jorgeTAC'))
    return
  }

  const selectEnviroment = await confirm({
    message: pc.cyan('¿Deseas seleccionar un ambiente?'),
  })

  if (!selectEnviroment) {
    outro(pc.cyan('Gracias por usar el selector. Creado por @jorgeTAC'))
    runProyect({ framework: actualFramework, nodeVersion })
  }

  const envName = await text({
    message: '¿Cuál es el ambiente?',
    placeholder: 'Escribe el ambiente',
    initialValue: 'prod',
    validate(value) {
      if (value.length === 0) return `Value is required!`
    },
  })

  outro(pc.cyan('Gracias por usar el selector. Creado por @jorgeTAC'))

  const saveToFile = await confirm({
    message: pc.cyan(
      '¿Deseas guardar la información recopilada en un archivo?'
    ),
  })

  if (saveToFile) {
    const filePath = path.join(process.cwd(), 'nvmrc.json')

    const data = {
      framework: actualFramework,
      nodeVersion: parseColors(nodeVersion),
      envConfig: envName || null,
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  }

  runProyect({
    framework: actualFramework,
    nodeVersion: parseColors(nodeVersion),
    envConfig: envName,
  })
}

main()
