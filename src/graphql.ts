
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateAttributionInput {
    exampleField: number;
}

export interface CreateClaimInput {
    exampleField: number;
}

export interface CreateSourceInput {
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

export interface UpdateAttributionInput {
    exampleField?: Nullable<number>;
    id: number;
}

export interface UpdateClaimInput {
    exampleField?: Nullable<number>;
    id: number;
}

export interface UpdateSourceInput {
    exampleField?: Nullable<number>;
    id: number;
}

export interface UpdateUserInput {
    email?: Nullable<string>;
    ethAddress?: Nullable<string>;
    id: number;
}

export interface Attribution {
    id: string;
    identifier: string;
    origin: string;
}

export interface Claim {
    attributions: Attribution[];
    createdAt: string;
    createdBy: User;
    id: string;
    slug: string;
    sources: Source[];
    summary: string;
    tags: Tag[];
    title: string;
    updatedAt: string;
}

export interface IMutation {
    createAttribution(createAttributionInput: CreateAttributionInput): Attribution | Promise<Attribution>;
    createClaim(createClaimInput: CreateClaimInput): Claim | Promise<Claim>;
    createSource(createSourceInput: CreateSourceInput): Source | Promise<Source>;
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    removeAttribution(id: number): Attribution | Promise<Attribution>;
    removeClaim(id: number): Claim | Promise<Claim>;
    removeSource(id: number): Source | Promise<Source>;
    removeUser(id: number): User | Promise<User>;
    signIn(signInInput: SignInInput): boolean | Promise<boolean>;
    signOut(): boolean | Promise<boolean>;
    updateAttribution(updateAttributionInput: UpdateAttributionInput): Attribution | Promise<Attribution>;
    updateClaim(updateClaimInput: UpdateClaimInput): Claim | Promise<Claim>;
    updateSource(updateSourceInput: UpdateSourceInput): Source | Promise<Source>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
}

export interface IQuery {
    attribution(id: number): Attribution | Promise<Attribution>;
    attributions(): Attribution[] | Promise<Attribution[]>;
    claim(id: number): Claim | Promise<Claim>;
    claims(): Claim[] | Promise<Claim[]>;
    nonce(): string | Promise<string>;
    session(): Session | Promise<Session>;
    source(id: number): Source | Promise<Source>;
    sources(): Source[] | Promise<Source[]>;
    tag(id: number): Tag | Promise<Tag>;
    tags(): Tag[] | Promise<Tag[]>;
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

export interface Source {
    id: string;
    origin: string;
    url: string;
}

export interface Tag {
    id: string;
    label: string;
}

export interface User {
    claims?: Nullable<Claim[]>;
    email?: Nullable<string>;
    ethAddress?: Nullable<string>;
    id: string;
}

type Nullable<T> = T | null;
