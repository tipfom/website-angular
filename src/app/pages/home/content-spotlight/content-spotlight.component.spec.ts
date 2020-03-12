import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSpotlightComponent } from './content-spotlight.component';

describe('ContentSpotlightComponent', () => {
  let component: ContentSpotlightComponent;
  let fixture: ComponentFixture<ContentSpotlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentSpotlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSpotlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
