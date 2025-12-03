// src/features/home/HomeOpenBackendGateway.js

const { BackendRouting } = require('../../constants/BackendRouting')

class HomeBackendGateway {
  constructor(backendHttpClient) {
    this.backendHttpClient = backendHttpClient
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

module.exports = { HomeBackendGateway }