// src/shared/constants/WorkplaceConst.js

exports.WorkplaceConst = {
  LIST: [
    {
      value: 'onsite',
      text: '出社',
    },
    {
      value: 'remote',
      text: 'リモート',
    },
    {
      value: 'office',
      text: '自社',
    },
    {
      value: 'vacation',
      text: '休暇',
    },
  ],
  getTextByValue (value) {
    const item = this.LIST.find(i => i.value === value)
    return item ? item.text : 'その他'
  },

  getValueByText (text) {
    const item = this.LIST.find(i => i.text === text)
    return item ? item.value : 'other'
  }
}
