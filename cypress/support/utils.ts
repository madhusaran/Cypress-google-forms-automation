import * as moment from 'moment';
import * as locator from '../fixtures/locators.json'
import { dataTypes } from './enums';

export class Utils {

    /**
     * Get feild type and Upload user details
     * @param name name of the form feild
     * @param value Value to be updated
     */
    UploadFormDetails(name: string, value: string) {
        cy.get(locator.ui_locators.formFields).contains(name).parents(locator.ui_locators.formFields).scrollIntoView().as(name).then(($ele) => {
            if ($ele.find(locator.locatorType.date).length > 0) {
                this.updateInputField(dataTypes.date, value, name)
            } else if ($ele.find(locator.locatorType.text).length === 1 && $ele.find(locator.locatorType.checkBox).length === 0) {
                this.updateInputField(dataTypes.text, value, name)
            } else if ($ele.find(locator.locatorType.textarea).length > 0) {
                this.updateInputField(dataTypes.textarea, value, name)
            } else if ($ele.find(locator.locatorType.dropDown).length > 0) {
                this.updateInputField(dataTypes.dropDown, value, name)
            } else if ($ele.find(locator.locatorType.radioButton).length > 0) {
                this.updateInputField(dataTypes.radio, value, name)
            } else if ($ele.find(locator.locatorType.checkBox).length > 0) {
                this.updateInputField(dataTypes.checkbox, value, name)
            } else if ($ele.has(locator.locatorType.time).length > 0) {
                this.updateInputField(dataTypes.time, value, name)
            }
        })
    }

    /**
     * Updates the input field based on the data type
     * @param type Type of the variable
     * @param val Value to be updated on the field
     * @param name Form field name
     */
    private updateInputField(type: dataTypes, val: string, name: string) {
        switch (type) {
            case dataTypes.text:
                cy.get('@' + name).find('input').type(val).should('contain.value', val);
                break;
            case dataTypes.date:
                let d = moment(val).format('YYYY-MM-DD');
                cy.get('@' + name).find('input').type(d).should('contain.value', d);
                break;
            case dataTypes.textarea:
                cy.get('@' + name).find('textarea').type(val).should('contain.value', val);
                break;
            case dataTypes.time:
                let hour = val.split(':')[0]
                let minute = val.split(':')[1].substring(0, 2)
                cy.get('@' + name).find('input').eq(0).type(hour).should('contain.value', hour);
                cy.get('@' + name).find('input').eq(1).type(minute).should('contain.value', minute);
                break;
            case dataTypes.dropDown:
                cy.get('@' + name).find(locator.locatorType.dropDown).click().then(() => {
                    cy.wait(1000);
                    cy.get('@' + name).find(locator.locatorType.dropDownOptions).contains(val).first().click();
                    cy.wait(200);
                })
                cy.get('@' + name).find(locator.locatorType.dropDown).should('contain.text', val)
                break;
            case dataTypes.checkbox:
                let actual = val.split(',')
                let onUI = []
                cy.get('@' + name).find('label').each(($e) => {
                    onUI.push($e.text())
                }).then(() => {
                    actual.forEach((a) => {
                        if (onUI.indexOf(a) === -1) {
                            cy.get('@' + name).find(locator.locatorType.text).type(a); if (actual.indexOf(a) != actual.length - 1) {
                                cy.get('@' + name).find(locator.locatorType.text).type(',');
                            }
                        } else {
                            cy.get('@' + name).find('label').contains(a).wait(500).click({ waitForAnimations: true });
                        }
                    })
                })
                break;
            case dataTypes.radio:
                cy.get('@' + name).find(locator.locatorType.radioButton).find('[dir="auto"]').contains(val).wait(300).click({ waitForAnimations: true })
                cy.get('@' + name).find('[role="radio"][aria-checked="true"]').scrollIntoView().invoke('attr', 'aria-label').should('eq', val)
                break;
            default: throw new Error('Data Type does not esits');
        }
    }

    /**
     * Submits the form
     */
    submitForm() {
        cy.get(locator.ui_locators.buttons).contains('Submit').scrollIntoView().click().then(() => {
            cy.url().should('include', '/formResponse')
            cy.get('div', { timeout: 10000 }).contains('Your response has been recorded.').should('be.visible')
        })
    }
}