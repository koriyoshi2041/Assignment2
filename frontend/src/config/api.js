// API配置文件 - 用于快速切换Mock和真实API

// 环境配置
const ENV = {
  REAL_API: 'real',      // 真实后端API
  LOCAL_MOCK: 'mock',    // 本地Mock
  CLOUD_MOCK: 'cloud'    // 云端Mock
};

// 当前使用的环境 - 修改这里来切换API环境
const CURRENT_ENV = ENV.REAL_API;

// API基础地址配置
const API_BASE_URLS = {
  [ENV.REAL_API]: 'http://localhost:8080',
  [ENV.LOCAL_MOCK]: 'http://127.0.0.1:4523/m1/6796621-0-default',
  [ENV.CLOUD_MOCK]: 'https://mock.apifox.cn/m1/6796621-0-default'
};

// 导出当前使用的API基础地址
export const API_BASE_URL = API_BASE_URLS[CURRENT_ENV];

// 导出环境标识，方便其他地方判断
export const IS_MOCK = CURRENT_ENV !== ENV.REAL_API;
export const IS_LOCAL_MOCK = CURRENT_ENV === ENV.LOCAL_MOCK;
export const IS_CLOUD_MOCK = CURRENT_ENV === ENV.CLOUD_MOCK;

// 导出API端点
export const API_ENDPOINTS = {
  LOGIN: '/user/login',
  USER_INFO: '/user/info'
};

// 导出完整的API URL
export const API_URLS = {
  LOGIN: API_BASE_URL + API_ENDPOINTS.LOGIN,
  USER_INFO: API_BASE_URL + API_ENDPOINTS.USER_INFO
};

// 环境信息（用于调试）
export const ENV_INFO = {
  current: CURRENT_ENV,
  baseUrl: API_BASE_URL,
  isMock: IS_MOCK,
  isLocalMock: IS_LOCAL_MOCK,
  isCloudMock: IS_CLOUD_MOCK
};

// 在开发环境下打印当前API配置
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API配置信息:', ENV_INFO);
  console.log('📡 API端点:', API_URLS);
}