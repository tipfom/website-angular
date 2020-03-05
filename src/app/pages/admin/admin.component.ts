import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }
  
  onLogout(): void {
    this.apiService.logout();
    location.reload();
  }
}
