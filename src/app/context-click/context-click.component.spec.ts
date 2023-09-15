import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextClickComponent } from './context-click.component';

describe('ContextClickComponent', () => {
  let component: ContextClickComponent;
  let fixture: ComponentFixture<ContextClickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextClickComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextClickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
