import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSocialMediaComponent } from './content-social-media.component';

describe('ContentSocialMediaComponent', () => {
  let component: ContentSocialMediaComponent;
  let fixture: ComponentFixture<ContentSocialMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentSocialMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSocialMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
