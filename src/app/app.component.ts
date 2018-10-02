import {Component} from '@angular/core';
import {MediadataService} from './mediadata.service';
import {FilterPipe} from './filter.pipe';
import {GlobalsService} from './globals.service';
import {Location, LocationStrategy, PathLocationStrategy, APP_BASE_HREF, DatePipe} from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['../styles.css'],
    providers: [DatePipe, FilterPipe, Location, {provide: LocationStrategy, useClass: PathLocationStrategy}, {provide: APP_BASE_HREF, useValue: '/'}]
})
export class AppComponent {
    dataHouse;
    filteredData: any[];
    currentPageData: any[];
    filteredDataLength: number;

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
    filterFields: string[];
    imagePosition: string; // top | left | right
    itemsPerPage: string;
    boundaryLinks: boolean;
    directionLinks: boolean;
    bgColor: string;
    formBgColor: string;
    resetButtonColor: string;
    submitButtonColor: string;
    submitButton: boolean;
    colWidth: string;
    defaultSort: string;
    defaultFilter: object[];
    filtersAreHierarchical: boolean;
    showItemFilterHerarchy: boolean;
    filterHierarchyDelimiter: string;
    filterIncludeSubs: boolean;
    dateFormat: string;

    cardTextWidth: string;

    searchFields: string[];

    // Models
    searchValue: string;
    sortValue: string;
    filterModel;

    // Pagination
    currentPage: number;

    sortOptions: Array<object>;

    location: Location;

    constructor(private dataService: MediadataService,
                private globalsService: GlobalsService,
                location: Location) {
        this.location = location;
    }

    ngOnInit() {
        // this.sortOptions = this.globalsService.SORT_OPTIONS;


        // Read data attributes from app-root
        const appInjectDiv = document.getElementsByTagName('app-root')[0];
        this.appSrctype = appInjectDiv.getAttribute('data-srctype') || 'flat';
        this.dataPath = appInjectDiv.getAttribute('data-datasource');
        this.titleField = appInjectDiv.getAttribute('data-titlefield');
        this.descriptionField = appInjectDiv.getAttribute('data-descfield');
        this.imageField = appInjectDiv.getAttribute('data-imagefield');
        this.dateField = appInjectDiv.getAttribute('data-datefield');
        this.urlField = appInjectDiv.getAttribute('data-urlfield');
        this.displayFilterVals = 'true' === appInjectDiv.getAttribute('data-displayfiltervals');
        this.colWidth = appInjectDiv.getAttribute('data-colwidth');
        this.submitButton = 'true' === appInjectDiv.getAttribute('data-submitbutton');
        this.displayComments = 'true' === appInjectDiv.getAttribute('data-displaycomments');
        this.imagePosition = appInjectDiv.getAttribute('data-imageposition');
        this.itemsPerPage = appInjectDiv.getAttribute('data-itemsperpage');
        this.boundaryLinks = 'true' === appInjectDiv.getAttribute('data-pageboundarylinks');
        this.directionLinks = 'true' === appInjectDiv.getAttribute('data-pagedirectionlinks');
        this.filtersAreHierarchical = 'true' === appInjectDiv.getAttribute('data-filtersarehierarchical');
        this.showItemFilterHerarchy = 'true' === appInjectDiv.getAttribute('data-showitemfilterhierarchy');
        this.filterIncludeSubs = 'true' === appInjectDiv.getAttribute('data-filterincludesubs');
        this.dateFormat = appInjectDiv.getAttribute( 'data-dateformat' );
        if ( ! this.dateFormat ) {
            this.dateFormat = 'mediumDate';
        }
        this.filterHierarchyDelimiter = appInjectDiv.getAttribute('data-filterhierarchydelimiter');
        if ( ! this.filterHierarchyDelimiter ) {
            this.filterHierarchyDelimiter = '>';
        }
        this.bgColor = appInjectDiv.getAttribute('data-bgcolor');
        if ( ! this.bgColor ) {
            this.bgColor = 'bg-white';
        }
        this.formBgColor = appInjectDiv.getAttribute('data-formbgcolor');
        if ( ! this.formBgColor ) {
            this.formBgColor = 'bg-white';
        }
        this.resetButtonColor = appInjectDiv.getAttribute('data-resetbuttoncolor');
        if ( ! this.resetButtonColor ) {
            this.resetButtonColor = 'btn-white';
        }
        this.submitButtonColor = appInjectDiv.getAttribute('data-submitbuttoncolor');
        if ( ! this.submitButtonColor ) {
            this.submitButtonColor = 'btn-primary';
        }
        this.defaultSort = appInjectDiv.getAttribute('data-sortorder');
        if ( ! this.defaultSort ) {
            this.defaultSort = this.titleField + this.globalsService.SORT_VAL_DELIMITER + 'asc';
        }
        this.sortValue = this.defaultSort;

        this.filterFields = [];
        this.filterModel = [];
        this.defaultFilter = [];

        this.setDefaultFilters( appInjectDiv.getAttribute('data-defaultfilter') );

        // Setup search fields array
        this.searchFields = [];
        this.searchFields.push( 'foo' );
        this.searchFields.push( this.titleField );
        this.searchFields.push( this.descriptionField );
        this.searchFields.push( this.globalsService.DATE_FORMATTED );

        // Setup pagination
        this.currentPage = 1;

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
                mockFormVals, this.searchFields, this.dataHouse.sorts, this.filterIncludeSubs);
            this.filteredDataLength = this.filteredData.length;

            // Initial pagination
            this.setupCurrentPage();

            // Setup filter drop downs based on data file
            for (const key in this.dataHouse.filters) {
                if (Object.prototype.hasOwnProperty.call(this.dataHouse.filters, key)) {
                    this.filterFields.push(key);
                }
            }

