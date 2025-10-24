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
        query += `${this.field} = ${this.value}`
        if (this.wrapper) {
            query += " and "
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
        const append = `exists (select 1 from post_categories join categories on categories.id = post_categories.category_id where post_categories.post_id = posts.id and categories.title in`
        if (this.categoriesLength !== 0) {
            query += append
            let template = '?,'.repeat(this.categoriesLength);
            template = template.slice(0, template.length - 1)
            query += ` (${template}))`
        }
        if (this.wrapper) {
            query += " and "
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
        query += `(${this.field} >= '${this.startInterval}' and ${this.field} <= '${this.endInterval}')`
        if (this.wrapper) {
            query += " and "
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