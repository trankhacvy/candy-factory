/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateUserDto {
  /** @example "63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs" */
  wallet: string | null
}

export interface Audience {
  id: number
  wallet: string
  group: AudienceGroup
  groupId: number
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  /** @format date-time */
  deletedAt: string
}

export interface User {
  id: number
  wallet: string | null
  firstName: string | null
  lastName: string | null
  status: 1 | 2
  nfts?: NFT[]
  groups?: AudienceGroup[]
  drops?: Drop[]
  init: boolean
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  /** @format date-time */
  deletedAt: string
}

export interface AudienceGroup {
  id: number
  name: string
  numOfAudience: number
  isFavorite: boolean
  members: Audience[]
  drops?: Drop[]
  user: User
  userId: number
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  /** @format date-time */
  deletedAt: string
}

export interface DropTransaction {
  id: number
  nftAddress?: string
  signature?: string
  wallet: string
  status: 1 | 2 | 3
  drop: Drop
  dropId: number
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  /** @format date-time */
  deletedAt: string
}

export interface Transaction {
  id: number
  signature: string
  amount: number
  sender: string
  status: 1 | 2 | 3 | 4
  user: User
  drops?: Drop[]
  userId: number
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  /** @format date-time */
  deletedAt: string
}

export interface Drop {
  id: number
  name: string
  status: 1 | 2
  nft: NFT
  nftId: number
  group?: AudienceGroup
  groupId?: number
  transactions: DropTransaction[]
  user: User
  userId: number
  numOfNft: number
  mintedNft: number
  walletsSource: 1 | 2
  collection?: string
  transaction: Transaction
  transactionId: number
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  /** @format date-time */
  deletedAt: string
}

export interface NFT {
  id: number
  /** @maxLength 32 */
  name: string
  /** @maxLength 200 */
  description: string
  /** @maxLength 10 */
  symbol: string
  image: string
  metadataUri: string
  externalUrl?: string
  isCollection: boolean
  attributes?: string[]
  creators?: string[]
  drops?: Drop[]
  user: User
  userId: number
  collectionId?: number
  collection?: NFT
  collectionAddress?: string
  collectionKeys?: object
  royalty: number
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  /** @format date-time */
  deletedAt: string
}

export interface CreateAudienceDto {
  wallet: string
  groupId: number
}

export interface UpdateAudienceDto {
  /** @example "0x00" */
  wallet?: string
}

export interface CreateAudienceWithoutGroupDto {
  wallet: string
}

export interface CreateAudienceGroupDto {
  name: string
  isFavorite?: boolean
  audiences: CreateAudienceWithoutGroupDto[]
}

export interface CreateAudienceGroupWithCsvDto {
  /** @example "Vip members" */
  name: string
  /** @example "true" */
  isFavorite?: boolean
  /** @format binary */
  file: File
}

export interface CreateAudienceGroupWithCollectionDto {
  name: string
  isFavorite?: boolean
  collection: string
}

export interface UpdateAudienceGroupDto {
  /** @example "Vip members" */
  name?: string
  /** @example true */
  isFavorite?: boolean
}

export interface AttributeDto {
  traitType: string
  value: string
}

export interface CreatorDto {
  address: string
  share: number
}

export interface CreateNFTDto {
  /**
   * @maxLength 32
   * @example "My awesome NFT"
   */
  name: string
  /**
   * @maxLength 200
   * @example "CNFT is awesome"
   */
  description: string
  /**
   * @maxLength 10
   * @example "CNFT"
   */
  symbol: string
  /**
   * Image that you would want to turn into nft
   * @format binary
   */
  image: File
  /** @example "http://google.com" */
  externalUrl?: string
  /**
   * @maxLength 32
   * @example "My awesome collection"
   */
  collectionName?: string
  /**
   * @maxLength 200
   * @example "My Collection"
   */
  collectionDescription?: string
  /**
   * @maxLength 10
   * @example "CNFT"
   */
  collectionSymbol?: string
  /**
   * Image that you would want to turn into collection
   * @format binary
   */
  collectionImage?: File | null
  /** @example "http://google.com" */
  collectionExternalUrl?: string | null
  attributes: AttributeDto[]
  creators: CreatorDto[]
  collectionId?: number
  royalty?: number
}

export interface UpdateNFTDto {
  /**
   * @maxLength 32
   * @example "My awesome NFT"
   */
  name?: string
  /**
   * @maxLength 200
   * @example "CNFT is awesome"
   */
  description?: string
  /**
   * @maxLength 10
   * @example "CNFT"
   */
  symbol?: string
  /** @example "" */
  image?: string
  /** @example "My awesome NFT" */
  metadataUri?: string
  /** @example "0x00" */
  creator?: string
  /**
   * @maxLength 32
   * @example "My awesome collection"
   */
  collectionName?: string
  /**
   * @maxLength 200
   * @example "My Collection"
   */
  collectionDescription?: string
  /**
   * @maxLength 10
   * @example "CNFT"
   */
  collectionSymbol?: string
  /** @example "" */
  collectionImage?: string
  /** @example "" */
  collectionMetadataUri?: string
  attributes?: string[]
}

export interface CreateDropDto {
  /** @example "New Action" */
  name: string
  /** @example 1 */
  nftId: number
  /** @example 1 */
  transactionId: number
  /** @example 1 */
  groupId?: number
  collection?: string
}

export interface EstimatePriceDto {
  groupId?: number
  collection?: string
}

export interface EstimatePriceResponseDto {
  totalWallets: number
  price: number
}

export interface UpdateDropDto {
  /** @example "My awesome drop" */
  name?: string
}

export interface CreateTransactionDto {
  signature: string
  amount: number
  sender: string
  status?: 1 | 2 | 3 | 4
}

export interface UpdateTransactionDto {
  status?: 1 | 2 | 3 | 4
}

export interface AuthEmailLoginDto {
  /** @example "63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs" */
  wallet: string
}
