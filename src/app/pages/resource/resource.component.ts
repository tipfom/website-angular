import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
import { ResourceEntry } from 'src/app/structures/resource-entry';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.sass']
})
export class ResourceComponent implements OnInit {
  resources: Observable<ResourceEntry[]>;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.resources = this.apiService.getResources(id);
    this.resources.subscribe(res => {
      for (var i = 0; i < res.length; i++) {
        switch (res[i].type) {
          case "link":
            if (i == res.length - 1) location.href = res[i].path;
            else window.open(res[i].path);
            break;

          case "image":
            this.openImage(i == res.length - 1, res[i].path);
            break;
          case "file":
            location.href = this.apiService.getDownloadLink(res[i].path);
            break;
        }
      }
    });
  }

  openImage(last: boolean, name: string) {
    this.apiService.getImage(name).subscribe(res => {
      let url = URL.createObjectURL(res.body);
      if (last) location.href = url;
      else window.open(url);
    });
  }
}
