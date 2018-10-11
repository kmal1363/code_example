import * as R from 'ramda';
import { globalSettings } from '../../utils';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { FiltersApiService } from '../services/filters-api.service';
import { FilterService } from '../services/filter.service';
import { FiltersStorageService } from '../services/filters-storage.service';
import { EventsService } from '../../common/services/events.service';
import { ValidationService } from '../../common/services/validator.service';

import { Filter } from './models/Filter';

@Component({
    selector: 'lxft-filters-panel',
    templateUrl: './filters-panel.component.html'
})
export class FiltersPanelComponent implements OnInit {
    @Output() onApply: EventEmitter<any> = new EventEmitter();
    @Output() onReset: EventEmitter<any> = new EventEmitter();
    @Input() gridName: string;

    public isLoading: boolean = false;
    public isCollapsed: boolean = false;
    public filters: Array<Filter> = [];
    public activeFilters: Array<Filter> = [];
    public filtersTypes = {
        date: 'date',
        select: 'select',
    };

    constructor(
        private api: FiltersApiService,
        private filtersService: FilterService,
        private filtersStorage: FiltersStorageService,
        private events: EventsService,
        private validator: ValidationService,
    ) {
        this.isCollapsed = this.filtersStorage.getCollapseState();
    }

    public ngOnInit() {
        this.getFilterConfig();
    }

    getFilterConfig() {
        this.api.getFiltersConfig(this.gridName)
            .subscribe(data => {
                this.parseAndSetFilters(data);

                this.setOnChangeValidation();
                this.setDefaultValuesToFilters();
                this.setStorageValueToFilters();
                this.setActiveFilters();
            });
    }

    parseAndSetFilters(data) {
        const filters: Array<Filter> = data.map(this.filtersService.parseFilters.bind(this, this.gridName));
        this.filtersService.setFilters(filters);
        this.filters = this.filtersService.getFilters();
    }

    setOnChangeValidation() {
        this.filters.forEach(item => {
            if (item.type === this.filtersTypes.date) {
                item.onChange.push(() => {
                    item.isInvalid = item.value ? this.validator.isDateFormatError(item.value) : false;
                });
            }
        });
    }

    setDefaultValuesToFilters() {
        this.filters.forEach(item => {
            if (!R.isNil(item.defaultValue) && !item.value) {
                item.value = item.options && item.options.length > 0 ? item.options.find(option => option.Value === item.defaultValue) : {Value: item.defaultValue};
            }
        });
    }

    setStorageValueToFilters() {
        const fromStorage = this.filtersStorage.getFromStorage(this.gridName);
        if (!fromStorage || fromStorage.length === 0) {
            return;
        }
        fromStorage.forEach(itemStorage => {
            const filter = this.filters.find(item => itemStorage.fieldName === item.fieldName && itemStorage.operand === item.operand);
            if (filter) {
                filter.value = itemStorage.value;
            }
        });
    }

    applyFilters() {
        this.setActiveFilters();
        this.onApply.emit(this.activeFilters);
    }

    setActiveFilters() {
        const filtersWithValue = R.filter(item => R.prop('value', item) && item.value.Value !== globalSettings.emptyFilterValue, this.filters);
        this.activeFilters = filtersWithValue;
        this.filtersStorage.setToStorage(this.activeFilters, this.gridName);
    }

    resetFilters() {
        this.filters.forEach(item => item.value = null);
        this.setDefaultValuesToFilters();

        this.applyFilters();
    }

    isSubmitDisabled() {
        const invalidFilters = this.filters.filter(item => item.isInvalid);
        return this.isLoading || invalidFilters.length > 0;
    }

    isResetDisabled() {
        const activeWithoutDefault = this.activeFilters.filter(item => {
            const isDefaultValue = item.value && !R.isNil(item.defaultValue) && item.defaultValue === item.value.Value;
            return item.value && !isDefaultValue;
        });
        return this.isLoading || activeWithoutDefault.length === 0;
    }

    toggleCollapsed() {
        this.isCollapsed = !this.isCollapsed;
        this.filtersStorage.setCollapseState(this.isCollapsed);
        this.events.updateGridSize$.emit();
    }

    clearFilterItem(filter: Filter) {
        filter.value = null;
        filter.callOnChange();
    }

    isClearItemDisabled(filter) {
        return !filter || !filter.value || !filter.isClear;
    }
}
