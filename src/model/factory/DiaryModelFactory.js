const { DiaryModel }  = require('../../model/DiaryModel');
const { DiaryUtils }  = require('../../utility/DiaryUtils');

/**
 * DiaryModelのインスタンスを生成するFactory Class
 */
class DiaryModelFactory {

    /**
     * 任意のオブジェクトから DiaryModel を生成する
     * 
     * @param {Object} params - パラメータオブジェクト
     * @param {string} params.channelId - SlackチャンネルID
     * @param {string} params.text - 投稿されたメッセージ本文
     * @param {string} params.threadTs - スレッドのタイムスタンプ
     * @param {string|null} params.permalink - 投稿のSlackパーマリンクURL（省略可能）
     * @returns {DiaryModel} 生成された日報モデル
     */
    static createDiaryModel({channelId, text, threadTs, permalink}){
        let date = DiaryUtils.parseDate(text);

        const diaryModel = new DiaryModel(channelId, date);
        diaryModel.workingPlaceCd  = DiaryUtils.parseWorkingPlaceCd(text);
        diaryModel.content         = DiaryUtils.parseContent(text);
        diaryModel.threadTs        = threadTs;
        diaryModel.slackUrl        = permalink;

        return diaryModel;
    }

    /**
     *  messageを引数にdiaryModelを作成して返す
     *  @param {Object} message - Slack APIから受け取ったメッセージオブジェクト
     *  @param {string} message.channel - チャンネルID
     *  @param {string} message.text - 投稿本文
     *  @param {string} message.ts - タイムスタンプ（threadTs相当）
     *  @returns {DiaryModel} model
     */
    static createDiaryModelFromMessage({channel, text, ts}){
        console.log(`${channel}/n${text}/n${ts}`);
        let date = DiaryUtils.parseDate(text);

        const model = new DiaryModel(channel, date);
        model.workingPlaceCd  = DiaryUtils.parseWorkingPlaceCd(text);
        model.content         = DiaryUtils.parseContent(text);
        model.threadTs        = ts;

        return model;
    }
}

exports.DiaryModelFactory = DiaryModelFactory;