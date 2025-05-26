exports.threadModal = (channel_id, thread_ts, date) => ({
    type: 'modal',
    callback_id: 'makethread_modal',
    private_metadata: JSON.stringify({
        channel_id: channel_id,
        thread_ts: thread_ts,
        date: date
    }),
    title: { type: 'plain_text', text: '作業予定を入力' },
    submit: { type: 'plain_text', text: '送信' },
    close: { type: 'plain_text', text: 'キャンセル' },
    blocks: [
        {
            type: 'input',
            block_id: 'title_block',
            label: { type: 'plain_text', text: 'タイトル' },
            element: {
                type: 'plain_text_input',
                action_id: 'title_input'
            }
        },
        {
            type: 'input',
            block_id: 'content_block',
            label: { type: 'plain_text', text: '内容' },
            element: {
                type: 'plain_text_input',
                action_id: 'content_input',
                multiline: true
            }
        }
    ]
})