class QuerySort {
    field
    constructor(field) {
        this.field = field;
    }

}

class SortDescending extends QuerySort {

    apply(query) {
        query += `${this.field} desc`
        return query;
    }
}

class SortAscending extends QuerySort {
    apply(query) {
        query += `${this.field} asc`
        return query;
    }
}


export { SortDescending, SortAscending }