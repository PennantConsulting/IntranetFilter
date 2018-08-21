import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

    // TODO: Change the field values to be generics 'title' and 'date'
    SORT_OPTIONS = [
        { label: 'A - Z', value: 'a-z', field: 'Post Title', dir: 'asc' },
        { label: 'Z - A', value: 'z-a', field: 'Post Title', dir: 'desc' },
        { label: 'Newest - Oldest', value: 'recent-first', field: 'Last Reviewed', dir: 'asc' },
        { label: 'Oldest - Newest', value: 'recent-last', field: 'Last Reviewed', dir: 'desc' },
    ];

  constructor() { }
}
