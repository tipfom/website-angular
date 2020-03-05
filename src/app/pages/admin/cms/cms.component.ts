import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.sass']
})
export class CmsComponent implements OnInit {
  cmsLinkForm = new FormGroup({
    link: new FormControl(''),
  })

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
  }

  onCmsLinkFormSubmit(): void {
    this.apiService.postResource("links", [this.cmsLinkForm.get("link").value]).subscribe(r => {
      console.info(r);
      window.alert(r);
    });
  }

  detectFiles(event): void {
    let files = event.target.files;
    console.info(files);
  }
}
