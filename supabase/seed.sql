-- Users
insert into public.users (name,email, password)
-- PW = meddl
values ('Marc', 'marcbaque1311@gmail.com', '$2a$10$DhmDIPYc/0QChE.EMBcfdeWBasN9O/7DZPWEP0l3GuETYTWtSoiQO');

-- Portfolios
insert into public.portfolios (name, user_id)
values ('Test Portfolios', 1);
