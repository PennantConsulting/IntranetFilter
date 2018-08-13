import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

@Injectable()
export class MediadataService {

  constructor(public http:Http) {
    //console.log('data service connected');
  }

  getPosts() {
    var datapath = document.getElementsByTagName("app-root")[0].getAttribute("data-datasource"),
    thedata = this.http.get(datapath).map(res => res.json());

    return thedata;

    // return this.http.get(datapath)
    // .map(res => res.json());
  }

}
