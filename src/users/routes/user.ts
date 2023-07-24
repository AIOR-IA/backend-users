import { Router } from 'express';
import { createUser, changeStateUser, getUser, getUsers, updateUser } from '../controllers/user';
import { validateFields } from '../middlewares/validate-fields';
import {check } from 'express-validator'
import { createUserValidations, updateUserValidations } from '../middlewares/user-validation';

const router = Router();

router.get('/',       getUsers);
router.get('/:id',    getUser);
router.post('/changeStateUser/:id', changeStateUser);
router.patch(
    '/:id',
    [
        ...updateUserValidations,
        validateFields
    ],
    updateUser);

router.post(
    '/',
    [   
        ...createUserValidations,
        validateFields
    ], 
    createUser);

export default router;