import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteAboutmeComponent } from './site-aboutme.component';

describe('SiteAboutmeComponent', () => {
  let component: SiteAboutmeComponent;
  let fixture: ComponentFixture<SiteAboutmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteAboutmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteAboutmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
