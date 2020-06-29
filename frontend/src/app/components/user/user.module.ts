import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import{GeolocationService} from '../../services/geolocation.service';


import { SidebarComponent } from '../sidebar/sidebar.component';
import { MapsComponent } from '../maps/maps.component';
import{ChatModule} from '../chat/chat-component/chat.module';
import {Routes, RouterModule} from '@angular/router'; 

import {UserComponent} from "./user.component";

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
  },
];


@NgModule({
  
    declarations: [
       UserComponent,
       SidebarComponent,
       MapsComponent,     
    ],
    imports: [
      ReactiveFormsModule,
      FormsModule,
      CommonModule,
      HttpModule,   
      HttpClientModule,
      ChatModule,
      AgmCoreModule.forRoot({
        apiKey:'AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw'
      }),
      AgmJsMarkerClustererModule,
      RouterModule.forChild(routes),
    ],
    //exports: [UserComponent],
    providers: [GeolocationService],
    bootstrap: [UserComponent]
  })
  export class UserModule { }