export interface EmergEvent {
  liandongid: number
  userid: string
  title: string
  describes: string
  userids: string
  state: string
  ddatetime: number
  info: EventInfo
  level: string
}

export interface EventDynamic {
  image: string
  role: string
  liandongid: string
  feedbackid: string
  userid: string
  nick: string
  password: string
  phone: string
  name: string
  ddatetime: string
  department: string
  account: string
  info: DynamicInfo
}

export interface EventMember {
  nick: string
  image: string
  role: string
  phone: string
  name: string
  state: string
  department: string
  userid: string
  account: string
}

interface EventInfo {
  id?: number
  lon?: number
  lat?: number
  address?: string
}

interface DynamicInfo {
  state?: string
  pics?: Picture[]
  abstract?: Picture[]
  describes?: string
}

interface Picture {
  url: string
  id: number
}