"""Supabase client singleton for database and storage operations."""

from supabase import create_client, Client

from apps.api.config import settings

supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
