import request from '../utils/request';
import mock from '../mock/data';

/**
 * 发送手机验证码接口
 * @param data 
 * @param loading 
 */
export function reqSmsCode(data: { mobile: string }, loading = true) {
  return request({
    url: '/api/reqSmsCode',
    data,
    mockData: {

    }
  }, loading);
}

/**
 * 校验手机验证码接口(登录)
 * @param data 
 * @param loading 
 */
export function verifySmsCode(data: { mobile: string; verifyCode: string }, loading = true) {
  return request({
    url: '/api/verifySmsCode',
    data,
    mockData: {
      name: '张三',
      phone: 12345678901
    }
  }, loading);
}

/**
 * 录音师的话术列表接口
 * @param data 
 */
export function operateList(data: {
  page: number;
  pageSize: number;
  status?: number; // 0-未完成；1-已完成
  botName: string;
}, loading = true) {
  return request<IPagination & { list: IRecordingItem[]; }>({
    url: '/api/operate/list',
    data,
    mockData: mock.operateList,
  }, loading);
}

/**
 * 录音师的话术录音详情
 * @param data 
 */
export function operateBotDetail(data: {
  botId: number;
  accountKey: string;
}, loading = true) {
  return request<IBotDetail>({
    url: '/api/operate/botDetail',
    data,
    mockData: mock.operateBotDetail
  }, loading);
}

export function getRecordingSceneDetail(data: { sceneId: number; accountKey: string }) {
  return request<TMainProcessDetail>({
    url: '/api/operate/sceneDetail',
    data,
    mockData: mock.sceneDetail
  }, true)
}

/**
 * 录音师的快速开始上下条切换
 * @param data 
 */
export function lastOrNext(data: {
  curId?: number; // 当前的录音id
  accountKey: string; // 账号
  botId: number; // 话术id
  type?: 'LAST' | 'NEXT'; // LAST/NEXT
  sceneId?: number; // 画布id
  qaId?: number; // 问答知识id
  curNum?: number; // 当前第几条
  isQuickStart?: boolean; // 是否快速开始
}, loading = true) {
  return request<TRecordingDetail>({
    url: '/api/operate/lastOrNext',
    data,
    mockData: {
      ...mock.sceneDetail.recordingDetails.find(it => it.recordingId === Number(data.curId)) || mock.sceneDetail.recordingDetails[1],
    }
  }, loading);
}

/**
 * 上传获取 nos token 等信息
 * @param data 
 */
export function getNosToken(data: { fileName: string }) {
  return request<{
    bucket: number;
    expireSeconds: string;
    objectName: number;
    token: string;
  }>({
    url: '/api/nos/token',
    data,
    mockData: {
      bucket: 1,
      expireSeconds: 'string',
      objectName: 1,
      token: 'string',
    }
  });
}