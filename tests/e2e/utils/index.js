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
    cy.get(selector).eq(index).contains(expected).should((elem) => {
      expect(elem.text().trim()).to.equal(expected)
    })
  },
  count (expected) {
    cy.get(selector).should((elem) => expect(elem.length).to.equal(expected))
  }
})
