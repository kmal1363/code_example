import { TemplateRef } from '@angular/core';
import { FieldModel } from '../../fields/models/field-model';

export class Column {
    prop: string = '';
    name: string = '';
    minWidth: number;
    maxWidth: number;
    width: number = 100;
    sortable: boolean = false;
    draggable: boolean = false;
    resizeable: boolean = false;
    checkboxable: boolean = false;
    headerCheckboxable: boolean = false;
    headerClass: string;
    cellClass: string;
    frozenRight: boolean;
    isDefaultSort: boolean = false;
    isViewOpen: boolean = false;
    cellTemplate: TemplateRef<any>;
    type: string; // 'tags'
    comparator: Function;

    isEditMode: boolean = false;
    editField: FieldModel;
}

export class ColumnBuilder {
    model: Column;

    constructor() {}

    create() {
        this.model = new Column();
        return this;
    }

    fieldName(name: string = '') {
        this.model.prop = name;
        return this;
    }

    displayName(displayName: string = '') {
        this.model.name = displayName;
        return this;
    }

    maxWidth(maxWidth: number) {
        this.model.maxWidth = maxWidth > 0 ? maxWidth : undefined;

        if (this.model.maxWidth && this.model.maxWidth < this.model.width) {
            this.model.width = this.model.maxWidth;
        }

        return this;
    }

    minWidth(minWidth: number) {
        this.model.minWidth = minWidth > 0 ? minWidth : undefined;

        if (this.model.minWidth) {
            this.model.width = this.model.minWidth;
        }

        return this;
    }

    width(width: number = 150) {
        this.model.width = width;
        return this;
    }

    cellClass(cellClass: string = '') {
        this.model.cellClass = cellClass;
        return this;
    }

    headerClass(headerClass: string = '') {
        this.model.headerClass = headerClass;
        return this;
    }

    sortable(sortable: boolean = true) {
        this.model.sortable = sortable;
        return this;
    }

    align(align: number = 1) {
        if (align === 2) {
            this.cellClass('a-center');
            this.headerClass('a-center');
        }
        if (align === 3) {
            this.cellClass('a-right');
            this.headerClass('a-right');
        }
        return this;
    }

    frozenRight(frozenRight: boolean = false) {
        this.model.frozenRight = frozenRight;
        return this;
    }

    cellTemplate(cellTemplate: TemplateRef<any>) {
        this.model.cellTemplate = cellTemplate;
        return this;
    }

    defaultSort(isDefaultSort: boolean = true) {
        this.model.isDefaultSort = isDefaultSort;
        return this;
    }

    isViewOpen(isViewOpen: boolean = false) {
        this.model.isViewOpen = isViewOpen;
        return this;
    }

    checkboxable(checkboxable: boolean = false) {
        this.model.checkboxable = checkboxable;
        return this;
    }

    headerCheckboxable(headerCheckboxable: boolean = false) {
        this.model.headerCheckboxable = headerCheckboxable;
        return this;
    }

    editField(editField: FieldModel) {
        this.model.editField = editField;
        return this;
    }

    comparator(comparator: Function) {
        this.model.comparator = comparator;
        return this;
    }

    build() {
        return this.model;
    }
}
