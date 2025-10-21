

const getByParameter = (paramName, method) => {
    return async (req, res) => {
        let jsonBody;
        if (paramName) {
            jsonBody = await method(req.params[paramName])
        } else {
            jsonBody = await method();
        }
        if (jsonBody != undefined) {
            return res.json(jsonBody);
        }
        return res.status(404).json({ "message": "I cant find this" })
    }
}

export { getByParameter }