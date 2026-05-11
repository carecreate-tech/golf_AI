-- clubs テーブル
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  distance integer not null check (distance > 0),
  loft numeric(4, 1),
  miss_tendency text check (miss_tendency in ('slice', 'hook', 'topped', 'fat', 'none')),
  memo text,
  created_at timestamptz not null default now()
);

-- RLS (Row Level Security) を有効化
alter table public.clubs enable row level security;

-- 匿名ユーザーも含む全ユーザーが読み書きできるポリシー（MVPのため）
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'clubs' and policyname = 'Allow all access'
  ) then
    execute 'create policy "Allow all access" on public.clubs for all using (true) with check (true)';
  end if;
end
$$;

-- サンプルデータ（動作確認用）
insert into public.clubs (name, distance, loft, miss_tendency, memo) values
  ('Driver',  240, 10.5, 'slice',  'ティーショット専用'),
  ('3W',      220, 15.0, null,     '距離出したい時'),
  ('5W',      205, 18.0, null,     null),
  ('4UT',     195, 22.0, null,     null),
  ('5UT',     185, 25.0, null,     null),
  ('6I',      170, 28.0, 'fat',    null),
  ('7I',      158, 31.0, null,     null),
  ('8I',      148, 35.0, null,     null),
  ('9I',      138, 40.0, null,     null),
  ('PW',      128, 45.0, null,     null),
  ('AW',      110, 50.0, null,     null),
  ('SW',       90, 56.0, null,     'バンカー用'),
  ('LW',       70, 60.0, null,     null);
