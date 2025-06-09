const { createContainer, asClass, asValue } = require('awilix');
const { DynamoDiaryRepository } = require('./repository/DynamoDiaryRepository');
const { DynamoThreadRepository } = require('./repository/DynamoThreadRepository');
const { DynamoWorkReportRepository } = require('./repository/DynamoWorkReportRepository');
const { DiaryService } = require('./service/DiaryService');
const { WorkReportService } = require('./service/WorkReportService');
const { ThreadService } = require('./service/ThreadService');
const { OpenAIFeedbackGenerator } = require('./service/OpenAIFeedbackGenerator');
const { SlackPresenter } = require('./presenter/SlackPresenter');
const { AppCommandController } = require('./controller/AppCommandController');
const { AppMessageController } = require('./controller/AppMessageController');
const { AppViewController } = require('./controller/AppViewController');
const { AppActionController } = require('./controller/AppActionController');

function createDIContainer() {
    const container = createContainer();

    // Repositories
    container.register({
        diaryRepository: asClass(DynamoDiaryRepository).singleton(),
        threadRepository: asClass(DynamoThreadRepository).singleton(),
        workReportRepository: asClass(DynamoWorkReportRepository).singleton(),
    });

    // Services
    container.register({
        feedbackGenerator: asClass(OpenAIFeedbackGenerator).singleton(),
        diaryService: asClass(DiaryService).singleton(),
        threadService: asClass(ThreadService).singleton(),
        workReportService: asClass(WorkReportService).singleton(),
    });

    // Presenters
    container.register({
        slackPresenter: asClass(SlackPresenter).singleton(),
    });

    // Controllers
    container.register({
        appCommandController: asClass(AppCommandController).singleton(),
        appMessageController: asClass(AppMessageController).singleton(),
        appViewController: asClass(AppViewController).singleton(),
        appActionController: asClass(AppActionController).singleton(),
    });

    return container;
}

module.exports = { createDIContainer }; 