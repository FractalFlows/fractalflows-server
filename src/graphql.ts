
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

export enum KnowledgeBitLocation {
    ACADEMIA_EDU = "ACADEMIA_EDU",
    ARXIV = "ARXIV",
    BIT_TORRENT = "BIT_TORRENT",
    BLOG = "BLOG",
    BOX = "BOX",
    DAT = "DAT",
    DATABASE = "DATABASE",
    DROPBOX = "DROPBOX",
    EMAIL = "EMAIL",
    ETHEREUM_SWARM = "ETHEREUM_SWARM",
    FIGSHARE = "FIGSHARE",
    GIT = "GIT",
    GOOGLE_DRIVE = "GOOGLE_DRIVE",
    HAL_ARCHIVES = "HAL_ARCHIVES",
    IPFS = "IPFS",
    JUPYTER = "JUPYTER",
    KAGGLE = "KAGGLE",
    ONEDRIVE = "ONEDRIVE",
    OPENAIRE = "OPENAIRE",
    OTHER = "OTHER",
    PDF = "PDF",
    PUBPEER = "PUBPEER",
    RE3DATA = "RE3DATA",
    RESEARCH_GATE = "RESEARCH_GATE",
    RESEARCH_ID = "RESEARCH_ID",
    SCIENTIFIC_PUBLISHER = "SCIENTIFIC_PUBLISHER",
    SLIDESHARE = "SLIDESHARE",
    STACK_OVERFLOW = "STACK_OVERFLOW",
    WEBSITE = "WEBSITE",
    WIKIPEDIA = "WIKIPEDIA",
    YOUTUBE = "YOUTUBE",
    ZENODO = "ZENODO"
}

export enum KnowledgeBitType {
    DATA_SET = "DATA_SET",
    DESCRIPTION_OF_METHODOLOGIES = "DESCRIPTION_OF_METHODOLOGIES",
    DETAILED_ANALYSIS = "DETAILED_ANALYSIS",
    DETAILED_MATHEMATICAL_FORMULATION = "DETAILED_MATHEMATICAL_FORMULATION",
    EXPERIMENTAL_RESULTS = "EXPERIMENTAL_RESULTS",
    OTHER = "OTHER",
    PUBLICATION_OR_ARTICLE_OR_REPORT = "PUBLICATION_OR_ARTICLE_OR_REPORT",
    REPRODUCTION_OF_RESULTS = "REPRODUCTION_OF_RESULTS",
    REVIEWS = "REVIEWS",
    SCRIPTS = "SCRIPTS",
    SIMULATION_RESULTS = "SIMULATION_RESULTS",
    SOURCE_CODE = "SOURCE_CODE",
    STATEMENT_OF_ASSUMPTIONS = "STATEMENT_OF_ASSUMPTIONS",
    STATEMENT_OF_HYPOTHESIS = "STATEMENT_OF_HYPOTHESIS"
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

export interface CreateKnowledgeBitInput {
    attributions?: Nullable<SaveAttributionInput[]>;
    customLocation?: Nullable<string>;
    customType?: Nullable<string>;
    location: KnowledgeBitLocation;
    name: string;
    summary?: Nullable<string>;
    type: KnowledgeBitType;
    url: string;
}

export interface InviteFriendsInput {
    emails: string[];
    message?: Nullable<string>;
    slug: string;
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

export interface UpdateKnowledgeBitInput {
    attributions?: Nullable<SaveAttributionInput[]>;
    customLocation?: Nullable<string>;
    customType?: Nullable<string>;
    id: number;
    location?: Nullable<KnowledgeBitLocation>;
    name?: Nullable<string>;
    summary?: Nullable<string>;
    type?: Nullable<KnowledgeBitType>;
    url?: Nullable<string>;
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
    claims: Claim[];
    createdAt: string;
    id: string;
    identifier: string;
    knowledgeBits: KnowledgeBit[];
    origin: string;
    updatedAt: string;
}

export interface Claim {
    attributions?: Nullable<Attribution[]>;
    createdAt: string;
    id: string;
    knowledgeBits?: Nullable<KnowledgeBit[]>;
    slug: string;
    sources?: Nullable<Source[]>;
    summary: string;
    tags?: Nullable<Tag[]>;
    title: string;
    updatedAt: string;
    user: User;
}

export interface KnowledgeBit {
    attributions?: Nullable<Attribution[]>;
    claim: Claim;
    createdAt: string;
    customLocation?: Nullable<string>;
    customType?: Nullable<string>;
    id: string;
    location: KnowledgeBitLocation;
    name: string;
    summary?: Nullable<string>;
    type: KnowledgeBitType;
    updatedAt: string;
    url: string;
    user: User;
}

export interface IMutation {
    connectEthereumWallet(address: string): User | Promise<User>;
    createAPIKey(): APIKey | Promise<APIKey>;
    createClaim(createClaimInput: CreateClaimInput): Claim | Promise<Claim>;
    createKnowledgeBit(claimSlug: string, createKnowledgeBitInput: CreateKnowledgeBitInput): KnowledgeBit | Promise<KnowledgeBit>;
    deleteClaim(id: string): boolean | Promise<boolean>;
    inviteFriends(inviteFriendsInput: InviteFriendsInput): boolean | Promise<boolean>;
    removeAPIKey(): boolean | Promise<boolean>;
    removeAttribution(id: number): Attribution | Promise<Attribution>;
    removeKnowledgeBit(id: number): KnowledgeBit | Promise<KnowledgeBit>;
    removeSource(id: number): Source | Promise<Source>;
    sendMagicLink(email: string): boolean | Promise<boolean>;
    signInWithEthereum(signInWithEthereumInput: SignInWithEthereumInput): User | Promise<User>;
    signOut(): boolean | Promise<boolean>;
    updateClaim(updateClaimInput: UpdateClaimInput): Claim | Promise<Claim>;
    updateEmail(email: string): User | Promise<User>;
    updateKnowledgeBit(updateKnowledgeBitInput: UpdateKnowledgeBitInput): KnowledgeBit | Promise<KnowledgeBit>;
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
    knowledgeBit(id: number): KnowledgeBit | Promise<KnowledgeBit>;
    nonce(): string | Promise<string>;
    profile(username: string): Nullable<Profile> | Promise<Nullable<Profile>>;
    relatedClaims(slug: string): Claim[] | Promise<Claim[]>;
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
