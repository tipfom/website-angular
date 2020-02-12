import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPaypalComponent } from './content-paypal.component';

describe('ContentPaypalComponent', () => {
  let component: ContentPaypalComponent;
  let fixture: ComponentFixture<ContentPaypalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentPaypalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPaypalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
