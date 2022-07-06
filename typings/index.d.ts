/// <reference path="./types/index.d.ts" />

interface IEnvConfig {
  env: 'develop' | 'trial' | 'release';
  origin: string;
}

interface IAppOption {
  globalData: {
    envConfig: IEnvConfig,
    CustomBarHeight?: number,
    StatusBarHeight?: number,
    CustomRect?: WechatMiniprogram.Rect,
    userInfo?: WechatMiniprogram.UserInfo,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

interface IPagination {
  page: number;
  pageSize: number;
  total: number;
}

interface IRecordingItem {
  botId: number; // 话术id
  botName: string; // 话术名称
  accountKey: string; // 话术所属账号
  percent: number; // 百分比分子
  updateTime: number; // 更新时间
  updateTimeStr?: string;
  isCompleted?: boolean;
}

type TRecordingDetail = {
  url: string; // 录音文件地址
  recordingId: number; // 录音id
  callScript: string; // 话术内容
  status: number; // 0-未录音、1-已录音
  accountKey: string; // 账户
  total: number; // 总数
  curNum: number; // 当前位置
  duration: number; // 当前位置
};

type TMainProcessDetail = {
  sceneName: string; // 画布名
  sceneId: number; // 画布id
  total: number; // 录音总数
  recordedTotal: number; // 已录总数
  recordingDetails?: TRecordingDetail[];
};

type TMainProcessList = TMainProcessDetail[];

interface IBotDetail {
  mainProcessDetails: TMainProcessList; // 主流程话术详情列表
  total: number; // 录音总条数
  recordedTotal: number; // 已经录的总条数
  mainProcessTotal: number; // 主流程录音总数
  recordedMainProcessTotal: number; // 已录音的主流程录音总数
  botId: number,
  botName: string;
}

interface IIndexData {
  StatusBarHeight: number,
  CustomBarHeight: number,
  CustomRect: any,
  list: IRecordingItem[],
  tab: number,
  loading: false,
  RecordingStatusMap: Record<string, {
    text: string;
    className: string
  }>,
  triggered: boolean,
  hasNextPage: boolean, // 是否有下一页
}

interface ICallDetailQuery {
  botId: number;
  accountKey: string;
  title: string;
}
interface ICallDetailData extends ICallDetailQuery {
  detail?: IBotDetail;
}

type TRecordingType = 'scene' | 'qa';
interface IScenePageParams {
  type: TRecordingType;
  item: TMainProcessDetail;
  botId: number;
  accountKey: string
}
interface IScenePageQuery {
  sceneId?: number;
  accountKey: string;
  type: TRecordingType;
  botId: number;
}
interface ISceneData {
  botId: number;
  accountKey: string;
  type: TRecordingType;
  list: TRecordingDetail[];
  sceneId?: number;
}

type TRecordUrlQuery = {
  recordingId?: string;
  accountKey: string;
  botId: number;
  sceneId?: number;
  qaId?: number;
  isFirst?: boolean
};

type TGetDetailType = 'CUR' | 'LAST' | 'NEXT';

type TRecordQuery = TRecordUrlQuery & {
  type?: TGetDetailType;
};