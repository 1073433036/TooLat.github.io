export interface WarningTemplate {
  id: number
  name?: string            //模板名称
  forecaster: string,      //预报员
  signer: string           //签发人
  affirmNumber: string     //确认电话
  fax: string              //传真
  units: string            //发布单位
  warnType: string         //预警类型
}

export interface SmsGroup {
  id: number
  groupname: string
  updatetime: string
  number: number
}

export interface WarningForm {
  id?: number
  units: string
  time: number
  typeWarn: string
  oneEventType?:string
  oneEventLevel?:string
  forecaster: string
  signer: string
  affirmNumber: string
  fax: string
  web: number
  wechat: number
  pNote: number
  nNote: number
  website: number
  ftp: number
  faxes: number
  noteMessage: string
  warningMessage: string
  defense: string
  state: number
  smsGroup: number
}

export interface WarningDetail {
  id: number
  eventType: string
  publishRelease: string
  publishRelieve: string
}

export interface DefenseGuide {
  id: number
  name: string
  typeId: number
  colour: string
  guidelines: string
  pictrue: string | null
  event_type: string
}
export interface Signal {
  type: string
  level: string
}
