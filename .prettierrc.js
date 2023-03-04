const prettierConfigStandard = require('prettier-config-standard')
const merge = require('lodash.merge')

const modifiedConfig = merge(
  {},
  prettierConfigStandard,
  {
    semi: true,
    // ... other modified settings here
  }
)

module.exports = modifiedConfig