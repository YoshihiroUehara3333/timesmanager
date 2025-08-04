//モジュール読み込み
require('date-utils');
const axios = require('axios');
const { ModalConst } = require('../constants/ModalConst');
const { PostMessage } = require('../slack/SlackApiRequest');
const { HandlerBase } = require('./HandlerBase');


class AppViewHandler extends HandlerBase {
    CALLBACK_ID = ModalConst.CALLBACK_ID;

    constructor ({
        threadService, 
        taskService, 
        slackApiAdaptor
    }) {
        super({slackApiAdaptor});

        this.threadService      = threadService;
        this.taskService        = taskService;

        this.dispatcher = {
            [`${this.CALLBACK_ID.NEWTASK}`]          : this.handleNewTaskModalCallback.bind(this),
            [`${this.CALLBACK_ID.DAILYATTENDANCE}`]  : this.handleDailyAttendanceInputCallback.bind(this),
            'default'                                : this.handleDefault.bind(this)
        }
    }

    async handle(body, logger){
        const view = body.view;

        const callbackId = view.callback_id;
        logger.info(`callbackId:${callbackId}`);
        const handler = this.dispatcher[callbackId] || this.dispatcher['default'];
        const userId = JSON.parse(view.private_metadata).user_id;

        logger.info(`${handler.name}を実行`);
        await this.execute(handler, userId, body, logger);
    }

    async handleNewTaskModalCallback(body) {
        const view = body.view;
        const metadata = JSON.parse(view.private_metadata);

        // 入力データをBlocksとして返信
        const params = await this.workReportService.setWorkPlanBlockParams(view);
        const postResponse = await this.slackApiAdaptor.send(new PostMessage(
            metadata.channel_id, 
            'blocks送信',  
            metadata.thread_ts, 
            WorkPlanBlock(params)
        ));
        logger.info(`post結果:${JSON.stringify(postResponse)}`);

        // 入力データをDBに保存
        return await this.workReportService.processNewTaskSubmition(view);
    }

    async handleDailyAttendanceInputCallback(body) {
        const view = body.view;
        const metadata = JSON.parse(view.private_metadata);
        const userId = metadata.user_id;
        const values = view.state.values;

        const data = {
            userId    : userId,
            startTime : values.starttime.selected_time,
            endTime   : values.endtime.selected_time,
            workplace : values.workplace.select_workplace.selected_option.value,
        }

        console.log(JSON.stringify(data));

        // バックエンドAPIにPOST送信
        const ENDPOINT = `${process.env.BACKEND_API_BASE_URL}/api/diary`;
        try {
            const response = await axios.post(ENDPOINT, data, {
                    url: ENDPOINT,
                }
            );

            return response.data;
        } catch (e) {
            console.error(e);
            if (e.response) {
                return e.response.data;
            }
        }
        return null;
    }
}

exports.AppViewHandler = AppViewHandler;