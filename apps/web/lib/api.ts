import { Audience, AudienceGroup, CreateDropDto, Drop, DropTransaction, NFT } from "@/types/schema"
import qs from "query-string"
import fetcher from "./fetcher"
import { BaseListResponse, BaseListResponseV2, BaseResponse, PageOptionRequest, PaginationRequest } from "@/types"
import { BACKEND_API_URL } from "@/config/env"

const BASE_URL = BACKEND_API_URL

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

  // nfts

  public getNFTs(request: PaginationRequest = { page: 1, limit: 10 }) {
    return fetcher<BaseResponse<BaseListResponse<NFT>>>(`${BASE_URL}/nfts?${qs.stringify(request)}`, {
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

  public getContactGroup(request: PaginationRequest = { page: 1, limit: 10 }) {
    return fetcher<BaseResponse<BaseListResponse<AudienceGroup>>>(
      `${BASE_URL}/audience-groups?${qs.stringify(request)}`,
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
}

export default new Api()
