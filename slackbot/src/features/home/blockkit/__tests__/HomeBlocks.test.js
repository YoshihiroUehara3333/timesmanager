// src/features/home/blockkit/__tests__/HomeBlocks.test.js

/**
 * HomeBlocks
 */

// mock作成
jest.mock('../HomeButtonFactory', () => ({
  HomeButtonFactory: {
    toDailyreport: jest.fn(() => ({ action_id: 'toDailyreport', text: '日報' })),
    toAttendance: jest.fn(() => ({ action_id: 'toAttendance', text: '勤怠' })),
    toCreateTask: jest.fn(() => ({ action_id: 'toCreateTask', text: 'タスク作成' })),
    toTaskEdit: jest.fn((taskId) => ({ action_id: `toTaskEdit:${taskId}`, text: '編集' })),
  },
}))

jest.mock('../../../../shared/blockkit/components/Divider', () => ({
  divider: jest.fn(() => ({ type: 'divider' })),
}))

jest.mock('../../../../shared/blockkit/components/Sections', () => ({
  Sections: {
    mrkdwn: jest.fn(({ text }) => {
      return {
        type: 'section',
        text: { type: 'mrkdwn', text },
      }
    }),
  },
}))

jest.mock('../../../../shared/blockkit/components/Buttons', () => ({
  Buttons: {
    plainTextPrimaryButton: jest.fn((btn) => ({
      type: 'button',
      style: 'primary',
      ...btn,
    })),
  },
}))

const { HomeBlocks } = require('../HomeBlocks')
const { HomeButtonFactory } = require('../HomeButtonFactory')
const { divider } = require('../../../../shared/blockkit/components/Divider')
const { Sections } = require('../../../../shared/blockkit/components/Sections')
const { Buttons } = require('../../../../shared/blockkit/components/Buttons')

describe('HomeBlocks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('thread がない場合: タスク作成ボタンやタスク一覧は出ず「本日のスレッドが未作成です」を表示', () => {
    const res = HomeBlocks({ tasks: [], thread: undefined })

    expect(res).toEqual(
      expect.objectContaining({
        type: 'home',
        blocks: expect.any(Array),
      })
    )

    // header
    expect(res.blocks[0]).toEqual({
      type: 'header',
      text: { type: 'plain_text', text: 'timesmanager' },
    })

    // dailyReportSection の actions: 2ボタン（日報・勤怠）
    const dailyActions = res.blocks.find((b) => b.type === 'actions' && Array.isArray(b.elements) && b.elements.length === 2)
    expect(dailyActions).toBeTruthy()
    expect(dailyActions.elements).toHaveLength(2)

    // taskSection
    // threadなし: toCreateTask は呼ばれない
    expect(HomeButtonFactory.toCreateTask).not.toHaveBeenCalled()

    // threadなし: 「本日のスレッドが未作成です」
    expect(res.blocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'section',
          text: { type: 'mrkdwn', text: '_本日のスレッドが未作成です_' },
        }),
      ])
    )
  })
})
