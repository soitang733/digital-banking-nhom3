create table if not exists public.dbi_snapshots (
  id text primary key check (id in ('data', 'research', 'pdf_sources', 'media')),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  data_version text not null,
  updated_at timestamptz not null default now()
);

alter table public.dbi_snapshots enable row level security;
revoke all on table public.dbi_snapshots from anon, authenticated;
grant select on table public.dbi_snapshots to anon, authenticated;
grant all on table public.dbi_snapshots to service_role;

create policy "Public read of published dashboard snapshots"
on public.dbi_snapshots for select to anon, authenticated
using (true);

comment on table public.dbi_snapshots is
'Published dashboard snapshots. Public read only; administrative imports retain source scores and evidence states.';
