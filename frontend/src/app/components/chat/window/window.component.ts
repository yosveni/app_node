import { Component, OnInit,ElementRef,ChangeDetectionStrategy } from '@angular/core';
import {Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit {
  messages: Observable<any>;

  constructor(public el:ElementRef) {



  }

  ngOnInit() {
  }

  onEnter(event:any){

  }

  sendMessage():void{
    
  }

}
