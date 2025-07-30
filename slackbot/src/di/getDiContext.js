const { OpenAiApiAdaptor }          = require('../openai/OpenAiApiAdaptor');
const { SlackApiAdaptor }           = require('../slack/SlackApiAdaptor');
const { DailyReportService }        = require('../service/DailyReportService');
const { ThreadService }             = require('../service/ThreadService');
const { TaskService }               = require('../service/TaskService');
const { DynamoPostDataRepository }  = require('../repository/DynamoPostDataRepository');

exports.getDiContext = (boltAppClient) => {
    const postDataRepository = new DynamoPostDataRepository();
    const aiApiAdaptor       = new OpenAiApiAdaptor();
    const slackApiAdaptor    = new SlackApiAdaptor(boltAppClient);

    const serviceContext = {
        postDataRepository,
        aiApiAdaptor,
        slackApiAdaptor,
    }

    const dailyReportService        = new DailyReportService(serviceContext);
    const threadService             = new ThreadService(serviceContext);
    const taskService               = new TaskService(serviceContext);

    const handlerContext = {
        dailyReportService,
        threadService,
        taskService,
        slackApiAdaptor,
    }

    return {
        service : serviceContext,
        handler : handlerContext,
    }
};