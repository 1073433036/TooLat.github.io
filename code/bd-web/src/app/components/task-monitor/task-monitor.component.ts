import { Component, OnInit } from '@angular/core';
import { TaskMonitorService } from '../../service/task-monitor.service';

@Component({
  selector: 'app-task-monitor',
  templateUrl: './task-monitor.component.html',
  styleUrls: ['./task-monitor.component.scss']
})
export class TaskMonitorComponent implements OnInit {

  constructor(
    public taskMonitorService: TaskMonitorService
  ) { }

  allCollectingData: AllCollectingTaskForTable[] = null;

  async ngOnInit() {
    const res = await this.taskMonitorService.getAllTaskData();
    if (!res) {
      return;
    }
    this.allCollectingData = res;
  }

}
