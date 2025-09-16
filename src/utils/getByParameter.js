

const getByParameter = (paramName, method) => {
    return async (req, res) => {
        let jsonBody;
        if (paramName) {
            jsonBody = await method(req.params[paramName])
        } else {
            jsonBody = await method();
        }
        res.json(jsonBody);
    }
}

export { getByParameter }