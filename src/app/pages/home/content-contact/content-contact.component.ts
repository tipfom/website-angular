import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-content-contact',
  templateUrl: './content-contact.component.html',
  styleUrls: ['./content-contact.component.sass']
})
export class ContentContactComponent implements OnInit {

  email: string = "";
  message: string = "";
  name: string = "";
  status: string = "";
  sending: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  gotoMedia(link: string): void {
    window.open(link, "_blank");
  }

  validateEmail(email) {
    console.info(email);
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  submitContactForm(): void {
    this.status = "";
    let validMail = this.validateEmail(this.email);
    let validMessage = this.message != "";
    let validName = this.name != "";
    if (!validMail) {
      document.getElementById("email-input").classList.add("missing");
    } else {
      document.getElementById("email-input").classList.remove("missing");
    }
    if (!validMessage) {
      document.getElementById("message-input").classList.add("missing");
    } else {
      document.getElementById("message-input").classList.remove("missing");
    }
    if (!validName) {
      document.getElementById("name-input").classList.add("missing");
    } else {
      document.getElementById("name-input").classList.remove("missing");
    }
    if (validMail && validMessage && validName) {
      this.sending = true;
      this.apiService.sendMail(
        (<HTMLInputElement>document.getElementById("email-input")).value,
        (<HTMLInputElement>document.getElementById("name-input")).value,
        (<HTMLInputElement>document.getElementById("message-input")).value)
        .pipe(catchError((err) => { this.status = "error"; this.sending = false; return err; }))
        .subscribe(r => { this.status = <string>r; this.sending = false; });
    }
  }
}
