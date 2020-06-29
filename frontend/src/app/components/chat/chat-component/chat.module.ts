import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgChatModule } from 'ng-chat';
//import { BoshClient, $build } from "xmpp-bosh-client/browser";

import { ChatComponent} from './chat.component';

@NgModule({
  declarations: [
    ChatComponent
  ],
  exports: [ChatComponent],
  imports: [
    NgChatModule,
  ],  
  providers: [],
  //bootstrap: [ChatComponent]
})
export class ChatModule { }
