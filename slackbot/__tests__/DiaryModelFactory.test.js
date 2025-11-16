const { DiaryModelFactory } = require('../src/model/factory/DiaryModelFactory')
const { DiaryModel } = require('../src/model/DiaryModel')

// DiaryUtils をモック
jest.mock('../src/utility/DiaryUtils', () => ({
  DiaryUtils: {
    parseDate: jest.fn(),
    parseWorkingPlaceCd: jest.fn(),
    parseContent: jest.fn(),
  },
}))

const { DiaryUtils } = require('../src/utility/DiaryUtils')

describe('DiaryModelFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('createDiaryModel が正しい DiaryModel を生成する', () => {
    DiaryUtils.parseDate.mockReturnValue('2025-01-02')
    DiaryUtils.parseWorkingPlaceCd.mockReturnValue(1)
    DiaryUtils.parseContent.mockReturnValue({ work_report: 'テスト内容' })

    const params = {
      channelId: 'C123',
      text: 'dummy',
      threadTs: '111.222',
      permalink: 'https://slack.com/test',
    }

    const model = DiaryModelFactory.createDiaryModel(params)

    expect(model).toBeInstanceOf(DiaryModel)
    expect(model.content).toEqual({ work_report: 'テスト内容' })
    expect(model.threadTs).toBe('111.222')
    expect(model.date).toBe('2025-01-02')
    expect(model.slackUrl).toBe('https://slack.com/test')
  })

  test('createDiaryModelFromMessage が正しい DiaryModel を生成する', () => {
    DiaryUtils.parseDate.mockReturnValue('2025-03-10')
    DiaryUtils.parseWorkingPlaceCd.mockReturnValue(2)
    DiaryUtils.parseContent.mockReturnValue({ work_report: '実装作業' })

    const message = {
      channel: 'C321',
      text: 'dummy',
      ts: '999.111',
    }

    const model = DiaryModelFactory.createDiaryModelFromMessage(message)

    expect(model).toBeInstanceOf(DiaryModel)
    expect(model.content).toEqual({ work_report: '実装作業' })
    expect(model.date).toBe('2025-03-10')
    expect(model.threadTs).toBe('999.111')
  })
})
