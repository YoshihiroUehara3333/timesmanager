const { OpenAiApiAdaptor }           = require('../openai/OpenAiApiAdaptor');
const { SlackApiAdaptor }            = require('../slack/SlackApiAdaptor');
const { DynamoPostDataRepository }   = require('../repository/DynamoPostDataRepository');
const { DiaryService }               = require('../service/DiaryService');
const { ThreadService }              = require('../service/ThreadService');
const { WorkReportService }          = require('../service/WorkReportService');

exports.getDiContext = (boltAppClient) => {
    const postDataRepository = new DynamoPostDataRepository();
    const aiApiAdaptor       = new OpenAiApiAdaptor();
    const slackApiAdaptor    = new SlackApiAdaptor(boltAppClient);

    const serviceContext = {
        postDataRepository,
        aiApiAdaptor,
        slackApiAdaptor,
    }

    const diaryService          = new DiaryService(serviceContext);
    const threadService         = new ThreadService(serviceContext);
    const workReportService     = new WorkReportService(serviceContext);

    const handlerContext = {
        diaryService,
        threadService,
        workReportService,
        slackApiAdaptor,
    }

    return {
        service : serviceContext,
        handler : handlerContext,
    }
};