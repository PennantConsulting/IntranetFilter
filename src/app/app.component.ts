import { Component } from '@angular/core';
import { MediadataService } from './mediadata.service';
import { FilterPipe } from './filter.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../styles.css'],
  providers: [ FilterPipe ]
})
export class AppComponent {
  items: Item[];
  hideSpinner;
  itemResults;
  timeout;
  getParameterByName;
  dataHouse;
  appSrctype; // flat, api
  appLayout; // list, thumb
  filterChange;
  updateFilter;
  filteredData;

  constructor(private dataService: MediadataService) {}

  ngOnInit() {
    this.hideSpinner = false;
    this.itemResults = true;
    this.timeout = null;
    this.filteredData;

    // hide spinner
    setTimeout(() =>{ this.hideSpinner = true; }, 4000)

    this.dataService.getPosts().subscribe((response) => {
      var appInjectDiv = document.getElementsByTagName("app-root")[0];

      this.dataHouse = {};
      this.appSrctype = appInjectDiv.getAttribute("data-srctype") || 'flat';
      this.appLayout = appInjectDiv.getAttribute("data-layout") || 'list';
      this.dataHouse = organizeData(response, this.dataHouse);

      // Default Filtered Data to all items
      this.filteredData = this.dataHouse.items;


      // GREP stuff for reference
      // this.filterMeta = items.filters;
      // this.sortItems = items.sort;

      // // default sort order
      // this.searchSort = 'Newest – Oldest';

      // this.getParameterByName = function (name, url) {
      //   if (!url) url = window.location.href;
      //   name = name.replace(/[\[\]]/g, "\\$&");
      //   var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      //     results = regex.exec(url);
      //   if (!results) return null;
      //   if (!results[2]) return '';
      //   return decodeURIComponent(results[2].replace(/\+/g, " "));
      // };

      // var c = this.getParameterByName('category');
      // // if category url param is set, update model
      // if (c) {this.searchCat = c;}

      // remove spinner
      document.getElementById('mediaSpinner').remove();

    });

    var organizeData = function (data, dataHouse) {
      dataHouse.filters = data.filters;
      dataHouse.items = data.items;
      dataHouse.filterKeys = [];

      // Save filter Keys for easier access
      for(let key in (dataHouse.filters)) {
        dataHouse.filterKeys.push(key);
      }

      return dataHouse;
    };

    this.updateFilter = function (formVals) {
      // this is a pass-through to update the filter pipe on submit
      this.filteredData = new FilterPipe().transform(this.dataHouse.items, formVals);
    };


  }


}

interface Item {
  cdc_short_title: string;
  month: string;
  year: string;
  cdc_related_image: string;
  public_url: string;
  cdc_session_browsing_categories: object;
  cdc_session_browsing_lifespan: object;
  cdc_internal_description: string;
  cdc_event_start_date: string;
}
