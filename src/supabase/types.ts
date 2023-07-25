export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];


export interface Database {
  public: {
    Tables: {
      analyst_ratings: {
        Row: {
          created_at: string;
          id: number;
          isin: string | null;
          recommendations_buy: number | null;
          recommendations_hold: number | null;
          recommendations_outperform: number | null;
          recommendations_underperform: number | null;
          target_price_average: number | null;
          target_price_high: number | null;
          target_price_low: number | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          isin?: string | null;
          recommendations_buy?: number | null;
          recommendations_hold?: number | null;
          recommendations_outperform?: number | null;
          recommendations_underperform?: number | null;
          target_price_average?: number | null;
          target_price_high?: number | null;
          target_price_low?: number | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          isin?: string | null;
          recommendations_buy?: number | null;
          recommendations_hold?: number | null;
          recommendations_outperform?: number | null;
          recommendations_underperform?: number | null;
          target_price_average?: number | null;
          target_price_high?: number | null;
          target_price_low?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      portfolios: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      sectors: {
        Row: {
          created_at: string;
          icon: string | null;
          id: number;
          name: string | null;
          sector_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          icon?: string | null;
          id?: number;
          name?: string | null;
          sector_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          icon?: string | null;
          id?: number;
          name?: string | null;
          sector_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
