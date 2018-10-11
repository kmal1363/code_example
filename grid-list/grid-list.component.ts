import * as R from 'ramda';
import {ViewChild, TemplateRef, Input, Component, OnInit, EventEmitter, OnDestroy, ContentChild } from '@angular/core';

import { GridPageApiService } from '../services/grid-page-api.service';
import { GridPageColumnsService } from '../services/grid-page-columns.service';
import { GridService } from '../services/grid.service';

import { Page, Sort } from './models/page';
import { Column } from './models/column';
import { Filter } from '../../filters/models/Filter';

import 'rxjs/add/operator/map';

@Component({
    selector: 'lxft-grid-list',
    templateUrl: 'grid-list.component.html'
})
export class GridListComponent implements OnInit, OnDestroy {
    @Input() paginationOptions: Page = new Page();
    @Input() additionalColumnsProcessing: Function;
    @Input() customListParser: Function;
    @Input() isShowFilters: boolean = true;
    @Input() isShowToggleColumns: boolean = false;
    @Input() isClickableColumns: boolean = false;
    @Input() rowHeight: number | Function = 36;

    public columns: Array<Column>;
    public rows = [];
    public selectedRows = [];
    public sortOptions: Sort = new Sort();
    public filtersOptions: Filter[];
    public isLoading: boolean = false;
    public isLoadingFirst: boolean = false;
    public defSortGrid: Array<{prop: string, dir: string}> = [];
    private updateGridSubscribe: EventEmitter<any>;

    @ViewChild('gridTable') gridTable: any;
    @ContentChild('clickableColumnTmpl') clickableColumnTmpl: TemplateRef<any>;
    @ContentChild('buttonsToolbar') buttonsToolbar: TemplateRef<any>;

    constructor(
        protected api: GridPageApiService,
        protected columnsService: GridPageColumnsService,
        protected gridService: GridService
    ) {
        this.isLoadingFirst = true;
    }

    ngOnInit() {
        this.initGridConfigAndData();

        if (this.paginationOptions.updateEvent) {
            this.updateGridSubscribe = this.paginationOptions.updateEvent.subscribe(() => {
                this.getPageAndClearCache();
            });
        }
    }

    ngOnDestroy() {
        if (this.updateGridSubscribe) {
            this.updateGridSubscribe.unsubscribe();
        }
    }

    setPageNumber(newPageNumber) {
        this.paginationOptions.pageNumber = newPageNumber;
        this.getPage();
    }

    setSort(pageInfo) {
        this.sortOptions.column = pageInfo.column.prop;
        this.sortOptions.order = pageInfo.newValue;
        this.getPage();
    }

    setFilters(filters?: Filter[]) {
        this.filtersOptions = R.isEmpty(filters) || R.isNil(filters) ? [] : filters;
        this.paginationOptions.pageNumber = 1;

        this.getPage();
    }

    setPageSize(pageSize) {
        this.paginationOptions.size = pageSize;
        this.paginationOptions.pageNumber = 1;
        this.getPage();
    }

    getPageAndClearCache() {
        this.gridService.clearCache();
        this.getPage();
    }

    getPage() {
        this.isLoading = true;
        this.selectedRows= [];

        this.getTotalMatches();

        this.api.listSearch(this.paginationOptions.pathForApi, this.getPageParams())
            .then((data) => {
                this.setList(data);
                this.isLoading = false;
                this.isLoadingFirst = false;
            })
            .catch(() => {
                this.isLoading = false;
                this.isLoadingFirst = false;
            });
    }

    getPageParams() {
        return this.gridService.getPageParams(this.paginationOptions, this.sortOptions, this.filtersOptions);
    }

    setList(data) {
        this.rows = this.parseList(data);
        this.paginationOptions.pageNumber = data.CurrentPage;
        this.paginationOptions.rowsOnPage = this.rows.length;
    }

    parseList(data) {
        if (this.customListParser) {
            return this.customListParser(data, this.columns);
        }
        return data.Results;
    }

    updateGridColumns() {
        if (this.additionalColumnsProcessing) {
            this.columns = this.additionalColumnsProcessing([...this.columns]);
        }

        if (this.isClickableColumns) {
            this.setClickableColumns();
        }
    }

    getGridColumnsConfig() {
        this.isLoading = true;
        return this.api.getGridColumnsConfig(this.paginationOptions.gridName)
            .map(data => {
                this.columns = data.map(item => this.columnsService.parseGridColumn(item));
                this.setDefaultSorting();
                this.updateGridColumns();
            });
    }

    initGridConfigAndData() {
        this.getGridColumnsConfig()
            .subscribe(() => {
                this.getPage();
            })
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
        this.defSortGrid = [newSort];
        this.sortOptions.order = 'asc';
        this.sortOptions.column = column.prop;
    }

    getTotalMatches() {
        this.paginationOptions.isMatchLoading = true;
        this.api.getTotalMatches(this.paginationOptions.pathForApi, this.getPageParams())
            .then((data) => {
                this.paginationOptions.filteredRows = data;
                this.paginationOptions.isMatchLoading = false;
            });
    }

    setClickableColumns() {
        this.columns = this.columns.map(item => {
            if (item.isViewOpen) {
                item.cellTemplate = this.clickableColumnTmpl;
            }
            return item;
        });
    }

    onLoaderChange(isLoading: boolean) {
        this.isLoading = isLoading;
    }
}
