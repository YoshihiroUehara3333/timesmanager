exports.ModalConst = {
  CALLBACK_ID: {
    TASK_INPUT: 'task_input_callback',
    ATTENDANCE_INPUT: 'attendance_input_callback',
    DAILYREPORT: 'home_dailyreport_callback',
  },
  ACTION_ID: {
    HOME: {
      DAILYREPORT: 'home_dailyreport',
      ATTENDANCE: 'home_attendance_input',
      TASK_INPUT: 'home_task_input'
    },
    TASK: {
      CREATE: 'task_create',
      UPDATE: 'task_update',
      PROGRESS: 'task_progress',
      FINISH: 'task_finish',
    }
  }
}
