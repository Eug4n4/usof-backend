class QueryFilter {
    field;
    value;
    wrapper;
    constructor(field, value, wrapper) {
        this.field = field;
        this.wrapper = wrapper;
        this.value = value;
    }


    apply(query) {
        return query;
    }

}

class FieldFilter extends QueryFilter {
    apply(query) {
        query += `${this.field} = ${this.value} and `
        if (this.wrapper) {
            query = this.wrapper.apply(query)
        }
        return query;
    }
}

class CategoryFilter extends FieldFilter {
    constructor(field, categoriesLength, wrapper) {
        super(field, undefined, wrapper)
        this.categoriesLength = categoriesLength;
    }
    apply(query) {
        query += `${this.field}`
        if (this.categoriesLength == 1) {
            query += ` = ? and `;
        } else {
            let template = '?,'.repeat(this.categoriesLength);
            template = template.slice(0, template.length - 1)
            query += ` in (${template}) and `
        }
        if (this.wrapper) {
            query = this.wrapper.apply(query)

        }
        return query;
    }
}
class DateFilter extends QueryFilter {
    constructor(field, startInterval, endInterval, wrapper) {
        super(field, null, wrapper);
        this.startInterval = startInterval;
        this.endInterval = endInterval;
    }

    apply(query) {
        query += `(${this.field} >= '${this.startInterval}' and ${this.field} <= '${this.endInterval}') and `
        if (this.wrapper) {
            query = this.wrapper.apply(query)
        }
        return query;
    }
}


class RoleFilter extends QueryFilter {
    role;
    constructor(role, wrapper) {
        super(undefined, undefined, wrapper);
        this.role = role;
    }

    apply(query) {
        if (this.role) {
            if (this.role === 'user') {
                if (query.search("posts.is_active") != -1) {
                    query = query.replace(/and posts.is_active = .?/, '')
                }
                query += `(posts.author = ? OR posts.is_active = 1)`
            } else if (this.role === 'admin') {
                if (query.endsWith("where ")) {
                    query = query.replace("where ", "")
                }
                if (query.endsWith("and ")) {
                    query = query.slice(0, query.length - "and ".length)
                }
            }
        } else {
            if (query.search("posts.is_active = 0") != -1) {
                query = query.replace(/and posts.is_active = .?/, '')
            }
            query += `posts.is_active = 1`
        }
        return query
    }
}


export { FieldFilter, DateFilter, RoleFilter, CategoryFilter }