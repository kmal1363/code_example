import { EventEmitter } from '@angular/core';

import { paginationInfo } from  '../../utils';

export class Sort {
    column: string = null;
    order: string|number = 0;
}

export class Page {
    size: number = paginationInfo.pageSize;
    sizes: Array<number> = paginationInfo.pageSizes;
    filteredRows: number = 0;
    totalPages: number = 1;
    pageNumber: number = 1;
    rowsOnPage: number = 0;
    pathForApi: string = '';
    gridName: string = '';
    isMatchLoading: boolean = false;
    title: string = '';
    permissionEdit: string = '';
    permissionDelete: string = '';
    updateEvent: EventEmitter<any>;
}
