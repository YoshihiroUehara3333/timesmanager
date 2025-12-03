// src/features/makethread/MakeThreadBackendGateway.js

const { BackendRouting } = require('../../constants/BackendRouting')

class MakeThreadBackendGateway {
  constructor(backendHttpClient) {
    this.backendHttpClient = backendHttpClient
  }

  async saveThread({ channelId, threadTs, permalink, userId }) {
    await this.backendHttpClient.post(BackendRouting.THREAD.SAVE, {
      channelId,
      threadTs,
      permalink,
      userId,
    })
  }

  async getThread({ userId, date }) {
    response = await this.backendHttpClient.get(BackendRouting.THREAD.SAVE, {
        params: {
            userId: userId,
            date: date,
        },
    })

    if (response.data[0]) {
      return {
        channelId: response.data[0].channelId,
        permalink: response.data[0].permalink,
        threadTs: response.data[0].threadTs,
      }
    } else {
      return null
    }
  }
}

module.exports = { MakeThreadBackendGateway }