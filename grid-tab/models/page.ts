export class Sort {
    column: string = null;
    order: string|number = 0;
}

export class Page {
    size: number = 20;
    sizes: Array<number> = [20, 50, 100];
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
}
