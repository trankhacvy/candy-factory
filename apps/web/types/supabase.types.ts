export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      audience_groups: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      audiences: {
        Row: {
          created_at: string
          group_id: string | null
          id: string
          wallet: string | null
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: string
          wallet?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: string
          wallet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audiences_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "audience_groups"
            referencedColumns: ["id"]
          }
        ]
      }
      campaign_txs: {
        Row: {
          campaign_id: string | null
          created_at: string
          group_id: string | null
          id: string
          nft_address: string | null
          signature: string | null
          status: string | null
          wallet: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          group_id?: string | null
          id: string
          nft_address?: string | null
          signature?: string | null
          status?: string | null
          wallet?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          group_id?: string | null
          id?: string
          nft_address?: string | null
          signature?: string | null
          status?: string | null
          wallet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_txs_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_txs_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "audience_groups"
            referencedColumns: ["id"]
          }
        ]
      }
      campaigns: {
        Row: {
          audience_group_id: string | null
          created_at: string
          id: string
          name: string | null
          nft_id: string | null
        }
        Insert: {
          audience_group_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
          nft_id?: string | null
        }
        Update: {
          audience_group_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
          nft_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_audience_group_id_fkey"
            columns: ["audience_group_id"]
            referencedRelation: "audience_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_nft_id_fkey"
            columns: ["nft_id"]
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          }
        ]
      }
      nfts: {
        Row: {
          attributes: Json | null
          collection_description: string | null
          collection_image: string | null
          collection_metadata_uri: string | null
          collection_name: string | null
          collection_symbol: string | null
          created_at: string
          creator: string | null
          description: string | null
          id: string
          image: string | null
          metadata_uri: string | null
          name: string | null
          properties: Json | null
          symbol: string | null
        }
        Insert: {
          attributes?: Json | null
          collection_description?: string | null
          collection_image?: string | null
          collection_metadata_uri?: string | null
          collection_name?: string | null
          collection_symbol?: string | null
          created_at?: string
          creator?: string | null
          description?: string | null
          id?: string
          image?: string | null
          metadata_uri?: string | null
          name?: string | null
          properties?: Json | null
          symbol?: string | null
        }
        Update: {
          attributes?: Json | null
          collection_description?: string | null
          collection_image?: string | null
          collection_metadata_uri?: string | null
          collection_name?: string | null
          collection_symbol?: string | null
          created_at?: string
          creator?: string | null
          description?: string | null
          id?: string
          image?: string | null
          metadata_uri?: string | null
          name?: string | null
          properties?: Json | null
          symbol?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
