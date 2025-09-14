const logout = (req, res) => {
    if (req.session.user) {
        req.session.destroy(err => {
            if (err) {
                throw err;
            }
        })
    }
}

export default logout;