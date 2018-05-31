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

    isEditMode: boolean = false;
    editField: FieldModel;
}
