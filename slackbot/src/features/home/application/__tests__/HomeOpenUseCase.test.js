// src/feature/home/application/__tests__/HomeOpenUseCase.test.js

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
      getAllTasks: jest.fn(),
    }

    threadBackendGateway = {
      getThreadByDate: jest.fn(),
    }
  })

  test('正常終了:DBにスレッド情報が存在する場合', async () => {
    threadBackendGateway.getThreadByDate.mockResolvedValue({
      ok: true,
      status: 200,
      data: { dummy: 'dummy' }
    })
    taskBackendGateway.getAllTasks.mockResolvedValue({
      ok: true,
      status: 200,
      data: [
        { status: TaskConst.STATUS.FINISHED },
        { status: TaskConst.STATUS.ACTIVE },
        { status: TaskConst.STATUS.FINISHED },
      ]
    })

    const useCase = new HomeOpenUseCase({ slackGateway, taskBackendGateway, threadBackendGateway })
    const result = await useCase.execute({ userId })

    expect(getDate).toHaveBeenCalledWith('YYYY-MM-DD')
    expect(threadBackendGateway.getThreadByDate).toHaveBeenCalledTimes(1)
    expect(taskBackendGateway.getAllTasks).toHaveBeenCalledTimes(1)

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
