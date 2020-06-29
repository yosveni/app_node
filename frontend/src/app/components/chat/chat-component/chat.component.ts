import { Component, OnInit, OnDestroy } from '@angular/core';
import {  XMPPAdapter} from "./xmpp_adapter";
//import { ChatAdapter, User, Message, UserStatus } from 'ng-chat';

//import { ChatAdapter } from 'ng-chat';
//import { MyAdapter } from './my_adapter';

//import { BoshClient, $build, XmlElement} from "xmpp-bosh-client/browser";

import * as firebase from 'firebase';

//import { ChatAdapter } from 'ng-chat';
//import { MyAdapter } from './my_adapter';



@Component({
  selector: 'app-chat',
  template: '<ng-chat [adapter]="adapter" [userId]="userId"></ng-chat>',
  styleUrls: []
})
export class ChatComponent implements OnInit,OnDestroy {

  userId: string;
  userPass: string;
  urlXMPP:string;
  
  adapter: XMPPAdapter; 
  
  displayName:String;


  constructor() {
   // console.log("Authentication "+firebase.auth().currentUser.email);
    let email = firebase.auth().currentUser.email;
    if(email  == "goblob65@gmail.com"){
      this.userId = "goblob@upera.tv";
      this.userPass = "goblob";
    }
    else{
      this.userId = "testweb@navfree";
      this.userPass = "testweb";
    }
	
	this.urlXMPP = "http://upera.tv:5280/http-bind/";
	
    this.adapter = new XMPPAdapter(this.userId, this.userPass , this.urlXMPP);

    
  }
  ngOnInit(){
  }
  ngOnDestroy(){
  }
}
