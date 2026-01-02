// bcrypt & jwt :-
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');
const validate = require('../utils/validator');

const register = async (req, res) => {
    try {
        // Validater :-
        validate(req.body);

        // Hashing :-
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // Add to DB :-
        const user = await User.create(req.body);

        // Jwt token created :- jwt key -> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        const token = jwt.sign({ _id: user._id, emailId: req.body.emailId }, process.env.JWT_SECRECT_KEY, { expiresIn: 60 * 60 }) // payload, SecretKey, Time
        res.cookie('token', token, {
            httpOnly: true,          // JS can't access (XSS protection)
            secure: true,            // HTTPS only (use false in local dev)
            sameSite: "strict",      // CSRF protection
            maxAge: 60 * 60 * 1000   // 1 hour
        }); // key : value : maxAge in ms 

        res.status(201).send("User Registered."); // suscess
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
}