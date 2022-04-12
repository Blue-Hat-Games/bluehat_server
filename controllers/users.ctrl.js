const models = require("../models");

exports.responseTest = function (req, res, next) {
    res.send('respond with a resource');
}

exports.addUser = async (req, res) => {
    let user;
    if (!req.body.email || !req.body.wallet_address)
        return (res.status(400).send('email and wallet_address are required'));
    try {
        if (!authCache[req.body.email] || authCache[req.body.email] == false) {
            throw ("EMAIL_NOT_VERIFIED");
        }
        user = await models.user.create({
            email: req.body.email,
            // wallet_address: req.body.wallet_address,
            login_type: "email",
            coin: 0,
        });
    } catch (e) {
        if (e.parent !== undefined && e.parent.code == "ER_DUP_ENTRY")
        try{
            user = await models.user.findOne({where: {email: req.body.email}});
            res.status(200).send(user);
        } catch (e) {
            return (res.status(500).send('Internal Server Error'));
        }
        if (e == "EMAIL_NOT_VERIFIED")
            return (res.status(409).send('email not verified'));
        else
            return (res.status(400).send(e));
    }
    return (res.status(201).send(user));
}