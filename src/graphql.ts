
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateClaimInput {
    exampleField: number;
}

export interface CreateUserInput {
    email?: Nullable<string>;
    ethAddress?: Nullable<string>;
}

export interface SignInInput {
    avatar?: Nullable<string>;
    ens?: Nullable<string>;
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

export interface UpdateClaimInput {
    exampleField?: Nullable<number>;
    id: number;
}

export interface UpdateUserInput {
    email?: Nullable<string>;
    ethAddress?: Nullable<string>;
    id: number;
}

export interface Claim {
    exampleField: number;
}

export interface IMutation {
    createClaim(createClaimInput: CreateClaimInput): Claim | Promise<Claim>;
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    removeClaim(id: number): Claim | Promise<Claim>;
    removeUser(id: number): User | Promise<User>;
    signIn(signInInput: SignInInput): boolean | Promise<boolean>;
    signOut(): boolean | Promise<boolean>;
    updateClaim(updateClaimInput: UpdateClaimInput): Claim | Promise<Claim>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
}

export interface IQuery {
    claim(id: number): Claim | Promise<Claim>;
    claims(): Claim[] | Promise<Claim[]>;
    nonce(): string | Promise<string>;
    session(): Session | Promise<Session>;
    user(id: number): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface Session {
    avatar?: Nullable<string>;
    ens?: Nullable<string>;
    siweMessage: SiweMessage;
}

export interface SiweMessage {
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

export interface User {
    email?: Nullable<string>;
    ethAddress?: Nullable<string>;
    id: string;
}

type Nullable<T> = T | null;
