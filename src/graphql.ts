/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum ArgumentSides {
  CON = 'CON',
  PRO = 'PRO',
}

export enum AvatarSource {
  ENS = 'ENS',
  GRAVATAR = 'GRAVATAR',
}

export enum ClaimOrigins {
  FRACTALFLOWS = 'FRACTALFLOWS',
  TWITTER = 'TWITTER',
}

export enum KnowledgeBitLocations {
  ACADEMIA_EDU = 'ACADEMIA_EDU',
  ARXIV = 'ARXIV',
  BIT_TORRENT = 'BIT_TORRENT',
  BLOG = 'BLOG',
  BOX = 'BOX',
  DAT = 'DAT',
  DATABASE = 'DATABASE',
  DROPBOX = 'DROPBOX',
  EMAIL = 'EMAIL',
  ETHEREUM_SWARM = 'ETHEREUM_SWARM',
  FIGSHARE = 'FIGSHARE',
  GIT = 'GIT',
  GOOGLE_DRIVE = 'GOOGLE_DRIVE',
  HAL_ARCHIVES = 'HAL_ARCHIVES',
  IPFS = 'IPFS',
  JUPYTER = 'JUPYTER',
  KAGGLE = 'KAGGLE',
  ONEDRIVE = 'ONEDRIVE',
  OPENAIRE = 'OPENAIRE',
  OTHER = 'OTHER',
  PDF = 'PDF',
  PUBPEER = 'PUBPEER',
  RE3DATA = 'RE3DATA',
  RESEARCH_GATE = 'RESEARCH_GATE',
  RESEARCH_ID = 'RESEARCH_ID',
  SCIENTIFIC_PUBLISHER = 'SCIENTIFIC_PUBLISHER',
  SLIDESHARE = 'SLIDESHARE',
  STACK_OVERFLOW = 'STACK_OVERFLOW',
  WEBSITE = 'WEBSITE',
  WIKIPEDIA = 'WIKIPEDIA',
  YOUTUBE = 'YOUTUBE',
  ZENODO = 'ZENODO',
}

export enum KnowledgeBitSides {
  REFUTING = 'REFUTING',
  SUPPORTING = 'SUPPORTING',
}

export enum KnowledgeBitTypes {
  DATA_SET = 'DATA_SET',
  DESCRIPTION_OF_METHODOLOGIES = 'DESCRIPTION_OF_METHODOLOGIES',
  DETAILED_ANALYSIS = 'DETAILED_ANALYSIS',
  DETAILED_MATHEMATICAL_FORMULATION = 'DETAILED_MATHEMATICAL_FORMULATION',
  EXPERIMENTAL_RESULTS = 'EXPERIMENTAL_RESULTS',
  OTHER = 'OTHER',
  PUBLICATION_OR_ARTICLE_OR_REPORT = 'PUBLICATION_OR_ARTICLE_OR_REPORT',
  REPRODUCTION_OF_RESULTS = 'REPRODUCTION_OF_RESULTS',
  REVIEWS = 'REVIEWS',
  SCRIPTS = 'SCRIPTS',
  SIMULATION_RESULTS = 'SIMULATION_RESULTS',
  SOURCE_CODE = 'SOURCE_CODE',
  STATEMENT_OF_ASSUMPTIONS = 'STATEMENT_OF_ASSUMPTIONS',
  STATEMENT_OF_HYPOTHESIS = 'STATEMENT_OF_HYPOTHESIS',
}

export enum KnowledgeBitVoteTypes {
  DOWNVOTE = 'DOWNVOTE',
  UPVOTE = 'UPVOTE',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  NORMAL = 'NORMAL',
  VALIDATOR = 'VALIDATOR',
}

export enum UsernameSource {
  CUSTOM = 'CUSTOM',
  ENS = 'ENS',
}

export interface ClaimInput {
  id: string;
}

export interface CreateArgumentCommentInput {
  argument: IDInput;
  content: string;
}

export interface CreateArgumentInput {
  evidences?: Nullable<IDInput[]>;
  side: ArgumentSides;
  summary: string;
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
  location: KnowledgeBitLocations;
  name: string;
  side: KnowledgeBitSides;
  summary?: Nullable<string>;
  type: KnowledgeBitTypes;
  url: string;
}

