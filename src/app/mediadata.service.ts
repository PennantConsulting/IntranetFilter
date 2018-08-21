import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MediadataService {

  constructor(public http: HttpClient) {
    // console.log('data service connected');
  }

  getPosts() {
    var datapath = document.getElementsByTagName("app-root")[0].getAttribute("data-datasource"),
    thedata = this.http.get(datapath);

    return thedata;

    // return this.http.get(datapath)
    // .map(res => res.json());
  }

}
