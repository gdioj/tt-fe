-- Create employee table
create table public.employees (
  uid uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  employment_date timestamp with time zone not null,
  daily_rate float8 not null,
  notes text,
  tags text[],
  created_at timestamp with time zone default now(),
  created_by uuid references auth.users(id) on delete set null
);
-- Create employeelogs table
create table public.employee_logs (
  uid uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(uid) on delete cascade,
  title text not null,
  content text,
  created_at timestamp with time zone default now(),
  created_by uuid references auth.users(id) on delete set null
);
-- Create employeedetails table
create table public.employee_details (
  uid uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(uid) on delete cascade,
  field text not null,
  value text,
  created_at timestamp with time zone default now(),
  created_by uuid references auth.users(id) on delete set null
);
-- create indexes for performance
create index on public.employees (uid);
create index on public.employee_logs (employee_id);
create index on public.employee_details (employee_id);

-- Create policies for employees table
-- Read
create policy "Allow read for all users"
on public.employees
for select
using (auth.role() = 'authenticated');

-- Insert
create policy "Allow insert for all users"
on public.employees
for insert
with check (auth.role() = 'authenticated');

-- Update
create policy "Allow update for all users"
on public.employees
for update
using (auth.role() = 'authenticated');

-- Delete
create policy "Allow delete for all users"
on public.employees
for delete
using (auth.role() = 'authenticated');

-- Create policies for employee_logs table
-- Read
create policy "Allow read for all users"
on public.employee_logs
for select
using (auth.role() = 'authenticated');

-- Insert
create policy "Allow insert for all users"
on public.employee_logs
for insert
with check (auth.role() = 'authenticated');

-- Update
create policy "Allow update for all users"
on public.employee_logs
for update
using (auth.role() = 'authenticated');

-- Delete
create policy "Allow delete for all users"
on public.employee_logs
for delete
using (auth.role() = 'authenticated');

-- Create policies for employee_details table
-- Read
create policy "Allow read for all users"
on public.employee_details
for select
using (auth.role() = 'authenticated');

-- Insert
create policy "Allow insert for all users"
on public.employee_details
for insert
with check (auth.role() = 'authenticated');

-- Update
create policy "Allow update for all users"
on public.employee_details
for update
using (auth.role() = 'authenticated');

-- Delete
create policy "Allow delete for all users"
on public.employee_details
for delete
using (auth.role() = 'authenticated');

