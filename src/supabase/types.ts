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
      company_events: {
        Row: {
          created_at: string;
          description: string | null;
          event_id: string | null;
          id: number;
          isin: string | null;
          timestamp: number | null;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          event_id?: string | null;
          id?: number;
          isin?: string | null;
          timestamp?: number | null;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          event_id?: string | null;
          id?: number;
          isin?: string | null;
          timestamp?: number | null;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      company_infos: {
        Row: {
          beta: number | null;
          ceoname: string | null;
          cfoname: string | null;
          cooname: string | null;
          countrycode: string | null;
          created_at: string;
          description: string | null;
          dividendyieldsnapshot: number | null;
          employeecount: number | null;
          eps: number | null;
          id: number;
          isin: string | null;
          marketcapsnapshot: number | null;
          name: string | null;
          pbratiosnapshot: number | null;
          peratiosnapshot: number | null;
          updated_at: string;
          yearfounded: number | null;
        };
        Insert: {
          beta?: number | null;
          ceoname?: string | null;
          cfoname?: string | null;
          cooname?: string | null;
          countrycode?: string | null;
          created_at?: string;
          description?: string | null;
          dividendyieldsnapshot?: number | null;
          employeecount?: number | null;
          eps?: number | null;
          id?: never;
          isin?: string | null;
          marketcapsnapshot?: number | null;
          name?: string | null;
          pbratiosnapshot?: number | null;
          peratiosnapshot?: number | null;
          updated_at?: string;
          yearfounded?: number | null;
        };
        Update: {
          beta?: number | null;
          ceoname?: string | null;
          cfoname?: string | null;
          cooname?: string | null;
          countrycode?: string | null;
          created_at?: string;
          description?: string | null;
          dividendyieldsnapshot?: number | null;
          employeecount?: number | null;
          eps?: number | null;
          id?: never;
          isin?: string | null;
          marketcapsnapshot?: number | null;
          name?: string | null;
          pbratiosnapshot?: number | null;
          peratiosnapshot?: number | null;
          updated_at?: string;
          yearfounded?: number | null;
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
      stocks: {
        Row: {
          company_info_id: number | null;
          company_name: string | null;
          created_at: string | null;
          exchange_id: string | null;
          id: number;
          image_id: string | null;
          intl_symbol: string | null;
          ipo_date: number | null;
          isin: string | null;
          type_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          company_info_id?: number | null;
          company_name?: string | null;
          created_at?: string | null;
          exchange_id?: string | null;
          id?: never;
          image_id?: string | null;
          intl_symbol?: string | null;
          ipo_date?: number | null;
          isin?: string | null;
          type_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          company_info_id?: number | null;
          company_name?: string | null;
          created_at?: string | null;
          exchange_id?: string | null;
          id?: never;
          image_id?: string | null;
          intl_symbol?: string | null;
          ipo_date?: number | null;
          isin?: string | null;
          type_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'stocks_company_info_id_fkey';
            columns: ['company_info_id'];
            referencedRelation: 'company_infos';
            referencedColumns: ['id'];
          },
        ];
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
