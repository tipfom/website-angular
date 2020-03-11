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
    this.apiService.postResource("link", [this.cmsLinkForm.get("link").value]).subscribe(r => {
      console.info(r);
      window.alert(r);
    });
  }

  detectFiles(event): void {
    let files = event.target.files;
    let serverfiles = [];
    for (var i = 0; i < files.length; i++) {
      this.apiService.uploadFile(files[i], files[i].name).subscribe(filename => {
        serverfiles.push(filename);
        if (serverfiles.length == files.length) {
          this.apiService.postResource("image", serverfiles).subscribe(resourceid => {
            window.alert(resourceid);
          });
        }
      });
    }
  }

  uploadSelectedFiles(): void {
    let file_select = <HTMLInputElement>document.getElementById("file_select");
    let file = file_select.files[0];
    this.apiService.uploadFile(file, file.name).subscribe(filename => {
      this.apiService.postResource("file", [filename]).subscribe(resourceid => {
        window.alert(resourceid);
      });
    });
  }
}
