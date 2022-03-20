import { Utils } from "../../support/utils"

let helper = new Utils();
let header = [];
let rows = [];

describe('Upload car form details', () => {

  before(() => {
    cy.parseXl(Cypress.env('xlPath')).then((data) => {
      console.log(data[0])
      for (let i = 0; i < data[0].length; i++) {
        header.push(data[0][i])
      }
      for (let i = 1; i < data.length; i++) {
        rows.push(data[i])
      }
    })
  })

  beforeEach(() => {
    cy.visit('https://docs.google.com/forms/d/e/1FAIpQLSebkrm-wS6iZjnz7U1AkogNCbvmsUOFjFRtfCkFNm6-li7CsA/viewform');
  })

  for (let i = 0; i < Cypress.env('rows') - 1; i++) {
    it('Test - Upload form details for excel row ' + (i+1), () => {
      for (let j = 0; j < header.length; j++) {
        if (rows[i][j] != '') {
          helper.UploadFormDetails(header[j], rows[i][j])
        }
      }
      helper.submitForm();
    })
  }
})
