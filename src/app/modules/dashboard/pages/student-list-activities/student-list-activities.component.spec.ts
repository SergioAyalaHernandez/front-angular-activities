import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentListActivitiesComponent } from './student-list-activities.component';

describe('StudentListActivitiesComponent', () => {
  let component: StudentListActivitiesComponent;
  let fixture: ComponentFixture<StudentListActivitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentListActivitiesComponent]
    });
    fixture = TestBed.createComponent(StudentListActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
