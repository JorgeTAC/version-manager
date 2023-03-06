import pc from 'picocolors'
import { intro, outro, select, spinner, confirm, text } from '@clack/prompts'
import { frameworks } from './src/frameworks.js'
import { trytm } from '@bdsqqq/try'
import {
  getPackages,
  getActualFramework,
  getNodeVersions,
  runProyect,
} from './src/shell.js'

/* Un intento de usar la librería para evitar el try catch hell */

function parseColors(str) {
  return str.replace(/\x1B\[[0-9;]*[mGK]/g, '')
}

async function introStep() {
  intro(
    pc.bgWhite('Bienvenido al selector de versiones de ') +
      pc.bgCyan(' Angular y Ionic ')
  )

  const shouldContinue = await confirm({
    message:
      pc.cyan('Buscaremos en que framework estás trabajando\n') +
      pc.cyan('¿Deseas continuar?'),
  })

  if (!shouldContinue) {
    outro(pc.cyan('Gracias por usar el selector. Creado por @jorgeTAC'))
    process.exit(0)
  }
}

async function main() {
  await introStep()

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
  runProyect({
    framework: actualFramework,
    nodeVersion: parseColors(nodeVersion),
    envConfig: envName,
  })
}

main()
