// app.command受け取り時
const { SlackConst } = require('../constants/SlackConst');

//モジュール読み込み
require('date-utils');
const { MakeThreadModal } = require('../modals/MakeThreadModal');


class AppCommandController {
    constructor(threadService){
        this.threadService = threadService;
    };

    async handleAppCommand (command, logger, client) {
        logger.info('受信コマンド出力:' + JSON.stringify((command)));

        const commandName = command.command;
        console.log(`command:${commandName}`);

        switch (commandName) {
            case SlackConst.COMMAND.makeThread:
                return await this.handleMakethread(command, logger, client);
            default:
                break;
        }
    };

    // /makethread実行時
    async handleMakethread (command, logger, client) {
        const { user_id, channel_id } = command;
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        let result = await this.threadService.newThreadEntry(user_id, channel_id, date, client);
        console.log(JSON.stringify(result));

        // DB保存実行
        if (result.$metadata.httpStatusCode == 200) {
            // モーダルを開く
            const view =  MakeThreadModal(channel_id, result.ts, date);
            await client.views.open({
                trigger_id: command.trigger_id,
                view: view, 
            });
        } else {
            return `スレッド情報DB登録時エラー`;
        }
        
    }
};


exports.AppCommandController = AppCommandController;