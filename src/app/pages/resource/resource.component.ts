import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.sass']
})
export class ResourceComponent implements OnInit {

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.apiService.getResource(id).subscribe(res => {
      let lines = res.split("\n");
      switch (lines[0]) {
        case "links":
          for (var i = 1; i < lines.length; i++) {
            if (i == lines.length - 1) location.href = lines[i];
            else window.open(lines[i]);
          }
          break;

        case "images":
          for (var i = 1; i < lines.length; i++) {
            this.openImage(i == lines.length - 1, lines[i]);
          }
          break;
        case "files":
          for (var i = 1; i < lines.length; i++) {
            window.open()
          }
          break;
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
