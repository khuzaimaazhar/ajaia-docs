create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  created_at timestamptz default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled',
  content text default '',
  owner_id uuid references users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table shares (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  shared_with_user_id uuid references users(id) on delete cascade,
  permission text not null default 'edit',
  created_at timestamptz default now(),
  unique(document_id, shared_with_user_id)
);

alter table users disable row level security;
alter table documents disable row level security;
alter table shares disable row level security;

insert into users (email, name) values
  ('alice@ajaia.test', 'Alice'),
  ('bob@ajaia.test', 'Bob');