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
      getThreadByDate: jest.fn(),
      saveThread: jest.fn(),
    }
  })

  test('DBに当日のスレッド情報が未登録の場合', async () => {
    threadBackendGateway.getThreadByDate.mockResolvedValue({
      ok: true,
      status: 204,
      data: undefined
    })
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
    expect(threadBackendGateway.getThreadByDate).toHaveBeenCalledTimes(1)

    expect(buildReplyText).toHaveBeenCalledTimes(0)
    expect(respond).toHaveBeenCalledTimes(0)

    expect(buildThreadInitialText).toHaveBeenCalledTimes(1)
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

    expect(result.ok).toEqual(true)
  })

  test('DBに当日のスレッド情報が存在していた場合', async () => {
    threadBackendGateway.getThreadByDate.mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        permalink: 'getThreadByDatePermalink',
      }
    })

    const useCase = new MakeThreadUseCase({ slackGateway, threadBackendGateway })
    const result = await useCase.execute({ userId, channelId, respond })

    expect(threadBackendGateway.getThreadByDate).toHaveBeenCalledTimes(1)
    expect(buildReplyText).toHaveBeenCalledWith({
      permalink: 'getThreadByDatePermalink',
    })
    expect(respond).toHaveBeenCalledWith('ReplyText')
    expect(result.ok).toEqual(true)

    expect(buildThreadInitialText).toHaveBeenCalledTimes(0)
    expect(slackGateway.postThread).toHaveBeenCalledTimes(0)
    expect(threadBackendGateway.saveThread).toHaveBeenCalledTimes(0)

    expect(respond).toHaveBeenCalledTimes(1)
  })
})
