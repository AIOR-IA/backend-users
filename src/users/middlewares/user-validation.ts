import {check } from 'express-validator';

export const createUserValidations = [
    check('username','Name is required').not().isEmpty(),
    check('email','Email is required').isEmail(),
    check('password','Password is required').not().isEmpty(),
    check('password','Password must have 6 letters').isLength({ min: 6, max: 10}),
];

export const updateUserValidations = [
    check('username','Name is required').optional().not().isEmpty(),
    check('email','Email is required').optional().isEmail(),
    check('password','Password must have 6 letters').optional().isLength({ min: 6, max: 10}),
];