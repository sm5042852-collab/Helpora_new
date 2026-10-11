create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  preferred_language text not null default 'tr',
  created_at timestamptz not null default now()
);

create table if not exists public.help_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 80),
  description text not null default '' check (char_length(description) <= 1000),
  category text not null default 'Diğer',
  city text not null default '',
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.help_requests enable row level security;
alter table public.community_posts enable row level security;

create policy "Profiles are visible to signed-in members"
  on public.profiles for select to authenticated using (true);
create policy "Members create their own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Members update their own profile"
  on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "Members read open requests and their own requests"
  on public.help_requests for select to authenticated using (status = 'open' or auth.uid() = user_id);
create policy "Members create their own requests"
  on public.help_requests for insert to authenticated with check (auth.uid() = user_id);
create policy "Members update their own requests"
  on public.help_requests for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Members delete their own requests"
  on public.help_requests for delete to authenticated using (auth.uid() = user_id);

create policy "Signed-in members read community posts"
  on public.community_posts for select to authenticated using (true);
create policy "Members create their own posts"
  on public.community_posts for insert to authenticated with check (auth.uid() = user_id);
create policy "Members delete their own posts"
  on public.community_posts for delete to authenticated using (auth.uid() = user_id);

create or replace function public.create_profile_for_new_member()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_member();
