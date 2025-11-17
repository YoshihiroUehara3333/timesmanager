// AppHomeView と ViewsPublish を先にモックする
jest.mock('../../src/blockkit/AppHomeView', () => ({
  AppHomeView: jest.fn().mockImplementation((tasks) => ({
    type: 'home',
    tasks,
  })),
}))

jest.mock('../../src/slack/SlackApiRequest', () => ({
  ViewsPublish: jest.fn().mockImplementation((userId, view) => ({
    type: 'views.publish',
    userId,
    view,
  })),
}))

const { AppEventHandler } = require('../../src/handler/AppEventHandler')
const { AppHomeView } = require('../../src/blockkit/AppHomeView')
const { ViewsPublish } = require('../../src/slack/SlackApiRequest')

describe('AppEventHandler', () => {
  let handler

  beforeEach(() => {
    jest.clearAllMocks()
    handler = new AppEventHandler({
      slackApiAdaptor: {}, // とりあえずテストでは未使用なので空でOK
    })
  })

  // --------------------------------------------------
  // handle() が app_home_opened を正しくディスパッチする
  // --------------------------------------------------
  test('handle: app_home_opened イベントで updateAppHome を execute に渡す', async () => {
    const body = {
      event: {
        type: 'app_home_opened',
        user: 'U123',
      },
    }
    const event = body.event
    const logger = {
      info: jest.fn(),
    }

    // HandlerBase の execute をスパイに差し替える
    handler.execute = jest.fn().mockResolvedValue()

    await handler.handle(body, event, logger)

    expect(logger.info).toHaveBeenCalled() // ログは一応呼ばれていることだけ確認

    // execute に handler, userId, body, logger が渡っていること
    expect(handler.execute).toHaveBeenCalledTimes(1)
    const [
      passedHandler,
      passedUserId,
      passedBody,
      passedLogger
    ] = handler.execute.mock.calls[0]

    expect(typeof passedHandler).toBe('function')
    expect(passedUserId).toBe('U123')
    expect(passedBody).toBe(body)
    expect(passedLogger).toBe(logger)
  })

  // --------------------------------------------------
  // updateAppHome() の戻り値を検証
  // --------------------------------------------------
  test('updateAppHome: ViewsPublish を正しく返す', async () => {
    const body = {
      event: {
        type: 'app_home_opened',
        user: 'U999',
      },
    }

    const result = await handler.updateAppHome(body)

    // AppHomeView が空配列 tasks で呼ばれている
    expect(AppHomeView).toHaveBeenCalledTimes(1)
    expect(AppHomeView).toHaveBeenCalledWith([])

    // ViewsPublish が userId と view で呼ばれている
    expect(ViewsPublish).toHaveBeenCalledTimes(1)
    const [
      userIdArg,
      viewArg
    ] = ViewsPublish.mock.calls[0]

    expect(userIdArg).toBe('U999')
    // AppHomeView のモック戻り値がそのまま渡っているはず
    expect(viewArg).toEqual({
      type: 'home',
      tasks: [],
    })

    // 戻り値もモックのオブジェクトになっている
    expect(result).toEqual({
      type: 'views.publish',
      userId: 'U999',
      view: {
        type: 'home',
        tasks: [],
      },
    })
  })

  // --------------------------------------------------
  // getEventFromBody の単体テスト（おまけ）
  // --------------------------------------------------
  test('getEventFromBody: body.event をそのまま返す', () => {
    const body = { event: { type: 'aaa', user: 'U1' } }
    expect(handler.getEventFromBody(body)).toBe(body.event)
  })
})
