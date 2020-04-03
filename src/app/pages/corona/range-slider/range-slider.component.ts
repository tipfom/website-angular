import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.sass']
})
export class RangeSliderComponent implements OnInit {
  @Input() min: number;
  @Input() max: number;
  @Input() distance: number;

  @Input() lower: number;
  @Output() lowerChange = new EventEmitter<number>();

  @Input() upper: number;
  @Output() upperChange = new EventEmitter<number>();

  @Input() linked: boolean;
  @Output() linkedChange = new EventEmitter<{ state: boolean, group: string, graph: string }>();

  @Input() group: string;
  @Input() graph: string;

  @Output() change = new EventEmitter();

  @ViewChild('lowerdiv') lowerDiv: ElementRef;
  @ViewChild('containerdiv') containerDiv: ElementRef;
  @ViewChild('upperdiv') upperDiv: ElementRef;
  @ViewChild('filledpolediv') filledPoleDiv: ElementRef;

  animateInterval: any;

  constructor() {
  }

  ngOnInit(): void {
    document.addEventListener("mouseup", () => {
      this.isDraggingLower = false;
      this.isDraggingUpper = false;
    });
    document.addEventListener("mousemove", (event: MouseEvent) => {
      this.mouseMove(event);
    });
  }

  ngAfterViewInit(): void {
    this.lower = this.min;
    this.upper = this.max;
    this.updateCursorPositions();
  }

  isDraggingLower: boolean;
  lowerDragStart(event: MouseEvent) {
    this.isDraggingLower = true;
    this.isDraggingUpper = false;
  }
  lowerDragEnd(event: MouseEvent) {
    this.isDraggingLower = false;
  }
  isDraggingUpper: boolean;
  upperDragStart(event: MouseEvent) {
    this.isDraggingUpper = true;
    this.isDraggingLower = false;
  }
  upperDragEnd(event: MouseEvent) {
    this.isDraggingUpper = false;
  }
  mouseMove(event: MouseEvent) {
    if (this.isDraggingLower) {
      let rect = this.containerDiv.nativeElement.getBoundingClientRect();
      let newLower = Math.round(this.min + (this.max - this.min) * Math.max(0, Math.min(1, (event.clientX - rect.x) / rect.width)));
      if (this.lower != newLower) {
        this.lower = newLower;
        if (this.upper - this.lower < this.distance) {
          this.upper = this.lower + this.distance;
          if (this.upper > this.max) {
            this.upper = this.max;
            this.lower = this.upper - this.distance;
          }
          this.upperChange.emit(this.upper);
          this.lowerChange.emit(this.lower);
        } else {
          this.lowerChange.emit(this.lower);
        }
        this.change.emit("lower");
        this.updateCursorPositions();
      }
    } else if (this.isDraggingUpper) {
      let rect = this.containerDiv.nativeElement.getBoundingClientRect();
      let newUpper = Math.round(this.min + (this.max - this.min) * Math.max(0, Math.min(1, (event.clientX - rect.x) / rect.width)));
      if (this.upper != newUpper) {
        this.upper = newUpper;
        if (this.upper - this.lower < this.distance) {
          this.lower = this.upper - this.distance;
          if (this.lower < this.min) {
            this.lower = this.min;
            this.upper = this.lower + this.distance;
          }
          this.lowerChange.emit(this.lower);
          this.upperChange.emit(this.upper);
        } else {
          this.upperChange.emit(newUpper);
        }
        this.change.emit("upper");
        this.updateCursorPositions();
      }
    }
  }
  updateCursorPositions() {
    let leftPercent = (this.lower - this.min) / (this.max - this.min) * 100;
    let rightPercent = (this.upper - this.min) / (this.max - this.min) * 100;
    this.lowerDiv.nativeElement.style.left = "calc(" + leftPercent.toString() + "%" + " - 20px)";
    this.upperDiv.nativeElement.style.left = "calc(" + rightPercent.toString() + "%" + " - 20px)";
    this.filledPoleDiv.nativeElement.style.left = leftPercent + "%";
    this.filledPoleDiv.nativeElement.style.width = (rightPercent - leftPercent) + "%";
  }

  mouseLeave(event: MouseEvent) {
    this.isDraggingLower = false;
    this.isDraggingUpper = false;
  }

  toggleAnimate(loop: boolean) {
    if (this.animateInterval) {
      clearInterval(this.animateInterval);
      this.animateInterval = undefined;
    } else {
      this.animateInterval = setInterval(() => {
        this.upper = this.upper + 1;
        if (this.upper > this.max) {
          if (loop) {
            this.upper = this.lower + this.distance;
          } else {
            this.upper = this.max;
            clearInterval(this.animateInterval);
            this.animateInterval = undefined;
          }
        }
        this.upperChange.emit(this.upper);
        this.change.emit("upper");
        this.updateCursorPositions();
      }, 200);
    }
  }

  toggleLink() {
    this.linked = !this.linked;
    this.linkedChange.emit({ state: this.linked, group: this.group, graph: this.graph });
  }
}
