

let WebIM = window.WebIM || {};

WebIM.config = {
  xmppURL: 'im-api.easemob.com',
  /* eslint-disable */
  apiURL: (window.location.protocol === 'https:' ? 'https:' : 'http:') + '//a1.easemob.com',
  /* eslint-enable */
  appkey: '1192170805115748#wifi',
  https: false,
  isMultiLoginSessions: true,
  isAutoLogin: true,
  isWindowSDK: false,
  isSandBox: false,
  isDebug: false,
  autoReconnectNumMax: 2,
  autoReconnectInterval: 2,
  isWebRTC: (/Firefox/.test(navigator.userAgent) || /WebKit/.test(navigator.userAgent)) && /^https\:$/.test(window.location.protocol),
  heartBeatWait: 4500,
  isHttpDNS: false,
  msgStatus: true,
  delivery: true,
  read: true,
  saveLocal: false,
  encrypt: {
    type: 'none'
  }
};

window.WebIM = WebIM;

export default WebIM;
