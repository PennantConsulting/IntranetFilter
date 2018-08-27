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
    displayFilterVals: boolean;
    displayComments: boolean;
    filterFields: string[]; // TODO: Read this from the data file???
    imagePosition: string; // top | left | right
    itemsPerPage: string;
    bgColor: string;
    defaultSort: string;
    defaultFilter: object[];

    cardTextWidth: string;

    searchFields: string[];

    // Models
    searchValue: string;
    sortValue: string;
    filterModel;

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
        this.displayFilterVals = 'true' === appInjectDiv.getAttribute('data-displayfiltervals');
        this.displayComments = 'true' === appInjectDiv.getAttribute('data-displaycomments');
        this.imagePosition = appInjectDiv.getAttribute('data-imageposition');
        this.itemsPerPage = appInjectDiv.getAttribute('data-itemsperpage');
        this.bgColor = appInjectDiv.getAttribute('data-bgcolor');

        this.defaultSort = appInjectDiv.getAttribute('data-sortorder');
        if ( ! this.defaultSort ) {
            this.defaultSort = 'a-z';
        }
        this.sortValue = this.defaultSort;

        this.filterFields = [];
        this.filterModel = [];
        this.defaultFilter = [];

        this.setDefaultFilters( appInjectDiv.getAttribute('data-defaultfilter') );

        // Setup search fields array
        this.searchFields = [];
        this.searchFields.push( this.titleField );
        this.searchFields.push( this.descriptionField );

        // Setup width of text column
        this.cardTextWidth = 'col-md-9';
        if ( ! this.imageField ) {
            this.cardTextWidth = 'col';
        }

        this.dataService.getPosts(this.dataPath).subscribe((response) => {

            this.dataHouse = {};
            this.dataHouse = this.organizeData(response, this.dataHouse);

            // Initialize default sorting and filtering
            let mockFormVals = [];
            if ( this.defaultSort ) {
                mockFormVals['Sort'] = this.defaultSort;
            }
            if ( this.defaultFilter ) {
                mockFormVals = Object.assign({}, mockFormVals, this.defaultFilter );
            }
            this.filteredData = new FilterPipe(this.globalsService).transform(this.dataHouse.items,
                mockFormVals, this.searchFields, this.dateField, this.titleField);

            // remove spinner
            document.getElementById('mediaSpinner').remove();

            //Setup filter drop downs based on data file
            for (var key in this.dataHouse.filters) {
                if (Object.prototype.hasOwnProperty.call(this.dataHouse.filters, key)) {
                    this.filterFields.push(key);
                }
            }

        });
    }

    organizeData(data, dataHouse) {
        // TODO: Build strongly typed classes for filter and item
        dataHouse.filters = data.filters;
        dataHouse.items = data.items;
        dataHouse.filterKeys = [];

        // Save filter Keys for easier access
        for (let key in (dataHouse.filters)) {
            dataHouse.filterKeys.push(key);
        }

        return dataHouse;
    }

    updateFilter(formVals) {
        // this is a pass-through to update the filter pipe on submit
        this.filteredData = new FilterPipe(this.globalsService).transform(this.dataHouse.items,
            formVals, this.searchFields, this.dateField, this.titleField);
    }

    doFilter(filterField, filterValue) {
        let mockFormVals = [];
        this.filterModel[filterField] = filterValue;
        mockFormVals['filter-' + filterField] = filterValue;
        this.filteredData = new FilterPipe(this.globalsService).transform(this.dataHouse.items,
            mockFormVals, this.searchFields, this.dateField, this.titleField);
    }

    getURLParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    getAllQueryStringParams(): object[] {
        const uri = window.location.search;
        var queryString = [];
        uri.replace(
            new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
            function($0, $1, $2, $3) {
                let qsKey = decodeURIComponent( $1 );
                let qsVal = decodeURIComponent( $3 );
                queryString[qsKey] = qsVal;
                return '';
            }
        );
        return queryString;
    }

    setDefaultFilters( defaultFilterParam: string ) {
        // First set app defaults
        if ( defaultFilterParam ) {
            const defaultFilterFields = defaultFilterParam.split( ',' );
            for ( let i = 0; i < defaultFilterFields.length; i++ ) {
                const filterFieldAry = defaultFilterFields[i].split( '=' );
                if ( filterFieldAry.length === 2 ) {
                    this.defaultFilter['filter-' + filterFieldAry[0]] = filterFieldAry[1];
                    this.filterModel[filterFieldAry[0]] = filterFieldAry[1];
                }
            }
        }

        // Now override with query string specifics
        const qs_params = this.getAllQueryStringParams();
        if ( qs_params ) {
            for ( const param in qs_params ) {
                this.defaultFilter['filter-' + param] = qs_params[param];
                this.filterModel[param] = qs_params[param];
            }
        }
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
