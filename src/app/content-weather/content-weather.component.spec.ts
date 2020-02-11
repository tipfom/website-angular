import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentWeatherComponent } from './content-weather.component';

describe('ContentWeatherComponent', () => {
  let component: ContentWeatherComponent;
  let fixture: ComponentFixture<ContentWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentWeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
