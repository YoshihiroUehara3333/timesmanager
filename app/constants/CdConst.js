const WorkingPlace = {
    LIST: [
        {
            code: 1, 
            name: '出社' 
        },
        {
            code: 2, 
            name: 'リモート' 
        },
        {
            code: 3,
            name: '自社オフィス'
        },
        {
            code: 9,
            name: 'その他'
        },
    ],

    getNameByCode(code) {
        const item = this.LIST.find(i => i.code === code);
        return item ? item.name : 'その他';
    },

    getCodeByName(name) {
        const item = this.LIST.find(i => i.name === name);
        return item ? item.code : 9; // デフォルトは「その他」
    }
}

const PostType = {
    LIST: [
        {
            code: 1, 
            name: 'テキスト' 
        },
        {
            code: 2, 
            name: 'URL' 
        },
        {
            code: 9,
            name: 'その他'
        },
    ],

    getNameByCode(code) {
        const item = this.LIST.find(i => i.code === code);
        return item ? item.name : 'その他';
    },

    getCodeByName(name) {
        const item = this.LIST.find(i => i.name === name);
        return item ? item.code : 9; // デフォルトは「その他」
    }
}


exports.CdConst = {
    WORKING_PLACE : WorkingPlace,
    POST_TYPE     : PostType,
}
