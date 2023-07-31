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
          stock_id: number | null;
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
          stock_id?: number | null;
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
          stock_id?: number | null;
          timestamp?: number | null;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'company_events_stock_id_fkey';
            columns: ['stock_id'];
            referencedRelation: 'stocks';
            referencedColumns: ['id'];
          },
        ];
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
          id?: number;
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
          id?: number;
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
      dividends_fund: {
        Row: {
          amount: number | null;
          created_at: string | null;
          ex_date_iso: string | null;
          ex_date_unix: number | null;
          fund_id: number | null;
          id: number;
          isin: string | null;
          payment_date_iso: string | null;
          payment_date_unix: number | null;
          record_date_iso: string | null;
          record_date_unix: number | null;
          updated_at: string | null;
        };
        Insert: {
          amount?: number | null;
          created_at?: string | null;
          ex_date_iso?: string | null;
          ex_date_unix?: number | null;
          fund_id?: number | null;
          id?: number;
          isin?: string | null;
          payment_date_iso?: string | null;
          payment_date_unix?: number | null;
          record_date_iso?: string | null;
          record_date_unix?: number | null;
          updated_at?: string | null;
        };
        Update: {
          amount?: number | null;
          created_at?: string | null;
          ex_date_iso?: string | null;
          ex_date_unix?: number | null;
          fund_id?: number | null;
          id?: number;
          isin?: string | null;
          payment_date_iso?: string | null;
          payment_date_unix?: number | null;
          record_date_iso?: string | null;
          record_date_unix?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'dividends_fund_fund_id_fkey';
            columns: ['fund_id'];
            referencedRelation: 'funds';
            referencedColumns: ['id'];
          },
        ];
      };
      dividends_stock: {
        Row: {
          amount: number | null;
          created_at: string | null;
          ex_date_iso: string | null;
          ex_date_unix: number | null;
          id: number;
          info: string | null;
          isin: string | null;
          payment_date_iso: string | null;
          payment_date_unix: number | null;
          stock_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          amount?: number | null;
          created_at?: string | null;
          ex_date_iso?: string | null;
          ex_date_unix?: number | null;
          id?: number;
          info?: string | null;
          isin?: string | null;
          payment_date_iso?: string | null;
          payment_date_unix?: number | null;
          stock_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          amount?: number | null;
          created_at?: string | null;
          ex_date_iso?: string | null;
          ex_date_unix?: number | null;
          id?: number;
          info?: string | null;
          isin?: string | null;
          payment_date_iso?: string | null;
          payment_date_unix?: number | null;
          stock_id?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'dividends_stock_stock_id_fkey';
            columns: ['stock_id'];
            referencedRelation: 'stocks';
            referencedColumns: ['id'];
          },
        ];
      };
      funds: {
        Row: {
          created_at: string | null;
          description: string | null;
          distribution_frequency: string | null;
          exchange_id: string | null;
          focus: string | null;
          fund_name: string | null;
          id: number;
          image_id: string | null;
          isin: string | null;
          price_snapshot: number | null;
          type_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          distribution_frequency?: string | null;
          exchange_id?: string | null;
          focus?: string | null;
          fund_name?: string | null;
          id?: number;
          image_id?: string | null;
          isin?: string | null;
          price_snapshot?: number | null;
          type_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          distribution_frequency?: string | null;
          exchange_id?: string | null;
          focus?: string | null;
          fund_name?: string | null;
          id?: number;
          image_id?: string | null;
          isin?: string | null;
          price_snapshot?: number | null;
          type_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      funds_sectors: {
        Row: {
          fund_id: number;
          sector_id: number;
        };
        Insert: {
          fund_id: number;
          sector_id: number;
        };
        Update: {
          fund_id?: number;
          sector_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'funds_sectors_fund_id_fkey';
            columns: ['fund_id'];
            referencedRelation: 'funds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'funds_sectors_sector_id_fkey';
            columns: ['sector_id'];
            referencedRelation: 'sectors';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          amount_changed: number | null;
          created_at: string | null;
          id: number;
          instrument_type: string | null;
          isin: string | null;
          name: string | null;
          order_id: string | null;
          price: number | null;
          timestamp: number | null;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          amount_changed?: number | null;
          created_at?: string | null;
          id?: number;
          instrument_type?: string | null;
          isin?: string | null;
          name?: string | null;
          order_id?: string | null;
          price?: number | null;
          timestamp?: number | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          amount_changed?: number | null;
          created_at?: string | null;
          id?: number;
          instrument_type?: string | null;
          isin?: string | null;
          name?: string | null;
          order_id?: string | null;
          price?: number | null;
          timestamp?: number | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      portfolios: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
          updated_at: string;
          user_id: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
          updated_at?: string;
          user_id?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
          updated_at?: string;
          user_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'portfolios_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
          analyst_rating_id: number | null;
          company_info_id: number | null;
          company_name: string | null;
          created_at: string | null;
          distribution_frequency: string | null;
          exchange_id: string | null;
          id: number;
          image_id: string | null;
          intl_symbol: string | null;
          ipo_date: number | null;
          isin: string | null;
          price_snapshot: number | null;
          type_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          analyst_rating_id?: number | null;
          company_info_id?: number | null;
          company_name?: string | null;
          created_at?: string | null;
          distribution_frequency?: string | null;
          exchange_id?: string | null;
          id?: number;
          image_id?: string | null;
          intl_symbol?: string | null;
          ipo_date?: number | null;
          isin?: string | null;
          price_snapshot?: number | null;
          type_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          analyst_rating_id?: number | null;
          company_info_id?: number | null;
          company_name?: string | null;
          created_at?: string | null;
          distribution_frequency?: string | null;
          exchange_id?: string | null;
          id?: number;
          image_id?: string | null;
          intl_symbol?: string | null;
          ipo_date?: number | null;
          isin?: string | null;
          price_snapshot?: number | null;
          type_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'stocks_analyst_rating_id_fkey';
            columns: ['analyst_rating_id'];
            referencedRelation: 'analyst_ratings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'stocks_company_info_id_fkey';
            columns: ['company_info_id'];
            referencedRelation: 'company_infos';
            referencedColumns: ['id'];
          },
        ];
      };
      stocks_sectors: {
        Row: {
          sector_id: number;
          stock_id: number;
        };
        Insert: {
          sector_id: number;
          stock_id: number;
        };
        Update: {
          sector_id?: number;
          stock_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'stocks_sectors_sector_id_fkey';
            columns: ['sector_id'];
            referencedRelation: 'sectors';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'stocks_sectors_stock_id_fkey';
            columns: ['stock_id'];
            referencedRelation: 'stocks';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string | null;
          id: number;
          name: string | null;
          password: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: never;
          name?: string | null;
          password?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: never;
          name?: string | null;
          password?: string | null;
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
