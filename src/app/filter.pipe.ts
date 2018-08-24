import {Pipe, PipeTransform} from '@angular/core';
import {GlobalsService} from './globals.service';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {

    constructor(private globalsService: GlobalsService) {
    }

    transform(items: any[], formVals: any[]): any[] {

        // Defaults if none are filtered
        if (!items) {
            return [];
        }

        // Sorting
        if (formVals['Sort']) {
            let sortBy = formVals['Sort'];
            for (let i = 0; i < this.globalsService.SORT_OPTIONS.length; i++) {
                let sortOption = this.globalsService.SORT_OPTIONS[i];
                if (sortOption.value === sortBy) {
                    let sortField = sortOption.field;
                    let sortDirection = sortOption.dir;
                    items.sort((a, b): number => {
                        if ('date' === sortField) {

                        } else {
                            let aVal = a[sortField].toLowerCase();
                            let bVal = b[sortField].toLowerCase();
                            if (aVal === bVal) {
                                return 0;
                            } else if ('asc' === sortDirection && aVal < bVal) {
                                return -1;
                            } else if ('asc' === sortDirection && aVal > bVal) {
                                return 1;
                            } else if ('desc' === sortDirection && aVal > bVal) {
                                return -1;
                            } else if ('desc' === sortDirection && aVal < bVal) {
                                return 1;
                            }
                        }
                    });
                }

            }
        }

        // If nothing selected for filtering don't filter
        if ( ! this.needToFilterData( formVals ) ) {
            return items;
        }

        // Determine the filter fields in the form
        let formFilters = [];
        for ( let key in formVals ) {
            if ( key.startsWith( 'filter-' ) ) {
                let parts = key.split( '-' );
                if ( parts.length > 1 ) {
                    if ( formVals[ key ] ) { // If form value is undefined or empty, do not filter on it
                        formFilters[parts[1]] = formVals[key];
                    }
                }
            }
        }

        return items.filter(function (item) {
            let retVal = true;

            for ( let filterField in formFilters ) {
                let itemHasFilterVal = false;
                for (let i = 0; i < item[filterField].length; i++) {
                    if (item[filterField][i] === formFilters[filterField] ) {
                        itemHasFilterVal = true;
                        break;
                    }
                }
                if ( ! itemHasFilterVal ) {
                    retVal = false;
                    break;
                }
            }

            if ( retVal && formVals['Search'] ) {
                const searchText = formVals['Search'];
                if ( searchText && searchText.length >= 3 ) {
                    if (! item['Post Title'].toLowerCase().includes(searchText.toLowerCase())) {
                        retVal = false;
                    }
                }
            }

            return retVal;
        });

    }

    needToFilterData( formVals: object ): boolean {
        let retVal = false;
        for ( let key in formVals ) {
            if ( key.startsWith( 'filter-' ) || 'Search' === key ) {
                retVal = true;
            }
        }

        return retVal;
    }

}
