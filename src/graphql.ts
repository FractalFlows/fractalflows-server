
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
    signin(): string | Promise<string>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
}

export interface IQuery {
    nonce(): string | Promise<string>;
    testNonce(): string | Promise<string>;
    user(id: number): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface User {
    ethAddress: number;
    exampleField: number;
    id: string;
}

type Nullable<T> = T | null;
