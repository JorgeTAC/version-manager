import shell from 'shelljs'
import pc from 'picocolors'

import { intro, outro, confirm, select, spinner } from '@clack/prompts'

async function main() {
  intro(
    pc.bgWhite('Bienvenido al selector de versiones de ') +
      pc.bgCyan(' Angular y Ionic ')
  )

  outro('Gracias por usar el selector. Creado por @jorgeTAC')
}

main()
