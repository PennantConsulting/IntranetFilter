import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalsService {

    SORT_OPTIONS = [
        {label: 'A - Z', value: 'a-z', field: 'title', dir: 'asc'},
        {label: 'Z - A', value: 'z-a', field: 'title', dir: 'desc'},
        {label: 'Newest - Oldest', value: 'recent-first', field: 'date', dir: 'desc'},
        {label: 'Oldest - Newest', value: 'recent-last', field: 'date', dir: 'asc'},
    ];

    SORT_VAL_DELIMITER = '::';

    COMMENT_ANCHOR = 'cdc_comments';

    constructor() {
    }
}
