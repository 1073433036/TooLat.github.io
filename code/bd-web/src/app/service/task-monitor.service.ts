import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { format } from 'date-fns';

@Injectable()
export class TaskMonitorService {

  constructor(
    public http: HttpClient
  ) { }

  private baseUrl = 'http://10.148.83.221:10190/bigdata';
  private alTaskUrl = '/collect/monitor/application/tasks';

  async getAllTaskData() {
    let res: { data: AllCollectingTask[] } = null;
    try {
      res = <{ data: AllCollectingTask[] }>(await this.http
        .get(this.baseUrl + this.alTaskUrl).toPromise());
    } catch (err) {
      return null;
    }

    const dataForTable: AllCollectingTaskForTable[] = [];

    for (const item of res.data) {
      const holder: AllCollectingTaskForTable = JSON.parse(JSON.stringify(item));
      holder.isMouseOver = false;
      for (const cts of holder.cts) {
        cts.isExpanded = false;
        cts.isMouseOver = false;
        cts.lastExecuteTime = format(cts.lastExecuteTime, 'YYYY/MM/DD HH:mm:ss');
      }
      dataForTable.push(holder);
    }

    return dataForTable;
  }
}
