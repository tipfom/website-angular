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
      let count = 0;
      if (lines[0] == "links") {
        for (var i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            if (count == 0) location.href = lines[i];
            else window.open(lines[i], "_blank");
            count++;
          }
        }
      }
    });
  }

}