export interface IDInput {
  id: string;
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

export interface SaveOpinionInput {
  acceptance: number;
  arguments: IDInput[];
  claim: ClaimInput;
  id?: Nullable<string>;
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

export interface UpdateArgumentCommentInput {
  argument: IDInput;
  content: string;
  id: string;
}

export interface UpdateArgumentInput {
  evidences?: Nullable<IDInput[]>;
  id: number;
  side?: Nullable<ArgumentSides>;
  summary?: Nullable<string>;
}

export interface UpdateClaimInput {
  attributions?: Nullable<SaveAttributionInput[]>;
  id: string;
  sources?: Nullable<SaveSourceInput[]>;
  summary?: Nullable<string>;
  tags?: Nullable<SaveTagInput[]>;
  title?: Nullable<string>;
}

export interface UpdateKnowledgeBitInput {
  attributions?: Nullable<SaveAttributionInput[]>;
  customLocation?: Nullable<string>;
  customType?: Nullable<string>;
  id: string;
  location: KnowledgeBitLocations;
  name: string;
  side: KnowledgeBitSides;
  summary?: Nullable<string>;
  type: KnowledgeBitTypes;
  url: string;
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

export interface Argument {
  claim: Claim;
  comments?: Nullable<ArgumentComment[]>;
  createdAt: string;
  evidences?: Nullable<KnowledgeBit[]>;
  id: string;
  opinions?: Nullable<Opinion[]>;
  side: ArgumentSides;
  summary: string;
  updatedAt: string;
  user: User;
}

export interface ArgumentComment {
  argument: Argument;
  content: string;
  createdAt: string;
  id: string;
  updatedAt: string;
  user: User;
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
  arguments?: Nullable<Argument[]>;
  attributions?: Nullable<Attribution[]>;
  createdAt: string;
  disabled: boolean;
  followers?: Nullable<User[]>;
  id: string;
  knowledgeBits?: Nullable<KnowledgeBit[]>;
  opinions?: Nullable<Opinion[]>;
  origin: ClaimOrigins;
  ownershipRequestedAt?: Nullable<string>;
  relevance?: Nullable<number>;
  slug: string;
  sources?: Nullable<Source[]>;
  summary: string;
  tags?: Nullable<Tag[]>;
  title: string;
  tweetId?: Nullable<string>;
  tweetOwner?: Nullable<string>;
  updatedAt: string;
  user: User;
}

export interface KnowledgeBit {
  attributions?: Nullable<Attribution[]>;
  claim: Claim;
  createdAt: string;
  customLocation?: Nullable<string>;
  customType?: Nullable<string>;
  downvotesCount?: Nullable<number>;
  id: string;
  location: KnowledgeBitLocations;
  name: string;
  side: KnowledgeBitSides;
  summary?: Nullable<string>;
  type: KnowledgeBitTypes;
  updatedAt: string;
  upvotesCount?: Nullable<number>;
  url: string;
  user: User;
  votes?: Nullable<KnowledgeBitVote[]>;
}

export interface KnowledgeBitVote {
  createdAt: string;
  id: string;
  knowledgeBit: KnowledgeBit;
  type: KnowledgeBitVoteTypes;
  updatedAt: string;
  user: User;
}

export interface IMutation {
  addFollowerToClaim(id: string): boolean | Promise<boolean>;
  connectEthereumWallet(address: string): User | Promise<User>;
  createAPIKey(): APIKey | Promise<APIKey>;
  createArgument(
    claimSlug: string,
    createArgumentInput: CreateArgumentInput,
  ): Argument | Promise<Argument>;
  createArgumentComment(
    createArgumentCommentInput: CreateArgumentCommentInput,
  ): ArgumentComment | Promise<ArgumentComment>;
  createClaim(createClaimInput: CreateClaimInput): Claim | Promise<Claim>;
  createKnowledgeBit(
    claimSlug: string,
    createKnowledgeBitInput: CreateKnowledgeBitInput,
  ): KnowledgeBit | Promise<KnowledgeBit>;
  deleteArgumentComment(id: string): boolean | Promise<boolean>;
  deleteClaim(id: string): boolean | Promise<boolean>;
  deleteKnowledgeBit(id: string): boolean | Promise<boolean>;
  disableClaim(id: string): boolean | Promise<boolean>;
  inviteFriends(
    inviteFriendsInput: InviteFriendsInput,
  ): boolean | Promise<boolean>;
  reenableClaim(id: string): boolean | Promise<boolean>;
  removeAPIKey(): boolean | Promise<boolean>;
  removeArgument(id: number): Argument | Promise<Argument>;
  removeAttribution(id: number): Attribution | Promise<Attribution>;
  removeFollowerFromClaim(id: string): boolean | Promise<boolean>;
  removeOpinion(id: number): Opinion | Promise<Opinion>;
  removeSource(id: number): Source | Promise<Source>;
  requestClaimOwnership(id: string): boolean | Promise<boolean>;
  requestTwitterOAuthUrl(callbackUrl: string): string | Promise<string>;
  saveKnowledgeBitVote(
    knowledgeBitId: string,
    type: KnowledgeBitVoteTypes,
  ): boolean | Promise<boolean>;
  saveOpinion(saveOpinionInput: SaveOpinionInput): Opinion | Promise<Opinion>;
  sendMagicLink(email: string): boolean | Promise<boolean>;
  signInWithEthereum(
    signInWithEthereumInput: SignInWithEthereumInput,
  ): User | Promise<User>;
  signOut(): boolean | Promise<boolean>;
  updateArgument(
    updateArgumentInput: UpdateArgumentInput,
  ): Argument | Promise<Argument>;
  updateArgumentComment(
    updateArgumentCommentInput: UpdateArgumentCommentInput,
  ): ArgumentComment | Promise<ArgumentComment>;
  updateClaim(updateClaimInput: UpdateClaimInput): Claim | Promise<Claim>;
  updateEmail(email: string): User | Promise<User>;
  updateKnowledgeBit(
    updateKnowledgeBitInput: UpdateKnowledgeBitInput,
  ): KnowledgeBit | Promise<KnowledgeBit>;
  updateProfile(updateProfileInput: UpdateProfileInput): User | Promise<User>;
  validateTwitterOAuth(
    oauthToken: string,
    oauthVerifier: string,
  ): string | Promise<string>;
  verifyMagicLink(hash: string): User | Promise<User>;
}

export interface Opinion {
  acceptance: number;
  arguments?: Nullable<Argument[]>;
  claim: Claim;
  createdAt: string;
  id: string;
  updatedAt: string;
  user: User;
}

export interface PaginatedClaims {
  data?: Nullable<Claim[]>;
  totalCount: number;
}

export interface Profile {
  avatar?: Nullable<string>;
  ethAddress?: Nullable<string>;
  username: string;
}

export interface IQuery {
  apiKey(): Nullable<string> | Promise<Nullable<string>>;
  argument(id: string): Argument | Promise<Argument>;
  arguments(claimSlug: string): Argument[] | Promise<Argument[]>;
  attribution(id: number): Attribution | Promise<Attribution>;
  attributions(): Attribution[] | Promise<Attribution[]>;
  claim(slug: string): Claim | Promise<Claim>;
  claims(
    limit: number,
    offset: number,
  ): PaginatedClaims | Promise<PaginatedClaims>;
  disabledClaims(
    limit: number,
    offset: number,
  ): PaginatedClaims | Promise<PaginatedClaims>;
  knowledgeBit(id: string): KnowledgeBit | Promise<KnowledgeBit>;
  knowledgeBits(claimSlug: string): KnowledgeBit[] | Promise<KnowledgeBit[]>;
  nonce(): string | Promise<string>;
  opinion(id: string): Opinion | Promise<Opinion>;
  profile(username: string): Nullable<Profile> | Promise<Nullable<Profile>>;
  relatedClaims(slug: string): Claim[] | Promise<Claim[]>;
  searchClaims(
    limit: number,
    offset: number,
    term: string,
  ): Nullable<PaginatedClaims> | Promise<Nullable<PaginatedClaims>>;
  searchTags(term?: Nullable<string>): Tag[] | Promise<Tag[]>;
  session(): Session | Promise<Session>;
  source(id: number): Source | Promise<Source>;
  sources(): Source[] | Promise<Source[]>;
  tag(id: number): Tag | Promise<Tag>;
  trendingClaims(
    limit: number,
    offset: number,
  ): PaginatedClaims | Promise<PaginatedClaims>;
  userClaims(username: string): Claim[] | Promise<Claim[]>;
  userContributedClaims(username: string): Claim[] | Promise<Claim[]>;
  userFollowingClaims(username: string): Claim[] | Promise<Claim[]>;
  userKnowledgeBitVotes(
    claimSlug: string,
  ): Nullable<KnowledgeBitVote[]> | Promise<Nullable<KnowledgeBitVote[]>>;
  userOpinion(
    claimSlug: string,
  ): Nullable<Opinion> | Promise<Nullable<Opinion>>;
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
  arguments?: Nullable<Argument[]>;
  avatar?: Nullable<string>;
  avatarSource?: Nullable<AvatarSource>;
  claims?: Nullable<Claim[]>;
  createdAt: string;
  email?: Nullable<string>;
  ethAddress?: Nullable<string>;
  id: string;
  knowledgeBitVotes?: Nullable<KnowledgeBitVote[]>;
  knowledgeBits?: Nullable<KnowledgeBit[]>;
  opinions?: Nullable<Opinion[]>;
  role: UserRole;
  twitter?: Nullable<string>;
  updatedAt: string;
  username: string;
  usernameSource?: Nullable<UsernameSource>;
}

type Nullable<T> = T | null;
