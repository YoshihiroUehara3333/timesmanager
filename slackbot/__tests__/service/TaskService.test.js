const { TaskService } = require('../../src/service/DailyReportService')

// モック作成
// Slack API モック
const mockSlackApiAdaptor = {
  send: jest.fn(),
}

describe('TaskService', () => {
  let service

  beforeEach(() => {
    jest.clearAllMocks()

    service = new TaskService({
      SlackApiAdaptor: mockSlackApiAdaptor
    })
  })

  test('getByUserId:全タスクリストを取得しチャンネルIDで絞り込んだリストを返す', async () => {
    const result = await service.getByUserId({userId: userId})
  })
})
