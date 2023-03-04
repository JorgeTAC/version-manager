import shell from 'shelljs'
import { trytm } from '@bdsqqq/try'

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
  `) */

export async function getPackages() {
  const [stdout, error] = await trytm(shell.cat('package.json'))
  if (error) throw error

  const { dependencies, devDependencies } = JSON.parse(stdout)

  return { dependencies, devDependencies }
}

export async function getSelectedFramework() {
  console.log(INIT_NVM)
  const [stdout, error] = await trytm(shell.exec('nvm current'))
  if (error) throw error

  return stdout
}
