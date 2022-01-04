
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum AvatarSource {
    ENS = "ENS",
    GRAVATAR = "GRAVATAR"
}

export enum UserClaimRelation {
    CONTRIBUTED = "CONTRIBUTED",
    FOLLOWING = "FOLLOWING",
    OWN = "OWN"
}

export enum UsernameSource {
    CUSTOM = "CUSTOM",
    ENS = "ENS"
}

export interface CreateClaimInput {
    attributions?: Nullable<SaveAttributionInput[]>;
    sources?: Nullable<SaveSourceInput[]>;
    summary: string;
    tags?: Nullable<SaveTagInput[]>;
    title: string;
}

export interface SaveAttributionInput {
    id?: Nullable<string>;
    identifier: string;
    origin: string;
}

export interface SaveSourceInput {
    id?: Nullable<string>;
    origin: string;
    url: string;
}

export interface SaveTagInput {
    id?: Nullable<string>;
    label: string;
}

export interface SignInWithEthereumInput {
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
    attributions?: Nullable<SaveAttributionInput[]>;
    id: string;
    sources?: Nullable<SaveSourceInput[]>;
    summary: string;
    tags?: Nullable<SaveTagInput[]>;
    title: string;
}

export interface UpdateProfileInput {
    avatar?: Nullable<string>;
    avatarSource: AvatarSource;
    username: string;
    usernameSource: UsernameSource;
}

export interface APIKey {
    key: string;
    secret?: Nullable<string>;
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
    connectEthereumWallet(address: string): User | Promise<User>;
    createAPIKey(): APIKey | Promise<APIKey>;
    createClaim(createClaimInput: CreateClaimInput): Claim | Promise<Claim>;
    removeAPIKey(): boolean | Promise<boolean>;
    removeAttribution(id: number): Attribution | Promise<Attribution>;
    removeClaim(id: number): Claim | Promise<Claim>;
    removeSource(id: number): Source | Promise<Source>;
    sendMagicLink(email: string): boolean | Promise<boolean>;
    signInWithEthereum(signInWithEthereumInput: SignInWithEthereumInput): User | Promise<User>;
    signOut(): boolean | Promise<boolean>;
    updateClaim(updateClaimInput: UpdateClaimInput): Claim | Promise<Claim>;
    updateEmail(email: string): User | Promise<User>;
    updateProfile(updateProfileInput: UpdateProfileInput): User | Promise<User>;
    verifyMagicLink(hash: string): User | Promise<User>;
}

export interface Profile {
    avatar?: Nullable<string>;
    ethAddress?: Nullable<string>;
    username: string;
}

export interface IQuery {
    apiKey(): Nullable<string> | Promise<Nullable<string>>;
    attribution(id: number): Attribution | Promise<Attribution>;
    attributions(): Attribution[] | Promise<Attribution[]>;
    claim(slug: string): Claim | Promise<Claim>;
    claims(limit: number, offset: number): Claim[] | Promise<Claim[]>;
    nonce(): string | Promise<string>;
    profile(username: string): Nullable<Profile> | Promise<Nullable<Profile>>;
    searchTags(term?: Nullable<string>): Tag[] | Promise<Tag[]>;
    session(): Session | Promise<Session>;
    source(id: number): Source | Promise<Source>;
    sources(): Source[] | Promise<Source[]>;
    tag(id: number): Tag | Promise<Tag>;
    trendingClaims(limit: number, offset: number): Claim[] | Promise<Claim[]>;
    userClaims(relation: UserClaimRelation, username: string): Claim[] | Promise<Claim[]>;
}

export interface Session {
    siweMessage?: Nullable<SiweMessage>;
    user: User;
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
    apiKey?: Nullable<string>;
    apiSecret?: Nullable<string>;
    avatar?: Nullable<string>;
    avatarSource?: Nullable<AvatarSource>;
    claims?: Nullable<Claim[]>;
    createdAt: string;
    email?: Nullable<string>;
    ethAddress?: Nullable<string>;
    id: string;
    updatedAt: string;
    username?: Nullable<string>;
    usernameSource?: Nullable<UsernameSource>;
}

type Nullable<T> = T | null;
