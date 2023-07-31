alter table "public"."orders" add column "portfolio_id" bigint not null;

alter table "public"."orders" add constraint "orders_portfolio_id_fkey" FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "orders_portfolio_id_fkey";
