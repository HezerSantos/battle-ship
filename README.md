npm init -y



"setup": "npm install --save-dev webpack webpack-cli html-webpack-plugin style-loader css-loader html-loader webpack-dev-server prettier && npx webpack && node --eval \"require('fs').writeFileSync('.prettierrc', '{}\\n')\" && node --eval \"require('fs').writeFileSync('.prettierignore', '# Ignore artifacts:\\nbuild\\ncoverage\\n')\""

"setup": "npm install --save-dev webpack webpack-cli html-webpack-plugin style-loader css-loader html-loader webpack-dev-server prettier jest babel-jest @babel/core @babel/preset-env @babel/preset-react && npx webpack && node --eval \"require('fs').writeFileSync('.prettierrc', '{}\\n')\" && node --eval \"require('fs').writeFileSync('.prettierignore', '# Ignore artifacts:\\nbuild\\ncoverage\\n')\" && node --eval \"require('fs').writeFileSync('babel.config.js', 'module.exports = { presets: [\"@babel/preset-env\", \"@babel/preset-react\"] };\\n')\" && node --eval \"require('fs').writeFileSync('jest.config.js', 'module.exports = { transform: { \\'^.+\\\\.jsx?$\\': \\'babel-jest\\' } };\\n')\""

module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};