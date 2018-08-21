import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {
    transform(items: any[], formVals: any[]): any[] {

        // Defaults if none are filtered
        if (!items) {
          return [];
        }

        console.log( "Hello World" );

        // Sorting
        /*
        if ( formVals['Sort'] ) {
            let sortBy = formVals['Sort'];
            console.log( 'Found sortBy ' + sortBy );
            for ( let i = 0; i < SORT_ORDER.length; i++ ) {
                let order_option = SORT_ORDER[i];
                if ( order_option.value === sortBy ) {
                    console.log( "Found match" );
                }

            }
        }
        */

        // Nothing selected for filtering
        // TODO: Need to look at dynamic list of filters here
        if (!formVals['Topics'] &&
            !formVals['ContentSource'] &&
            !formVals['Search']) {
            return items;
        }

        // if(!searchText && !searchYear && !searchCat && !searchSort) return items;

        // searchText = searchText.toLowerCase() || '',
        // searchYear,
        // searchCat,
        // searchSort || '0';

        // if (searchSort) {
        // 	if (searchSort === 'A – Z') {
        // 		// https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
        // 		items.sort(function(a, b){
        // 			var nameA=a.cdc_short_title.toLowerCase(), nameB=b.cdc_short_title.toLowerCase();
        // 			if (nameA < nameB) return -1;
        // 			if (nameA > nameB) return 1;
        // 			return 0;
        // 		});
        // 	}
        // 	if (searchSort === 'Z – A') {
        // 		items.sort(function(a, b){
        // 			var nameA=a.cdc_short_title.toLowerCase(), nameB=b.cdc_short_title.toLowerCase();
        // 			if (nameA > nameB) return -1;
        // 			if (nameA < nameB) return 1;
        // 			return 0;
        // 		});
        // 	}
        // 	if (searchSort === 'Newest – Oldest' || searchSort === '0') {
        // 		items.sort(function(a, b){
        // 			a.cdc_event_start_date = new Date(a.cdc_event_start_date).getTime();
        // 			b.cdc_event_start_date = new Date(b.cdc_event_start_date).getTime();

        // 			var nameA=a.cdc_event_start_date, nameB=b.cdc_event_start_date;
        // 			if (nameA > nameB) return -1;
        // 			if (nameA < nameB) return 1;
        // 			return 0;
        // 		});
        // 	}
        // 	if (searchSort === 'Oldest – Newest') {
        // 		items.sort(function(a, b){
        // 			a.cdc_event_start_date = new Date(a.cdc_event_start_date).getTime();
        // 			b.cdc_event_start_date = new Date(b.cdc_event_start_date).getTime();

        // 			var nameA=a.cdc_event_start_date, nameB=b.cdc_event_start_date;
        // 			if (nameA < nameB) return -1;
        // 			if (nameA > nameB) return 1;
        // 			return 0;
        // 		});
        // 	}
        // }

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
            if ( formVals['Search'] ) {
                const searchText = formVals['Search'];
                if ( item['Post Title'].toLowerCase().includes( searchText.toLowerCase() ) ) {
                    retVal = true;
                }
            }

            return retVal;
        });

    }

}
