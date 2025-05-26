// app.command受け取り時

//モジュール読み込み
require('date-utils');
const { ThreadModal } = require('../modals/ThreadModal');

class AppCommandController {
    constructor(slackPresenter){
        this.slackPresenter = slackPresenter;
    };

    async handleAppCommand (command, logger, client) {
        logger.info('受信コマンド出力；' + JSON.stringify((command)));

        const commandName = command.command;
        console.log(commandName);

        switch (commandName) {
            case '/makethread':
                return await this.handleMakethread(command, logger, client);
            default:
                break;
        }
    };

    // /makethread実行時
    async handleMakethread (command, logger, client) {
        const { channel_id, user_id } = command;

        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const msg = `<@${user_id}>/n*【壁】*${date}`;

        // 壁投稿（メインメッセージ）
        const result = await client.chat.postMessage({
            channel: channel_id,
            text: msg
        });

        // blocks設定
        const view = ThreadModal(command.channel_id, result.ts, date);

        // モーダルを開く
        await client.views.open({
            trigger_id: command.trigger_id,
            view: view,
        });
    }
};


exports.AppCommandController = AppCommandController;