// src/features/make-thread/MakeThreadCommandHandler.js

class WarmUpCommandHandler {
  constructor({ useCase }) {
    this.useCase = useCase
  }

  /**
   * /warmup で呼ばれる
   */
  async handle({ command, ack, respond }) {
    await ack()

    await this.useCase.execute({
      userId: command.user_id,
      respond,
    })
  }
}

module.exports = { WarmUpCommandHandler }