const { DailyReportService } = require('../../src/service/DailyReportService')
const { DiaryModelFactory } = require('../../src/model/factory/DiaryModelFactory')
const { DiaryModel } = require('../../src/model/DiaryModel')
const { GetPermalink } = require('../../src/slack/SlackApiRequest')

// --- モック作成 ---
jest.mock('../../src/model/factory/DiaryModelFactory')
jest.mock('../../src/slack/SlackApiRequest')

// Repository モック
const mockPostDataRepository = {
  getDiaryByDate: jest.fn(),
  putItem: jest.fn(),
  queryByPartitionKeyAndThreadTs: jest.fn(),
}

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
      postDataRepository: mockPostDataRepository,
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
    mockPostDataRepository.getDiaryByDate.mockResolvedValue(null)
    mockPostDataRepository.putItem.mockResolvedValue({
      $metadata: { httpStatusCode: 200 },
    })

    const result = await service.processNewDiaryEntry(message)

    expect(DiaryModelFactory.createDiaryModelFromMessage).toHaveBeenCalledWith(message)
    expect(mockSlackApiAdaptor.send).toHaveBeenCalled()
    expect(mockPostDataRepository.putItem).toHaveBeenCalledWith(mockModel)

    expect(result.msg).toContain('DB登録に成功')
  })

  // ---------------------------------------------------------------
  // 編集のテスト
  // ---------------------------------------------------------------
  test('processUpdateDiary：更新処理が行われる', async () => {
    const mockModel = new DiaryModel('C123', '2025-02-01')
    mockModel.date = '2025-02-01'
    mockModel.partitionKey = 'C123#DIARY'

    DiaryModelFactory.createDiaryModelFromMessage.mockReturnValue(mockModel)

    // 既存データあり
    mockPostDataRepository.getDiaryByDate.mockResolvedValue({
      posted_at: '10:00:00',
      slack_url: 'https://slack.com/exist',
    })

    mockPostDataRepository.putItem.mockResolvedValue({
      $metadata: { httpStatusCode: 200 },
    })

    const result = await service.processUpdateDiary(message)

    expect(mockPostDataRepository.putItem).toHaveBeenCalledWith(mockModel)
    expect(result.msg).toContain('DB登録に成功')
  })

  // ---------------------------------------------------------------
  // フィードバック生成
  // ---------------------------------------------------------------
  test('generateFeedback：DBから取得してAIフィードバックを返す', async () => {
    mockPostDataRepository.queryByPartitionKeyAndThreadTs.mockResolvedValue([
      { content: 'test diary' }
    ])

    mockAiApiAdaptor.generateFeedback.mockResolvedValue('AIフィードバック')

    const result = await service.generateFeedback({
      channel: 'C123',
      thread_ts: '999.999',
    })

    expect(result.msg).toBe('AIフィードバック')
  })
})
