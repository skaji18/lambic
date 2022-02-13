import { assert, moveTo } from '../utils'

describe('ゲストユーザによる操作', () => {
  beforeEach(() => {
    // Note: サイドメニューを閉じるのが面倒なので、画面サイズを大きくしておく
    cy.viewport('macbook-13')
    cy.visit('/')
  })

  it('サイドメニュー', () => {
    moveTo.eventList()

    cy.get('.e2e-side-icon').eq(0).click()
    assert('.e2e-user-name').text('ゲストユーザ')
    assert('.e2e-side-menu-item').count(2)
    assert('.e2e-side-menu-item', 0).text('イベント一覧')
    assert('.e2e-side-menu-item', 1).text('フィードバック')
  })

  it('マイページ', () => {
    cy.get('.e2e-side-icon').eq(0).click()
    cy.get('.e2e-user-name').eq(0).click()
    cy.get('.e2e-my-page').should('not.visible')
  })

  it('イベント一覧', () => {
    moveTo.eventList()

    assert('.e2e-event-title').text('イベント名')
    assert('.e2e-event-description').text('イベントの説明')
    assert('.e2e-event-date').text('2022/01/16（日）')
  })

  it('イベント詳細', () => {
    moveTo.eventDetail()

    assert('.e2e-event-title').text('イベント名')
    assert('.e2e-event-description').text('イベントの説明')
    assert('.e2e-event-date').text('2022/01/16（日）')
    assert('.e2e-presentation-title').text('発表タイトル')
    assert('.e2e-presenter-name').text('by 発表者')
    assert('.e2e-presentation-description').text('発表の説明')
  })

  it('発表登録', () => {
    moveTo.eventDetail()
    cy.get('.e2e-add-presentation').eq(0).click()
    cy.get('.e2e-not-register-message').should('be.visible')

    assert('.e2e-not-register-message').text('発表登録にはログインが必要です。')
  })

  it('発表詳細', () => {
    moveTo.presentationDetail()

    // 発表詳細
    assert('.e2e-event-title').text('イベント名')
    assert('.e2e-event-date').text('2022/01/16（日）')
    assert('.e2e-presentation-title').text('発表タイトル')
    assert('.e2e-presenter-name').text('by 発表者')
    assert('.e2e-presentation-description').text('発表の説明')
    cy.get('.e2e-presenter-menu').should('not.visible')

    // スタンプ
    assert('.e2e-stamp').count(3)
    assert('.e2e-stamp-count', 0).text('0')
    assert('.e2e-stamp-count', 1).text('0')
    assert('.e2e-stamp-count', 2).text('0')
    cy.get('.e2e-stamp-count').eq(2).click()
    assert('.e2e-stamp-count', 2).text('1')

    // コメント
    assert('.e2e-commenter-name').count(1)
    assert('.e2e-commenter-name').text('参加者')
    assert('.e2e-comment-date').text('2022/01/19 18:40')
    assert('.e2e-comment').text('コメント by participant')
    cy.get('.e2e-commenter-menu').should('not.visible')
  })

  it('コメント登録', () => {
    moveTo.presentationDetail()

    cy.get('.e2e-add-comment').eq(0).click()
    cy.get('.e2e-not-register-message').should('be.visible')
    assert('.e2e-not-register-message').text('コメントしてみませんか？')
  })
})
