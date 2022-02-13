import { assert, moveTo, setValue } from '../utils'
import { signIn } from '../support/firebase'

describe('発表者による操作', () => {
  beforeEach(() => {
    cy.wrap(signIn('presenter@example.com', 'presenter@example.com'))
    cy.wait(1000)

    // Note: サイドメニューを閉じるのが面倒なので、画面サイズを大きくしておく
    cy.viewport('macbook-13')
    cy.visit('/')
  })

  it('サイドメニュー', () => {
    moveTo.eventList()

    cy.get('.e2e-side-icon').eq(0).click()
    assert('.e2e-user-name').text('発表者')
    assert('.e2e-side-menu-item').count(2)
    assert('.e2e-side-menu-item', 0).text('イベント一覧')
    assert('.e2e-side-menu-item', 1).text('フィードバック')
  })

  it('マイページ', () => {
    moveTo.eventList()

    cy.get('.e2e-side-icon').eq(0).click()
    cy.get('.e2e-user-name').eq(0).click()
    cy.get('.e2e-my-page').should('be.visible')

    setValue('.e2e-user-name-input').textBox('発表者_edited')
    cy.get('.e2e-submit').eq(0).click()

    cy.get('.e2e-side-icon').eq(0).click()
    assert('.e2e-user-name').text('発表者_edited')
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

    assert('.e2e-presentation-title').count(1)
    assert('.e2e-presentation-title').text('発表タイトル')
    assert('.e2e-presenter-name').text('by 発表者_edited')
    assert('.e2e-presentation-description').text('発表の説明')
  })

  it('発表詳細', () => {
    moveTo.presentationDetail()

    // 発表詳細
    assert('.e2e-event-title').text('イベント名')
    assert('.e2e-event-date').text('2022/01/16（日）')
    assert('.e2e-presentation-title').text('発表タイトル')
    assert('.e2e-presenter-name').text('by 発表者_edited')
    assert('.e2e-presentation-description').text('発表の説明')
    cy.get('.e2e-presenter-menu').should('be.visible')

    // スタンプ
    assert('.e2e-stamp').count(3)
    assert('.e2e-stamp-count', 0).text('0')
    assert('.e2e-stamp-count', 1).text('0')
    assert('.e2e-stamp-count', 2).text('0')
    cy.get('.e2e-stamp-count').eq(2).click()
    assert('.e2e-stamp-count', 2).text('1')

    // コメント
    assert('.e2e-commenter-name').count(2)
    cy.get('.e2e-commenter-menu').should('not.visible')
    assert('.e2e-commenter-name', 0).text('管理者')
    assert('.e2e-comment-date', 0).text('2022/01/19 18:41')
    assert('.e2e-comment', 0).text('ダイレクトコメント by admin')
    assert('.e2e-commenter-name', 1).text('参加者')
    assert('.e2e-comment-date', 1).text('2022/01/19 18:40')
    assert('.e2e-comment', 1).text('コメント by participant')
  })

  it('発表編集', () => {
    moveTo.presentationDetail()
    cy.get('.e2e-presenter-menu').eq(0).click()
    cy.wait(1000)
    cy.get('.e2e-edit-presentation').eq(0).click()
    cy.wait(1000)
    cy.get('.e2e-draft-presentation').should('be.visible')

    setValue('.e2e-presentation-title-input').textBox('発表タイトル_edited')
    setValue('.e2e-presentation-description-input').textArea('発表の説明_edited')

    setValue('.e2e-confidential-checkbox').check(true)
    cy.get('.e2e-submit').eq(0).click()

    assert('.e2e-event-title').text('イベント名')
    assert('.e2e-event-date').text('2022/01/16（日）')
    assert('.e2e-presentation-title').text('発表タイトル_edited')
    assert('.e2e-presenter-name').text('by 発表者_edited')
    assert('.e2e-presentation-description').text('発表の説明_edited')
  })

  it('発表削除', () => {
    moveTo.presentationDetail()

    cy.on('window:confirm', (str) => {
      expect(str).to.eq('この発表を削除します。よろしいですか？')
      return true
    })
    cy.get('.e2e-presenter-menu').eq(0).click()
    cy.wait(1000)
    cy.get('.e2e-delete-presentation').eq(0).click()
    cy.wait(1000)

    assert('.e2e-event-title').text('イベント名')
    assert('.e2e-event-description').text('イベントの説明')
    assert('.e2e-event-date').text('2022/01/16（日）')

    assert('.e2e-presentation-title').count(0)
  })

  it('発表登録', () => {
    moveTo.eventDetail()
    cy.get('.e2e-add-presentation').eq(0).click()
    cy.get('.e2e-draft-presentation').should('be.visible')

    assert('.e2e-event-title').text('イベント名')
    assert('.e2e-event-date').text('2022/01/16（日）')

    setValue('.e2e-presentation-title-input').textBox('サンプル発表のタイトル')
    setValue('.e2e-presentation-description-input').textArea('サンプル発表の説明')
    setValue('.e2e-confidential-checkbox').check(true)
    cy.get('.e2e-submit').eq(0).click()

    // 発表詳細
    assert('.e2e-presentation-title').count(1)
    assert('.e2e-presentation-title', 0).text('サンプル発表のタイトル')
    assert('.e2e-presenter-name', 0).text('by 発表者_edited')
    assert('.e2e-presentation-description', 0).text('サンプル発表の説明')
  })

  it('コメント登録', () => {
    moveTo.presentationDetail()

    cy.get('.e2e-add-comment').eq(0).click()
    cy.wait(1000)
    setValue('.e2e-comment-input').textArea('コメント by e2e')
    cy.get('.e2e-post-comment').eq(0).click()
    cy.wait(1000)

    cy.get('.e2e-commenter-menu').should('be.visible')
    assert('.e2e-commenter-name').count(1)
    assert('.e2e-commenter-name').text('発表者_edited')
    assert('.e2e-comment-date').notNull()
    assert('.e2e-comment').text('コメント by e2e')
  })

  it('コメント編集', () => {
    moveTo.presentationDetail()

    cy.get('.e2e-commenter-menu').eq(0).click()
    cy.wait(1000)
    cy.get('.e2e-edit-comment').eq(0).click()
    cy.wait(1000)

    setValue('.e2e-comment-input').textArea('コメント by e2e_edited')
    cy.get('.e2e-post-comment').eq(0).click()
    cy.wait(1000)

    cy.get('.e2e-commenter-menu').should('be.visible')
    assert('.e2e-commenter-name').count(1)
    assert('.e2e-commenter-name').text('発表者_edited')
    assert('.e2e-comment-date').notNull()
    assert('.e2e-comment').text('コメント by e2e_edited')
  })

  it('コメント削除', () => {
    moveTo.presentationDetail()

    cy.on('window:confirm', (str) => {
      expect(str).to.eq('このコメントを削除します。よろしいですか？')
      return true
    })
    cy.get('.e2e-commenter-menu').eq(0).click()
    cy.wait(1000)
    cy.get('.e2e-delete-comment').eq(0).click()
    cy.wait(1000)

    cy.get('.e2e-commenter-menu').should('not.visible')
    assert('.e2e-commenter-name').count(0)
  })
})
