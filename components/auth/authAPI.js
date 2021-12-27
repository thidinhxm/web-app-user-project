const userService = require('../users/userService');

exports.checkExistsAccount = async (req, res, next) => {
    try {
        const {email} = req.body;
        const account = await userService.getAccountByEmail(email);
        if (account) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    }
    catch (err) {
        next(err);
    }
}
