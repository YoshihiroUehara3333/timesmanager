const { DailyReportService } = require('../../src/service/DailyReportService')
const { DiaryModelFactory } = require('../../src/model/factory/DiaryModelFactory')
const { DiaryModel } = require('../../src/model/DiaryModel')

// --- モック作成 ---
jest.mock('../../src/model/factory/DiaryModelFactory')
jest.mock('../../src/slack/SlackApiRequest')

// AI API モック
const mockAiApiAdaptor = {
  generateFeedback: jest.fn(),
}

// Slack API モック
const mockSlackApiAdaptor = {
  send: jest.fn(),
}

describe('DailyReportService', () => {
  let service
  const message = {
    channel: 'C123',
    text: '今日の日報です',
    ts: '123.456',
    user: 'U999',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    service = new DailyReportService({
      aiApiAdaptor: mockAiApiAdaptor,
      slackApiAdaptor: mockSlackApiAdaptor,
    })
  })

  // ---------------------------------------------------------------
  // 新規登録のテスト
  // ---------------------------------------------------------------
  test('processNewDiaryEntry：新規日報を登録し成功メッセージを返す', async () => {
    const mockModel = new DiaryModel('C123', '2025-01-01')
    mockModel.date = '2025-01-01'
    mockModel.slackUrl = 'https://slack.com/xxx'

    DiaryModelFactory.createDiaryModelFromMessage.mockReturnValue(mockModel)
    mockSlackApiAdaptor.send.mockResolvedValue('https://slack.com/xxx')

    const result = await service.processNewDiaryEntry(message)

    expect(DiaryModelFactory.createDiaryModelFromMessage).toHaveBeenCalledWith(message)
    expect(mockSlackApiAdaptor.send).toHaveBeenCalled()

    expect(result.msg).toContain('DB登録に成功')
  })

  // ---------------------------------------------------------------
  // フィードバック生成
  // ---------------------------------------------------------------
  test('generateFeedback：DBから取得してAIフィードバックを返す', async () => {
    mockAiApiAdaptor.generateFeedback.mockResolvedValue('AIフィードバック')

    const result = await service.generateFeedback({
      channel: 'C123',
      thread_ts: '999.999',
    })

    expect(result.msg).toBe('AIフィードバック')
  })
})