            // Setup sort drop down based on data file
            this.sortOptions = [];
            for ( const sortField in this.dataHouse.sorts ) {
                if ( Object.prototype.hasOwnProperty.call(this.dataHouse.sorts, sortField)) {
                    const ascLabel = this.dataHouse.sorts[sortField]['asc'];
                    const sortOptionAsc = [];
                    sortOptionAsc['label'] = ascLabel;
                    sortOptionAsc['value'] = sortField + this.globalsService.SORT_VAL_DELIMITER + 'asc';
                    this.sortOptions.push( sortOptionAsc );

                    const descLabel = this.dataHouse.sorts[sortField]['desc'];
                    const sortOptionDesc = [];
                    sortOptionDesc['label'] = descLabel;
                    sortOptionDesc['value'] = sortField + this.globalsService.SORT_VAL_DELIMITER + 'desc';
                    this.sortOptions.push( sortOptionDesc );
                }
            }

            // remove spinner
            const loadingElement = document.getElementById('mediaSpinner');
            loadingElement.parentNode.removeChild(loadingElement);
        });
    }

    getCommentAnchor() {
        return this.globalsService.COMMENT_ANCHOR;
    }

    organizeData(data, dataHouse) {
        dataHouse.filters = data.filters;
        dataHouse.sorts = data.sort;
        dataHouse.items = data.items;
        dataHouse.filterKeys = [];

        // Store formatted date with each item for search
        if ( this.dateField ) {
            for ( let i = 0; i < dataHouse.items.length; i++ ) {
                const utcDate = dataHouse.items[i][this.dateField];
                let datePipe = new DatePipe('en-US');
                let formattedDate = datePipe.transform( utcDate, this.dateFormat );
                dataHouse.items[i][this.globalsService.DATE_FORMATTED] = formattedDate;
            }
        }

        // Save filter Keys for easier access and add key to fields to search on
        for (const key in (dataHouse.filters)) {
            if ( dataHouse.filters.hasOwnProperty( key ) ) {
                dataHouse.filterKeys.push(key);
                this.searchFields.push( key );
            }
        }

        return dataHouse;
    }

    clearFilter() {
        // Reset models and form
        this.sortValue = '';
        this.searchValue = '';
        for ( const property in this.filterModel ) {
            if ( this.filterModel.hasOwnProperty( property ) ) {
                this.filterModel[property] = '';
            }
        }

        // Reset items in list
        const mockFormVals = [];
        mockFormVals['Sort'] = this.defaultSort;
        this.filteredData = new FilterPipe(this.globalsService).transform(this.dataHouse.items,
            mockFormVals, this.searchFields, this.dataHouse.sorts, this.filterIncludeSubs);
        this.filteredDataLength = this.filteredData.length;

        // Initial pagination
        this.setupCurrentPage();
    }

    updateFilter(formVals) {
        // this is a pass-through to update the filter pipe on submit
        this.filteredData = new FilterPipe(this.globalsService).transform(this.dataHouse.items,
            formVals, this.searchFields, this.dataHouse.sorts, this.filterIncludeSubs);
        this.filteredDataLength = this.filteredData.length;
        this.setupCurrentPage();

        let qs = '';
        for ( const key in formVals ) {
            if ( key.startsWith( 'filter-' ) ) {
                const parts = key.split( '-' );
                if ( parts.length > 1 ) {
                    if ( formVals[ key ] ) { // If form value is undefined or empty, do not filter on it
                        if ( qs === '' ) {
                            qs = '?';
                        } else {
                            qs += '&';
                        }
                        qs += parts[1] + '=' + formVals[key];
                    }
                }
            }
        }
        this.updatePathForFilters( qs );
    }

    doFilter(filterField, filterValue) {
        const mockFormVals = [];
        this.filterModel[filterField] = filterValue;
        mockFormVals['filter-' + filterField] = filterValue;
        this.filteredData = new FilterPipe(this.globalsService).transform(this.dataHouse.items,
            mockFormVals, this.searchFields, this.dataHouse.sorts, this.filterIncludeSubs);
        this.filteredDataLength = this.filteredData.length;
        this.setupCurrentPage();

        this.updatePathForFilters( '?' + filterField + '=' + filterValue );

        return false; // Needed to stop refresh on click
    }

    updatePathForFilters( qs ) {
        let currentPath = this.location.path();
        currentPath = currentPath.substr( 0, currentPath.indexOf( '?' ) );

        this.location.go( currentPath, qs );
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
        const queryString = [];
        uri.replace(
            new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
            function($0, $1, $2, $3) {
                const qsKey = decodeURIComponent( $1 );
                const qsVal = decodeURIComponent( $3 );
                queryString[qsKey] = qsVal;
                return '';
            }
        );
        return queryString;
    }

    setupCurrentPage(): void {
        // Trim down dataset to limit to current page
        const end = +this.currentPage * +this.itemsPerPage;
        const start = +end - +this.itemsPerPage;
        this.currentPageData = this.filteredData.slice(start, end);
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
                if ( qs_params.hasOwnProperty( param ) ) {
                    this.defaultFilter['filter-' + param] = qs_params[param];
                    this.filterModel[param] = qs_params[param];
                }
            }
        }
    }

    changeCurrentPage( pageNumber: number ): void {
        this.currentPage = pageNumber;
        this.setupCurrentPage();
    }

    formatFilterVal( val: string ): string {
        if ( this.filtersAreHierarchical && ! this.showItemFilterHerarchy ) {
            const valParts = val.split( this.filterHierarchyDelimiter );
            if ( valParts.length > 0 ) {
                return valParts[ valParts.length - 1 ];
            } else {
                return val;
            }
        } else {
            return val;
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
