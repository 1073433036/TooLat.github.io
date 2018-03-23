interface AllCollectingTask {
  caid: string
  egName: string
  chName: string
  description: string
  csid: string
  cts: SubAllCollectingTask[]
}

interface SubAllCollectingTask {
  ctsid: string
  pid: number
  name: string
  status: string
  lastExecuteTime: number | string
  usedCpu: number
  usedMemory: number
  totalDataSourceNum: number
  totalDataSourceSize: number
  totalDataResultNum: number
  totalDataResultSize: number
  upload: number
  download: number
  readSpeed: number
  writeSpeed: number
  config: string
  caid: string
  label: string
}

interface AllCollectingTaskForTable extends AllCollectingTask {
  isMouseOver: boolean
  cts: SubAllCollectingTaskForTable[]
}

interface SubAllCollectingTaskForTable extends SubAllCollectingTask {
  isExpanded: boolean
  isMouseOver: boolean
  lastExecuteTime: string
}