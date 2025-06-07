const Attendance = {
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
    ATTENDANCE: Attendance,
}
