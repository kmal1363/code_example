import { Component, ViewChild, Input, OnInit, ContentChild, TemplateRef } from '@angular/core';
import { sortRows } from '../../custom-node-modules/ngx-datatable/utils';

import { Column } from './models/column';
import { Page } from './models/page';

@Component({
    selector: 'grid-tab',
    templateUrl: './grid-tab.component.html'
})
export class GridTabComponent implements OnInit {
    @Input() getDataFromServer: Function;
    @Input() columns: Array<Column> = [];
    @Input() isShowNav: boolean = true;
    @Input() maxCols: number = 10;
    @Input() pageSize: number = null;
    @Input() pageSizes: Array<number> = null;
    @Input() isSmallWindowWithGrid: boolean = false;

    public data: Array<any> = [];
    public rows: Array<any> = [];
    public paginationOptions: Page = new Page();
    public isLoading: boolean = false;
    public sorts: Array<any> = [];

    @ViewChild('gridTable') gridTable: any;

    @ContentChild('navRight') navRight: TemplateRef<any>;

    constructor() {}

    ngOnInit() {
        if (this.pageSize) {
            this.paginationOptions.size = this.pageSize;
        }
        if (this.pageSizes) {
            this.paginationOptions.sizes = this.pageSizes;
            this.paginationOptions.size = this.pageSizes[0];
        }
        this.getData();
    }

    setPageNumber(newPageNumber) {
        this.paginationOptions.pageNumber = newPageNumber;
        this.getPage();
    }

    setSort(pageInfo) {
        this.sorts = pageInfo.defSortGrid || pageInfo.sorts;
        this.data = sortRows(this.data, this.columns, this.sorts);
        this.getPage();
    }

    setPageSize(pageSize) {
        this.paginationOptions.size = pageSize;
        this.paginationOptions.pageNumber = 1;
        this.getPage();
    }

    getPage() {
        const pageSize = this.paginationOptions.size;
        const from = (this.paginationOptions.pageNumber - 1) * pageSize;

        this.rows = this.data.slice(from, from + pageSize);
        this.paginationOptions.rowsOnPage = this.rows.length;
        this.paginationOptions.filteredRows = this.data.length;
    }

    setDefaultSorting() {
        const column = this.columns.find(item => item.isDefaultSort);
        if (!column) {
            return;
        }
        const newSort = {
            prop: column.prop,
            dir:  'asc'
        };
        this.sorts = [newSort];
        this.data = sortRows(this.data, this.columns, this.sorts);
    }

    getDataTab() {
        return this.getDataFromServer();
    }

    getData() {
        this.isLoading = true;
        this.getDataTab()
            .subscribe(
                data => {
                    this.setRows(data);
                    this.isLoading = false;
                },
                () => {
                    this.isLoading = false;
                }
            );
    }

    setRows(data) {
        this.data = data;
        this.paginationOptions.filteredRows = this.data.length;
        this.setDefaultSorting();
        this.getPage();
    }
}
