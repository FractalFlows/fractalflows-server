
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

export interface SignInInput {
    ens: string;
    siweMessage: SiweMessageInput;
}

export interface SiweMessageInput {
    address: string;
    chainId: string;
    domain: string;
    issuedAt: string;
    nonce: string;
    signature: string;
    statement: string;
    type: string;
    uri: string;
    version: string;
}

export interface UpdateUserInput {
    exampleField?: Nullable<number>;
    id: number;
}

export interface IMutation {
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    removeUser(id: number): User | Promise<User>;
    signIn(signInInput: SignInInput): boolean | Promise<boolean>;
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
