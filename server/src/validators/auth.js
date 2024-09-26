const { check } = require('express-validator');
const db = require('../db');
const {compare} = require('bcryptjs')

// registration

const username = check('username')
    .matches(/^[a-zA-Z0-9]{3,20}$/)
    .withMessage('Username must be alphanumeric and between 3 and 20 characters.')

const password = check('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 6 characters long.')

const userExists = check('username').custom(async value => {
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [value])

    if (rows.length) {
        throw new Error('User already exists')
    }
})

// login
const login = check('username').custom(async (value, { req }) => {
    const user = await db.query('SELECT * FROM users WHERE username = $1', [value])

    if (!user.rows.length) {
        throw new Error('User not found')
    }

    const validPassword = await compare(req.body.password, user.rows[0].password)

    if (!validPassword) {
        throw new Error('Invalid password')
    }

    req.user = user.rows[0]
})

const getUser = async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM users')

        return res.status(200).json({
            success: true,
            data: users.rows
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    registerValidation: [username, password, userExists],
    loginValidation: [login],
    getUser: [getUser]
}