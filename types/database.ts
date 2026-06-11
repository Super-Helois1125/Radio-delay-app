/**
 * Supabase database types.
 *
 * These mirror the SQL in `supabase/schema.sql`. If you change the schema,
 * regenerate with:
 *   npx supabase gen types typescript --project-id <id> > types/database.ts
 */

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
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_streams: {
        Row: {
          id: string;
          user_id: string;
          team_id: string | null;
          station_id: string | null;
          station_name: string;
          stream_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          team_id?: string | null;
          station_id?: string | null;
          station_name: string;
          stream_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          team_id?: string | null;
          station_id?: string | null;
          station_name?: string;
          stream_url?: string;
          created_at?: string;
        };
      };
      user_preferences: {
        Row: {
          user_id: string;
          default_delay_seconds: number;
          default_volume: number;
          last_station_id: string | null;
          theme: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          default_delay_seconds?: number;
          default_volume?: number;
          last_station_id?: string | null;
          theme?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          default_delay_seconds?: number;
          default_volume?: number;
          last_station_id?: string | null;
          theme?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type SavedStreamRow =
  Database["public"]["Tables"]["saved_streams"]["Row"];
export type UserPreferencesRow =
  Database["public"]["Tables"]["user_preferences"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
