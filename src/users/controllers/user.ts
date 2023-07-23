import { Request, Response, json } from "express";
import { User } from "../entities/user.entity";
import * as bcrypt from 'bcrypt'
import { UserResponseDto } from "../dto/user-response.dto";
import { plainToInstance } from 'class-transformer';

export const getUsers = async( req: Request, res: Response ) => {

    const users = await User.find();

    const usersResponse = plainToInstance( UserResponseDto, users );

    res.status(200).json({
        ok:true,
        data: usersResponse
    });
}

export const getUser = async( req: Request, res: Response ) => {

    const { id } = req.params;

    try {
        const user = await User.findOne({ where: { id } });

        if( !user ) {
            return res.status(404).json({
                ok: false,
                msg: 'User not found'
            });
        }

        const { password, ...data } = {...user};

        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: error,
        });
    }
}

export const createUser = async( req: Request, res: Response ) => {

    const { username, email, password : inputPassword } = req.body;

    try {
        let user = await User.findOne({ where: { email: email } });

        if( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'User exists with this email'
            });
        } 

        user = new User();
        user.username = username;
        user.email = email;
        user.createdAt = new Date();
        user.password = EncryptPassword( inputPassword );

        await user.save();

        const { password, ...data } = { ...user };

        res.status(201).json({
            ok: true,
            data,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: error,
        });
    }
}

export const updateUser = async( req: Request, res: Response ) => {

    const userId = req.params.id;
    const { email, password: inputPassword } = req.body;

    try {
        const user = await User.findOne({ where: { id: userId } });

        if( !user ) {
            return res.status(400).json({
                ok: false,
                msg: `User with id ${userId} not found.`
            });
        }
        
        if( email ) {
            const userEmail = await User.findOne({ where: { email } });
            if( userEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'User exists with this email.'
                });
            }
        }

        if( inputPassword ) {
            user.password = EncryptPassword( inputPassword );
        }

        user.updatedAt = new Date();

        await User.update({ id: userId }, { ...req.body,updatedAt: user.updatedAt, password: user.password });

        const userUpdate = await User.findOne({ where: { id: userId } });
        
        const { password, ...data } = {...userUpdate};

        res.status(200).json({
            ok:true,
            data
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error,
        });
    }
}

export const deleteUser = async( req: Request, res: Response ) => {

    const { id } = req.params;

    try {
        const user = await User.findOneBy({ id });

        if( !user ) {
            return res.status(404).json({
                ok: false,
                msg: `User with id ${id} not found.`
            });
        }

        user.isActive = false;
        user.updatedAt = new Date();

        await User.update({ id }, { ...user });

        const { password, ...data} = { ...user };

        res.status(200).json({
            ok: true,
            data
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: error,
        });
    }
}

const EncryptPassword = ( password: string): string => {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync( password, salt );
}


