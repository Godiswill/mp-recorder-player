// wx Storage 统一配置处
export const StorageMap = {
  UserInfo: 'userInfo',
  Cookie: 'cookie',
};

// 录音状态
export const RecordingStatusMap = {
  '0': '未完成',
  '1': '已完成'
}

export const ScriptRecordingStatusMap = {
  '0': {
    text: '未录音',
    className: ''
  },
  '1': {
    text: '已录音',
    className: 'success'
  }
}