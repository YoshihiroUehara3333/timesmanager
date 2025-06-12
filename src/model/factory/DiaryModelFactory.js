const { DiaryModel }  = require('../../model/DiaryModel');

class DiaryModelFactory {
    static createDiaryModelFromMessage({}){
        const model = new DiaryModel();
    }
}

exports.DiaryModelFactory = DiaryModelFactory;