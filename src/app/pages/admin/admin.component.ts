import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {
  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }
  
  onLogout(): void {
    this.loginService.logout();
    location.reload();
  }
}
