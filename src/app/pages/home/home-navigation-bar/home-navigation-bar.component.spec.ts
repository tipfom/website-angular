import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNavigationBarComponent } from './home-navigation-bar.component';

describe('HomeNavigationBarComponent', () => {
  let component: HomeNavigationBarComponent;
  let fixture: ComponentFixture<HomeNavigationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeNavigationBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeNavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
