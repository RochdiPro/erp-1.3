import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
 

  
  option1 = false;
  option2 = false;
 

  fnoption1( ) {
    
    this.option1 = true;
    this.option2 = false       
     
  }
  fnoption2( ) {
    this.option2 = true;
    this.option1 = false;
     
   
  }
}
