import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { TaskMonitorService } from './service/task-monitor.service';

import { AppComponent } from './app.component';
import { TaskMonitorComponent } from './components/task-monitor/task-monitor.component';
import { HomeComponent } from './components/home/home.component';
import { CollectionRecordComponent } from './components/collection-record/collection-record.component';
import { HeadNavigationComponent } from './components/head-navigation/head-navigation.component';


@NgModule({
  declarations: [
    AppComponent,
    TaskMonitorComponent,
    CollectionRecordComponent,
    HomeComponent,
    HeadNavigationComponent,
    CollectionRecordComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomeComponent },
      { path: 'taskMonitor', component: TaskMonitorComponent },
      { path: 'collectionRecord', component: CollectionRecordComponent }
    ])
  ],
  providers: [
    TaskMonitorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
