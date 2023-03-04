import pc from 'picocolors'
import { intro, outro, select, spinner } from '@clack/prompts'

async function main() {
  intro(
    pc.bgWhite('Bienvenido al selector de versiones de ') +
      pc.bgCyan(' Angular y Ionic ')
  )

  const projectType = await select({
    message: 'Pick a project type.',
    options: [
      { value: 'ts', label: 'TypeScript' },
      { value: 'js', label: 'JavaScript' },
      { value: 'coffee', label: 'CoffeeScript', hint: 'oh no' }
    ]
  })

  const s = spinner()
  s.start('Installing via npm')
  await new Promise((resolve) => setTimeout(resolve, 2000))
  s.stop('Installed via npm')

  outro(pc.cyan('Gracias por usar el selector. Creado por @jorgeTAC'))
}

main()
