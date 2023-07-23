import { Router } from 'express';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/user';
import { validateFields } from '../middlewares/validate-fields';
import {check } from 'express-validator'
import { createUserValidations, updateUserValidations } from '../middlewares/user-validation';

const router = Router();

router.get('/',       getUsers);
router.get('/:id',    getUser);
router.delete('/:id', deleteUser);
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