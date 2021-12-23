
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateUserInput {
    exampleField: number;
}

export interface UpdateUserInput {
    exampleField?: Nullable<number>;
    id: number;
}

export interface IMutation {
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    removeUser(id: number): User | Promise<User>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
}

export interface IQuery {
    user(id: number): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface User {
    exampleField: number;
    id: number;
}

type Nullable<T> = T | null;
