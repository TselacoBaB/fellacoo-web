-- E-commerce foundation for physical, digital and dropship commerce.
-- Applied to the shared Supabase project on 2026-09-29.

create table if not exists public.ecommerce_products (
  id text primary key, owner_id varchar not null, site_id varchar not null,
  name varchar not null, slug varchar not null, description text not null default '',
  product_type varchar not null check (product_type in ('PHYSICAL','DIGITAL','DROPSHIP','HYBRID')),
  status varchar not null default 'DRAFT' check (status in ('DRAFT','ACTIVE','ARCHIVED','SOLD_OUT')),
  sku varchar not null default '', price numeric(14,2) not null default 0,
  compare_at_price numeric(14,2), currency varchar(3) not null default 'ZAR',
  track_inventory boolean not null default true, inventory_quantity integer not null default 0,
  low_stock_threshold integer not null default 5, weight_grams integer not null default 0,
  shipping_required boolean not null default true, digital_asset_key text,
  digital_delivery_config jsonb not null default '{}'::jsonb,
  supplier_config jsonb not null default '{}'::jsonb, tax_config jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), unique(owner_id,site_id,slug)
);
create index if not exists ecommerce_products_site_idx on public.ecommerce_products(owner_id,site_id,status);

create table if not exists public.ecommerce_variants (
  id text primary key, product_id text not null references public.ecommerce_products(id) on delete cascade,
  name varchar not null, sku varchar not null default '', price numeric(14,2),
  inventory_quantity integer not null default 0, weight_grams integer, options jsonb not null default '{}'::jsonb,
  image_url text, active boolean not null default true, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ecommerce_suppliers (
  id text primary key, owner_id varchar not null, name varchar not null,
  adapter varchar not null default 'MANUAL', status varchar not null default 'ACTIVE' check (status in ('ACTIVE','PAUSED','ERROR')),
  config jsonb not null default '{}'::jsonb, last_sync_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.ecommerce_product_suppliers (
  product_id text not null references public.ecommerce_products(id) on delete cascade,
  supplier_id text not null references public.ecommerce_suppliers(id) on delete cascade,
  supplier_sku varchar not null default '', supplier_product_ref varchar not null default '',
  cost numeric(14,2) not null default 0, sync_inventory boolean not null default true,
  metadata jsonb not null default '{}'::jsonb, primary key(product_id,supplier_id)
);

create table if not exists public.ecommerce_shipping_profiles (
  id text primary key, owner_id varchar not null, site_id varchar not null,
  name varchar not null, currency varchar(3) not null default 'ZAR',
  rules jsonb not null default '[]'::jsonb, active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.ecommerce_tax_rules (
  id text primary key, owner_id varchar not null, site_id varchar not null,
  country_code varchar(2), region_code varchar(32), product_type varchar(20),
  rate numeric(7,4) not null default 0, tax_included boolean not null default false,
  priority integer not null default 0, active boolean not null default true, created_at timestamptz not null default now()
);

create table if not exists public.ecommerce_exchange_rates (
  base_currency varchar(3) not null, quote_currency varchar(3) not null,
  rate numeric(20,8) not null, source varchar(64) not null default 'MANUAL',
  fetched_at timestamptz not null default now(), primary key(base_currency,quote_currency)
);

create table if not exists public.ecommerce_carts (
  id text primary key, owner_id varchar not null, site_id varchar not null,
  customer_id varchar, currency varchar(3) not null default 'ZAR',
  status varchar not null default 'OPEN' check (status in ('OPEN','CHECKOUT','CONVERTED','ABANDONED')),
  expires_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.ecommerce_cart_items (
  id text primary key, cart_id text not null references public.ecommerce_carts(id) on delete cascade,
  product_id text not null references public.ecommerce_products(id), variant_id text references public.ecommerce_variants(id),
  quantity integer not null check (quantity > 0), unit_price numeric(14,2) not null, currency varchar(3) not null,
  snapshot jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), unique(cart_id,product_id,variant_id)
);

create table if not exists public.ecommerce_orders (
  id text primary key, owner_id varchar not null, site_id varchar not null, customer_id varchar,
  cart_id text, order_number varchar not null,
  status varchar not null default 'PENDING_PAYMENT' check (status in ('PENDING_PAYMENT','PAID','PROCESSING','PARTIALLY_FULFILLED','FULFILLED','CANCELLED','REFUNDED')),
  payment_status varchar not null default 'PENDING' check (payment_status in ('PENDING','AUTHORIZED','PAID','FAILED','REFUNDED','PARTIALLY_REFUNDED')),
  currency varchar(3) not null default 'ZAR', subtotal numeric(14,2) not null default 0,
  discount_total numeric(14,2) not null default 0, shipping_total numeric(14,2) not null default 0,
  tax_total numeric(14,2) not null default 0, total numeric(14,2) not null default 0,
  billing_address jsonb not null default '{}'::jsonb, shipping_address jsonb not null default '{}'::jsonb,
  tax_snapshot jsonb not null default '{}'::jsonb, currency_snapshot jsonb not null default '{}'::jsonb,
  fulfillment_summary jsonb not null default '{}'::jsonb, payment_reference varchar not null default '',
  idempotency_key varchar not null, metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(owner_id,idempotency_key), unique(owner_id,order_number)
);

create table if not exists public.ecommerce_order_items (
  id text primary key, order_id text not null references public.ecommerce_orders(id) on delete cascade,
  product_id text references public.ecommerce_products(id), variant_id text references public.ecommerce_variants(id),
  name varchar not null, product_type varchar not null, sku varchar not null default '',
  quantity integer not null check (quantity > 0), unit_price numeric(14,2) not null, line_total numeric(14,2) not null,
  fulfillment_status varchar not null default 'PENDING' check (fulfillment_status in ('PENDING','ROUTED','PROCESSING','SHIPPED','DELIVERED','AVAILABLE','FAILED','CANCELLED')),
  supplier_id text references public.ecommerce_suppliers(id), supplier_order_ref varchar not null default '',
  digital_asset_key text, snapshot jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create table if not exists public.ecommerce_download_grants (
  id text primary key, order_item_id text not null references public.ecommerce_order_items(id) on delete cascade,
  token_hash varchar not null unique, expires_at timestamptz not null, max_downloads integer not null default 3,
  download_count integer not null default 0, last_download_at timestamptz, revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists ecommerce_order_items_order_idx on public.ecommerce_order_items(order_id);
create index if not exists ecommerce_download_grants_expiry_idx on public.ecommerce_download_grants(expires_at);
