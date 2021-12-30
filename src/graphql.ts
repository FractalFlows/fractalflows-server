
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateAttributionInput {
    identifier: string;
    origin: string;
}

export interface CreateClaimInput {
    attributions?: Nullable<CreateAttributionInput[]>;
    sources?: Nullable<CreateSourceInput[]>;
    summary: string;
    tags?: Nullable<CreateTagInput[]>;
    title: string;
    userId?: Nullable<string>;
}

export interface CreateSourceInput {
    origin: string;
    url: string;
}

export interface CreateTagInput {
    id?: Nullable<string>;
    label: string;
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
    attributions?: Nullable<CreateAttributionInput[]>;
    id: number;
    sources?: Nullable<CreateSourceInput[]>;
    summary?: Nullable<string>;
    tags?: Nullable<CreateTagInput[]>;
    title?: Nullable<string>;
    userId?: Nullable<string>;
}

export interface UpdateSourceInput {
    id: number;
    origin?: Nullable<string>;
    url?: Nullable<string>;
}

export interface UpdateUserInput {
    email?: Nullable<string>;
    ethAddress?: Nullable<string>;
    id: number;
}

export interface Attribution {
    claim: Claim;
    createdAt: string;
    id: string;
    identifier: string;
    origin: string;
    updatedAt: string;
}

export interface Claim {
    attributions?: Nullable<Attribution[]>;
    createdAt: string;
    id: string;
    slug: string;
    sources?: Nullable<Source[]>;
    summary: string;
    tags?: Nullable<Tag[]>;
    title: string;
    updatedAt: string;
    user: User;
}

export interface IMutation {
    createClaim(createClaimInput: CreateClaimInput): Claim | Promise<Claim>;
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    removeAttribution(id: number): Attribution | Promise<Attribution>;
    removeClaim(id: number): Claim | Promise<Claim>;
    removeSource(id: number): Source | Promise<Source>;
    removeUser(id: number): User | Promise<User>;
    signIn(signInInput: SignInInput): boolean | Promise<boolean>;
    signOut(): boolean | Promise<boolean>;
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
    searchTags(term?: Nullable<string>): Tag[] | Promise<Tag[]>;
    session(): Session | Promise<Session>;
    source(id: number): Source | Promise<Source>;
    sources(): Source[] | Promise<Source[]>;
    tag(id: number): Tag | Promise<Tag>;
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
    claim: Claim;
    createdAt: string;
    id: string;
    origin: string;
    updatedAt: string;
    url: string;
}

export interface Tag {
    createdAt: string;
    id: string;
    label: string;
    updatedAt: string;
}

export interface User {
    claims?: Nullable<Claim[]>;
    createdAt: string;
    email?: Nullable<string>;
    ethAddress?: Nullable<string>;
    id: string;
    updatedAt: string;
}

type Nullable<T> = T | null;
