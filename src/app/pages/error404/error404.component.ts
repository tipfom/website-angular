import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.sass']
})
export class Error404Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setInterval(this.placeRandomMysteriousMessage, 4000);
    this.placeRandomMysteriousMessage();
  }

  placeRandomMysteriousMessage() {
    let mysterious = document.getElementById("mysterious");
    mysterious.classList.remove("fade-in");
    mysterious.classList.add("fade-out");
    setTimeout(() => {
      var height = document.body.clientHeight;
      var width = document.body.clientWidth;
      mysterious.style.top = (Math.random() * 0.6 + 0.2) * height + "px";
      mysterious.style.left = (Math.random() * 0.8 + 0.1) * width + "px";
      mysterious.classList.remove("fade-out");
      mysterious.classList.add("fade-in");
    }, 1000);
  }
}
