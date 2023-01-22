import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryTextInputComponent } from './query-text-input.component';

describe('QueryTextInputComponent', () => {
  let component: QueryTextInputComponent;
  let fixture: ComponentFixture<QueryTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryTextInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
