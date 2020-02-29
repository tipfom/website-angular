import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.sass']
})
export class CmsComponent implements OnInit {
  cmsLinkForm = new FormGroup({
    link: new FormControl(''),
  })

  constructor() {
  }

  ngOnInit(): void {
  }

  onCmsLinkFormSubmit(): void {

  }

  detectFiles(event): void {
    let files = event.target.files;
    console.info(files);
  }
}
