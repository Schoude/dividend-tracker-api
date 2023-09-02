create trigger updated_at_trigger
before update on company_infos
for each row
when (old.* is distinct from new.*)
execute function update_updated_at();
