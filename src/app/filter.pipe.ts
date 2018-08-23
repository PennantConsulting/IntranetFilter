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
                            let foo = a[sortField];
                            let bar = b[sortField];
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

        // Nothing selected for filtering
        // TODO: Need to look at dynamic list of filters here
        if (!formVals['Topics'] &&
            !formVals['ContentSource'] &&
            !formVals['Search']) {
            return items;
        }

        return items.filter(function (item) {
            // if (searchYear && item.cdc_session_browsing_lifespan.indexOf(searchYear) === -1) {
            // 	return false;
            // }

            let retVal = false;

            if (formVals['Topics']) {
                for (let i = 0; i < item.Topics.length; i++) {
                    if (item.Topics[i] === formVals['Topics']) {
                        retVal = true;
                    }
                }
            }

            if (formVals['ContentSource']) {
                for (let i = 0; i < item['Content Source'].length; i++) {
                    if (item['Content Source'][i] === formVals['ContentSource']) {
                        retVal = true;
                    }
                }
            }

            /*
            if (item.cdc_short_title.toLowerCase().includes(searchText.toLowerCase()) ||
                item.cdc_internal_description.toLowerCase().includes(searchText.toLowerCase())) {
                return true;
            } else {
                return false;
            }
            */
            if (formVals['Search']) {
                const searchText = formVals['Search'];
                if (item['Post Title'].toLowerCase().includes(searchText.toLowerCase())) {
                    retVal = true;
                }
            }

            return retVal;
        });

    }

}
