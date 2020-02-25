import { Component, OnInit } from '@angular/core';
import { MilestoneEntry } from 'src/app/structures/milestone-entry'
import { Observable } from 'rxjs';

declare function weatherwidget_io_invoke(): any;

const ADDITIONAL_MILESTONES: MilestoneEntry[] = [
  { name: 'Wissenschaftliche Hilfskraft am Fraunhofer IWS', timespan: 'März - August 2019' },
  { name: 'Teil der deutschen Mannschaft zur Internationalen Physikolympiade 2018', timespan: '21. - 29. Juli 2018' },
  { name: 'Abitur am Max-Steenbeck-Gymnasium', timespan: '22.06.2018' },
  { name: 'Landessieger bei der Brandenburger Physikolympiade', timespan: '2014, 2015, 2016, 2018' },
];

@Component({
  selector: 'app-content-aboutme',
  templateUrl: './content-aboutme.component.html',
  styleUrls: ['./content-aboutme.component.sass']
})
export class ContentAboutmeComponent implements OnInit {
  index = 1;
  selectedMilestone = new Observable<MilestoneEntry>(observer => {
    observer.next(ADDITIONAL_MILESTONES[this.index]);
    setInterval(()=>{
      this.index++;
      if(this.index >= ADDITIONAL_MILESTONES.length) this.index = 0;
      console.info(this.index);
      observer.next(ADDITIONAL_MILESTONES[this.index]);
    },6000);
  });

  constructor() { 
  }

  ngOnInit(): void {
    weatherwidget_io_invoke();
  }
}
