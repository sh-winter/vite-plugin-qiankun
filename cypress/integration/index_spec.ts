const APP_SELECTOR = '.Micro-app-container > div > #app'

/* eslint-disable no-undef */
before(() => {
  cy.visit(Cypress.env('baseUrl'))
})

describe('vite-plugin-qiankun test', () => {

  it('load micro app', () => {
    cy.get(APP_SELECTOR)
      .contains('qiankun-micro-app')
  })

  it('assert import', () => {
    cy.get(APP_SELECTOR)
      .find('img')
      .each(el => {
        el.on('load', () => {
          expect(el.prop('complete')).to.equal(true)
        })
      })
  })

  it('route lazy loading', () => {
    // 点击 about 按钮切换路由
    cy.get(APP_SELECTOR)
      .as('app')
      .find('a[href$="about"]')
      .click()

    // 等待
    cy.wait(200)

    // 验证内容是否正确
    cy.get('@app')
      .find('.about')
      .contains('This is an about page')
  })
})
