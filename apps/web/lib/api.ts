import { AudienceGroup, Campaign, CampaignTransaction, CreateCampaignDto, NFT } from "@/types/schema"
import qs from "query-string"
import fetcher from "./fetcher"
import { BaseListResponse, BaseResponse, PaginationRequest } from "@/types"

const BASE_URL = "http://localhost:8080/api/v1"

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

  // drops
  public getDrops(request: PaginationRequest = { page: 1, limit: 10 }) {
    return fetcher<BaseResponse<BaseListResponse<Campaign>>>(`${BASE_URL}/campaigns?${qs.stringify(request)}`, {
      headers: this.headers,
    })
  }

  public getDropTransactions(dropId: string) {
    return fetcher<BaseResponse<CampaignTransaction[]>>(`${BASE_URL}/campaigns/${dropId}/transactions`, {
      headers: this.headers,
    })
  }

  public createDrop(requestBody: CreateCampaignDto) {
    return fetcher<BaseResponse<Campaign>>(`${BASE_URL}/campaigns`, {
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
}

export default new Api()
