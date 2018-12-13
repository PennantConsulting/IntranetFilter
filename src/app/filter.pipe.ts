import {Pipe, PipeTransform} from '@angular/core';
import {GlobalsService} from './globals.service';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {

    constructor(private globalsService: GlobalsService) {
    }

    transform(items: any[], formVals: any[], searchFields: string[], sortFields: string[], showSubs: boolean): any[] {

        const filterPipe = this;

        // Defaults if none are filtered
        if (!items) {
            return [];
        }

        // Sorting
        if (formVals['Sort']) {
            const sortByFormVal = formVals['Sort'];
            // sortBy will be {field name}->{order} so something like Post Title->asc where order is asc or desc
            const sortByParts = sortByFormVal.split(this.globalsService.SORT_VAL_DELIMITER);
            if ( sortByParts.length === 2 ) {
                const sortField = sortByParts[0];
                const sortDirection = sortByParts[1];
                items.sort((a, b): number => {
                    const aVal = this.formatFieldValForFiltering( a[sortField] );
                    const bVal = this.formatFieldValForFiltering( b[sortField] );
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
                });
            }
        }

        for(let i=0; i<items.length; i++){
            let item = items[i];
            let formats = item['Alternate Formats'];
            for(let format of formats){
                let file = format['Alternative File Format'];
                let ext = file.substring(file.lastIndexOf('.')+1);
                switch(ext){
                    case 'doc': case 'docx':
                        ext = 'word';
                        break;
                    case 'pptx':
                        ext = 'ppt';
                        break;
                    case 'xls': case 'xlsx':
                        ext = 'excel';
                        break;
                    case 'rtf':
                        ext = 'txt';
                        break;
                }
                if (['mp3','mp4', 'wmv','webm','wav','ogg','wma','mov','rm','mpeg','ram','ogv','avi','qt','mpg'].indexOf(ext) > -1) {ext = 'media'};
                if (['dta','sps','save'].indexOf(ext) > -1){ext = 'stats'};
                format['extension'] = '#'+ext;
            }
        };

        // If nothing selected for filtering don't filter
        if ( ! this.needToFilterData( formVals ) ) {
            return items;
        }

        // Determine the filter fields in the form
        const formFilters = [];
        for ( const key in formVals ) {
            if ( key.startsWith( 'filter-' ) ) {
                const parts = key.split( '-' );
                if ( parts.length > 1 ) {
                    if ( formVals[ key ] ) { // If form value is undefined or empty, do not filter on it
                        formFilters[parts[1]] = formVals[key];
                    }
                }
            }
        }

        return items.filter(function (item) {
            let retVal = true;

            for ( const filterField in formFilters ) {
                let itemHasFilterVal = false;
                for (let i = 0; i < item[filterField].length; i++) {
                    if (item[filterField][i] === formFilters[filterField] ) {
                        itemHasFilterVal = true;
                        break;
                    } else if ( showSubs && item[filterField][i].startsWith( formFilters[filterField] ) ) {
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
                    let foundSearchTerm = false;
                    for ( let i = 0; i < searchFields.length; i++ ) {
                        const searchField = searchFields[i];
                        let itemFieldVal = item[searchField];
                        itemFieldVal = filterPipe.formatFieldValForSearch( itemFieldVal );
                        if (itemFieldVal.includes(searchText.toLowerCase())) {
                            foundSearchTerm = true;
                            break;
                        }
                    }
                    if ( ! foundSearchTerm ) {
                        retVal = false;
                    }
                }
            }

            return retVal;
        });

    }

    needToFilterData( formVals: object ): boolean {
        let retVal = false;
        for ( const key in formVals ) {
            if ( key.startsWith( 'filter-' ) || 'Search' === key ) {
                retVal = true;
            }
        }

        return retVal;
    }

    formatFieldValForFiltering( val ) {
        let retVal = val;
        if ( 'string' === typeof val ) {
            retVal = val.toLowerCase();
        } else if ( 'object' === typeof val ) {
            retVal = JSON.stringify( val );
        } else if ( null === val ) {
            retVal = '';
        }

        return retVal;
    }

    formatFieldValForSearch( val ) {
        let retVal = val;
        if ( 'string' === typeof val ) {
            retVal = val.toLowerCase();
        } else if ( 'object' === typeof val ) {
            retVal = JSON.stringify(val).toLowerCase();
        } else if ( 'number' === typeof val ) {
            retVal = val.toString();
        } else if ( 'boolean' === typeof val ) {
            retVal = val ? 'true' : 'false';
        } else if ( null === val || undefined === val ) {
            retVal = '';
        }

        return retVal;
    }

}
