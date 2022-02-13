export const moveTo = {
  myPage () {
    this.eventList()
    cy.get('.e2e-side-icon').eq(0).click()
    cy.get('.e2e-user-name').eq(0).click()
    cy.get('.e2e-my-page').should('be.visible')
  },
  eventList () {
    cy.get('.e2e-event-list').should('be.visible')
  },
  eventDetail () {
    this.eventList()
    cy.get('.e2e-event-title').eq(0).click()
    cy.get('.e2e-event-detail').should('be.visible')
  },
  presentationDetail () {
    this.eventDetail()
    cy.get('.e2e-presentation-title').eq(0).click()
    cy.get('.e2e-presentation-detail').should('be.visible')
  }
}

export const assert = (selector, index = 0) => ({
  text (expected) {
    cy.get(selector).eq(index).should((elem) => {
      expect(elem.text().trim()).to.equal(expected)
    })
  },
  notNull () {
    cy.get(selector).eq(index).should((elem) => expect(elem.text().trim()).to.be.not.null)
  },
  count (expected) {
    cy.get(selector).should((elem) => expect(elem.length).to.equal(expected))
  }
})

export const setValue = (selector, index = 0) => ({
  textBox (value) {
    cy.get(`${selector} input`).eq(index).clear()
    cy.get(`${selector} input`).eq(index).type(value)
  },
  textArea (value) {
    cy.get(`${selector} textArea`).eq(index).clear()
    cy.get(`${selector} textArea`).eq(index).type(value)
  },
  check (value) {
    if (value) {
      cy.get(`${selector} input`).eq(index).check({ force: true })
    } else {
      cy.get(`${selector} input`).eq(index).uncheck({ force: true })
    }
  }
})
