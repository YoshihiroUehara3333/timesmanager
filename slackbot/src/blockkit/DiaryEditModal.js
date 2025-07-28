// 日報入力モーダルBlockKit定義定義
const { ModalConst } = require('../constants/ModalConst');

exports.DiaryEditModal = () => ({
    type        : "modal",
    callback_id : ModalConst.CALLBACK_ID.NEWTASK,
    	title: {
		type : "plain_text",
		text : "日報編集"
	},
	submit : {
		type : "plain_text",
		text : "保存"
	},
	close : {
		type : "plain_text",
		text : "キャンセル"
	},
    blocks : [

    ]
});