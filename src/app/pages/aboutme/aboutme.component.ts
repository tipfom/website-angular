import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-aboutme',
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.sass']
})
export class AboutmeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const slider = document.querySelector('#currentdiv');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX); //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  }
}
