import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionRecordComponent } from './collection-record.component';

describe('CollectionRecordComponent', () => {
  let component: CollectionRecordComponent;
  let fixture: ComponentFixture<CollectionRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
