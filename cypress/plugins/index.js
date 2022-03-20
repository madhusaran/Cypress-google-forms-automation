const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor')
var xlsx = require('xlsx');

function getRwos() {
  let wb = xlsx.readFile('./cypress/fixtures/testData.xlsx')
  return xlsx.utils.sheet_to_json(wb.Sheets['test'], { header: 1, defval: "" }).length
}

module.exports = (on, config) => {

  on('task', {
    parseXlsx({ filePath }) {
      return new Promise((resolve, reject) => {
        try {
          let wb = xlsx.readFile(filePath)
          const data = JSON.parse(JSON.stringify(xlsx.utils.sheet_to_json(wb.Sheets['test'], { header: 1, defval: "", raw: false })))
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    }
  })

  on('file:preprocessor', cypressTypeScriptPreprocessor);
  config.env.rows = getRwos();
  return config


}
