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
    // HomeBlocks 側が {text:"..."} でも "..." でも呼んでくる可能性があるので両対応
    mrkdwn: jest.fn((text) => {
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
  })
})
