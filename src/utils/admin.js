import hash_password from "./hash_password.js"

const adminHashPassword = (db) => {
    return {
        resource: db.table('users'),
        options: {
            properties: {
                password: { isVisible: { list: false, filter: false, show: false, edit: true } }
            },
            actions: {
                new: {
                    before: async (request) => {
                        if (request.payload.password) {
                            request.payload.password = await hash_password(request.payload.password)
                        }
                        return request
                    }
                },
                edit: {
                    before: async (request) => {
                        if (request.payload.password) {
                            request.payload.password = await hash_password(request.payload.password)
                        }
                        return request
                    }
                }
            }
        }
    }
}

const hideToken = (db) => {
    return {
        resource: db.table('tokens'),
        options: {
            properties: {
                refresh: { isVisible: false }
            }
        }
    }
}

export { adminHashPassword, hideToken }