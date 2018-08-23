import {Component} from '@angular/core';
import {MediadataService} from './mediadata.service';
import {FilterPipe} from './filter.pipe';
import {GlobalsService} from './globals.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['../styles.css'],
    providers: [FilterPipe]
})
export class AppComponent {
    dataHouse;
    filteredData;

    // Configuration options read from data attributes
    appSrctype: string; // flat, api
    dataPath: string;

    titleField: string;
    imageField: string;
    descriptionField: string;
    dateField: string;
    urlField: string;
    displayFilters: boolean;
    displayComments: boolean;
    filterFields: string[]; // TODO: Read this from the data file???

    updateFilter;

    // Models, do not delete, need to figure this out but will break if these don't exist
    contentSourceFilterValue: string;
    topicFilterValue: string;
    searchValue: string;
    sortValue: string;
    sortOptions: Array<object>;

    constructor(private dataService: MediadataService,
                private globalsService: GlobalsService) {
    }

    ngOnInit() {
        this.sortOptions = this.globalsService.SORT_OPTIONS;

        // Read data attributes from app-root
        const appInjectDiv = document.getElementsByTagName('app-root')[0];
        this.appSrctype = appInjectDiv.getAttribute('data-srctype') || 'flat';
        //this.appLayout = appInjectDiv.getAttribute('data-layout') || 'list';
        this.dataPath = appInjectDiv.getAttribute('data-datasource');
        this.titleField = appInjectDiv.getAttribute('data-titlefield');
        this.descriptionField = appInjectDiv.getAttribute('data-descfield');
        this.imageField = appInjectDiv.getAttribute('data-imagefield');
        this.dateField = appInjectDiv.getAttribute('data-datefield');
        this.urlField = appInjectDiv.getAttribute('data-urlfield');

        this.dataService.getPosts(this.dataPath).subscribe((response) => {

            this.dataHouse = {};
            this.dataHouse = organizeData(response, this.dataHouse);

            // Default Filtered Data to all items
            this.filteredData = this.dataHouse.items;

            // TODO: Talk to TP folks about this?
            // remove spinner
            document.getElementById('mediaSpinner').remove();


            this.filterFields = [];
            for (var key in this.dataHouse.filters) {
                if (Object.prototype.hasOwnProperty.call(this.dataHouse.filters, key)) {
                    this.filterFields.push(key);
                }
            }

        });

        var organizeData = function (data, dataHouse) {
            // TODO: Build strongly typed classes for filter and item
            dataHouse.filters = data.filters;
            dataHouse.items = data.items;
            dataHouse.filterKeys = [];

            // Save filter Keys for easier access
            for (let key in (dataHouse.filters)) {
                dataHouse.filterKeys.push(key);
            }

            return dataHouse;
        };

        this.updateFilter = function (formVals) {
            // this is a pass-through to update the filter pipe on submit
            this.filteredData = new FilterPipe(this.globalsService).transform(this.dataHouse.items, formVals);
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
