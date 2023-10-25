import {
  Audience,
  AudienceGroup,
  CreateAudienceGroupWithCollectionDto,
  CreateDropDto,
  CreateTransactionDto,
  Drop,
  DropTransaction,
  EstimatePriceDto,
  EstimatePriceResponseDto,
  NFT,
  Transaction,
} from "@/types/schema"
import qs from "query-string"
import fetcher from "./fetcher"
import { BaseListResponse, BaseListResponseV2, BaseResponse, PageOptionRequest, PaginationRequest } from "@/types"
import { BACKEND_API_URL } from "@/config/env"

const BASE_URL = BACKEND_API_URL

export interface StatDto {
  totalDrop: number
  totalAirdropedNft: number
  totalWallets: number
}

class Api {
  headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  withToken(token?: string) {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    }

    return this
  }

  public login(wallet: string) {
    return fetcher(`${BASE_URL}/auth/wallet/login`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({ wallet }),
    })
  }

  public logout() {
    return fetcher(`${BASE_URL}/auth/logout`, {
      headers: this.headers,
      method: "POST",
    })
  }

  public initUser() {
    return fetcher(`${BASE_URL}/auth/init`, {
      headers: this.headers,
      method: "POST",
    })
  }

  // user
  public getCurrentUser() {
    return fetcher<BaseResponse<Drop>>(`${BASE_URL}/auth/me`, {
      headers: this.headers,
    })
  }

  // drops
  public getDrops(request?: PageOptionRequest) {
    return fetcher<BaseResponse<BaseListResponseV2<Drop>>>(`${BASE_URL}/drops?${qs.stringify(request ?? {})}`, {
      headers: this.headers,
    })
  }

  public getDrop(dropId: string) {
    return fetcher<BaseResponse<Drop>>(`${BASE_URL}/drops/${dropId}`, {
      headers: this.headers,
    })
  }

  public getDropTransactions(dropId: string, request?: PageOptionRequest) {
    return fetcher<BaseResponse<BaseListResponseV2<DropTransaction>>>(
      `${BASE_URL}/drops/${dropId}/transactions?${qs.stringify(request ?? {})}`,
      {
        headers: this.headers,
      }
    )
  }

  public createDrop(requestBody: CreateDropDto) {
    return fetcher<BaseResponse<Drop>>(`${BASE_URL}/drops`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(requestBody),
    })
  }

  public estimateDropPrice(requestBody: EstimatePriceDto) {
    return fetcher<BaseResponse<EstimatePriceResponseDto>>(`${BASE_URL}/drops/estimate-price`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(requestBody),
    })
  }

  // nfts

  public getNFTs(request: PageOptionRequest = {}) {
    return fetcher<BaseResponse<BaseListResponseV2<NFT>>>(`${BASE_URL}/nfts?${qs.stringify(request)}`, {
      headers: this.headers,
    })
  }

  public getNFT(nftId: number | string) {
    return fetcher<BaseResponse<NFT>>(`${BASE_URL}/nfts/${nftId}`, {
      headers: this.headers,
    })
  }

  public createNFT(body: FormData) {
    return fetcher<NFT>(`${BASE_URL}/nfts`, {
      headers: {
        // @ts-ignore
        Authorization: this.headers["Authorization"],
      },
      method: "POST",
      body,
    })
  }

  // contacts

  public createGroupWithCsv(body: FormData) {
    return fetcher<BaseResponse<AudienceGroup>>(`${BASE_URL}/audience-groups/csv`, {
      headers: {
        // @ts-ignore
        Authorization: this.headers["Authorization"],
      },
      method: "POST",
      body,
    })
  }

  public createGroupWithCollection(body: CreateAudienceGroupWithCollectionDto) {
    return fetcher<BaseResponse<AudienceGroup>>(`${BASE_URL}/audience-groups/collection`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  public getContactGroup(request?: PaginationRequest) {
    return fetcher<BaseResponse<BaseListResponse<AudienceGroup>>>(
      `${BASE_URL}/audience-groups?${qs.stringify(request ?? {})}`,
      {
        headers: this.headers,
      }
    )
  }

  public getGroup(groupId: string) {
    return fetcher<BaseResponse<AudienceGroup>>(`${BASE_URL}/audience-groups/${groupId}`, {
      headers: this.headers,
    })
  }

  public getWallets(groupId: string, request?: PageOptionRequest) {
    return fetcher<BaseResponse<BaseListResponseV2<Audience>>>(
      `${BASE_URL}/audience-groups/${groupId}/wallets?${qs.stringify(request ?? {})}`,
      {
        headers: this.headers,
      }
    )
  }

  public deleteWalletGroup(id: string | number) {
    return fetcher<BaseResponse<void>>(`${BASE_URL}/audience-groups/${id}`, {
      headers: this.headers,
      method: "DELETE",
    })
  }

  public deleteWallet(id: string | number) {
    return fetcher<BaseResponse<void>>(`${BASE_URL}/audiences/${id}`, {
      headers: this.headers,
      method: "DELETE",
    })
  }

  //transactions
  public createTransaction(body: CreateTransactionDto) {
    return fetcher<BaseResponse<Transaction>>(`${BASE_URL}/transactions`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  public getTransactions(request: PageOptionRequest = {}) {
    return fetcher<BaseResponse<BaseListResponseV2<Transaction>>>(`${BASE_URL}/transactions?${qs.stringify(request)}`, {
      headers: this.headers,
    })
  }

  // stats
  public getStat() {
    return fetcher<BaseResponse<StatDto>>(`${BASE_URL}/stat`, {
      headers: this.headers,
    })
  }
}

export default new Api()
