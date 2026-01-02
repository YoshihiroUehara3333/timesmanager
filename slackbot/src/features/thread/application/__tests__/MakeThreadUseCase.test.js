/**
 * MakeThreadUseCase
 */

// mock作成
jest.mock('../../../../shared/utils/DateUtils', () => ({
  getDate: jest.fn(() => '2026-01-22'),
}))

jest.mock('../../blockkit/MakeThreadMessageFactory', () => ({
  buildThreadInitialText: jest.fn(() => 'ThreadInitialText'),
  buildReplyText: jest.fn(() => 'ReplyText'),
}))

const { MakeThreadUseCase } = require('../MakeThreadUseCase')
const { getDate } = require('../../../../shared/utils/DateUtils')
const { buildThreadInitialText, buildReplyText } = require('../../blockkit/MakeThreadMessageFactory')

describe('MakeThreadUseCase', () => {
  const userId = 'U0888TRT122'
  const channelId = 'C0800TFFFF9'
  const respond = jest.fn(() => {})

  let slackGateway
  let threadBackendGateway

  beforeEach(() => {
    jest.clearAllMocks()

    slackGateway = {
      postThread: jest.fn(),
    }

    threadBackendGateway = {
      getThread: jest.fn(),
      saveThread: jest.fn(),
    }
  })

  test('DBに当日のスレッド情報が未登録の場合', async () => {
    threadBackendGateway.getThread.mockResolvedValue({ ok: true, data: undefined })
    slackGateway.postThread.mockResolvedValue({
      channelId: 'postThreadChannelId',
      threadTs: 'postThreadThreadTs',
      permalink: 'postThreadPermalink',
    })
    threadBackendGateway.saveThread.mockResolvedValue({
      ok: true,
      data: { data: 'dummy' }
    })

    const useCase = new MakeThreadUseCase({ slackGateway, threadBackendGateway })
    const result = await useCase.execute({ userId, channelId, respond })

    expect(getDate).toHaveBeenCalledWith('YYYY-MM-DD')
    expect(threadBackendGateway.getThread).toHaveBeenCalledWith({ userId, date: '2026-01-22' })
    expect(buildThreadInitialText).toHaveBeenCalledWith({ userId: 'U0888TRT122', date: '2026-01-22' })

    expect(slackGateway.postThread).toHaveBeenCalledWith({
      channelId: 'C0800TFFFF9',
      text: 'ThreadInitialText',
    })

    expect(threadBackendGateway.saveThread).toHaveBeenCalledWith({
      channelId: 'postThreadChannelId',
      threadTs: 'postThreadThreadTs',
      permalink: 'postThreadPermalink',
      userId: 'U0888TRT122',
      date: '2026-01-22',
    })

    expect(buildReplyText).toHaveBeenCalledWith({
      permalink: 'postThreadPermalink',
    })

    expect(respond).toHaveBeenCalledWith('ReplyText')
    expect(result.ok).toEqual(true)

    expect(respond).toHaveBeenCalledTimes(1)
  })
})
