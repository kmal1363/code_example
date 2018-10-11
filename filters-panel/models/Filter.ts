export class Filter {
    title: string = '';
    id: string = '';
    fieldName: string = '';
    gridName: string = '';
    type: string = '';
    operand: string = '';
    options: Array<any> = [];
    dependOn: string = '';
    search: boolean = false;
    isClear: boolean = true;
    defaultValue: any = null;
    isShowTopList: boolean = false;
    value: any = null;
    disableBackendSearch: boolean = false;
    control: any = {};
    onChange = [];
    isInvalid: boolean = false;
    invalidMessage: string = '';

    callOnChange() {
        this.onChange.forEach(onChangeFun => {
          onChangeFun();
        })
    }
}

export class FilterServer {
    Title: string;
    FieldName: string;
    Type: string;
    Operand: string;
    DependOn: string;
    IsSearch: boolean;
    DefaultValue: any;
}

export class FilterBuilder {
    model: Filter;
    constructor() {}

    create() {
        this.model = new Filter();
        return this;
    }

    title(title = '') {
        this.model.title = title;
        return this;
    }

    fieldName(fieldName = '') {
        this.model.fieldName = fieldName;
        return this;
    }

    gridName(gridName = '') {
        this.model.gridName = gridName;
        return this;
    }

    type(type = '') {
        this.model.type = type;
        return this;
    }

    operand(operand = '') {
        this.model.operand = operand;
        return this;
    }

    options(options = []) {
        this.model.options = options;
        return this;
    }

    dependOn(dependOn = '') {
        this.model.dependOn = dependOn;
        return this;
    }

    isSearch(isSearch = false) {
        this.model.search = isSearch;
        return this;
    }

    showTopList(isShowTopList = false) {
        this.model.isShowTopList = isShowTopList;
        return this;
    }

    defaultValue(defaultValue = null) {
        this.model.defaultValue = defaultValue;
        return this;
    }

    value(value) {
        this.model.value = value;
        return this;
    }

    isClear(isClear = true) {
        this.model.isClear = isClear;
        return this;
    }

    filterId(id: string) {
        this.model.id = `filter-${id}`;
        return this;
    }

    build() {
        return this.model;
    }
}
