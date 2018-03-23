export interface TyphoonSelects {
  landings: SelectTypes,
  distances: SelectTypes,
  levels: SelectTypes,
  months: SelectTypes,
  windRanges: SelectTypes,
  rainRanges: SelectTypes
}

export interface SelectTypes {
  type: string,
  label: string,
  checkAll: boolean,
  activeSelect: string[],
  selects: string[]
}

export interface SelectedParams {
  months: number[],
  distances: number[],
  rainRanges: number[],
  windRanges: number[],
  landings: string[],
  levels: string[]
}
