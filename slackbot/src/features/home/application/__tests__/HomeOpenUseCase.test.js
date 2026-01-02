/**
 * HomeOpenUseCase
 */

// mock作成
jest.mock('../../../../shared/utils/DateUtils', () => ({
  getDate: jest.fn(() => '2026-01-22'),
}))

jest.mock('../../blockkit/HomeBlocks', () => ({
  HomeBlocks: jest.fn(() => ({
    type: 'home',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'dummy'
        }
      },
    ]
  }))
}))

const { HomeOpenUseCase } = require('../HomeOpenUseCase')
const { getDate } = require('../../../../shared/utils/DateUtils')
const { HomeBlocks } = require('../../blockkit/HomeBlocks')
const { TaskConst } = require('../../../../shared/constants/TaskConst')

describe('HomeOpenUseCase', () => {
  const userId = 'U0888TRT122'

  let slackGateway
  let taskBackendGateway
  let threadBackendGateway

  beforeEach(() => {
    jest.clearAllMocks()

    slackGateway = {
      updateHome: jest.fn().mockResolvedValue({ ok: true }),
    }

    taskBackendGateway = {
      getTasks: jest.fn(),
    }

    threadBackendGateway = {
      getThread: jest.fn(),
    }
  })

  test('正常終了', async () => {
    threadBackendGateway.getThread.mockResolvedValue({ ok: true, data: { dummy: 'dummy' } })
    taskBackendGateway.getTasks.mockResolvedValue({
      ok: true,
      data: [
        { status: TaskConst.STATUS.ACTIVE },
        { status: TaskConst.STATUS.FINISHED }
      ]
    })

    const useCase = new HomeOpenUseCase({ slackGateway, taskBackendGateway, threadBackendGateway })
    const result = await useCase.execute({ userId })

    expect(getDate).toHaveBeenCalledWith('YYYY-MM-DD')
    expect(threadBackendGateway.getThread).toHaveBeenCalledWith({ userId, date: '2026-01-22' })
    expect(taskBackendGateway.getTasks).toHaveBeenCalledWith({ userId })

    expect(HomeBlocks).toHaveBeenCalledWith({
      tasks: [
        { status: TaskConst.STATUS.ACTIVE }
      ],
      thread: { dummy: 'dummy' }
    })

    expect(slackGateway.updateHome).toHaveBeenCalledWith({
      userId: userId,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'dummy'
            }
          },
        ]
      },
    })

    expect(result.ok).toEqual(true)
  })
})
