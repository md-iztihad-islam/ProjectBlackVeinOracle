-- Custom UUID generation function with prefix
CREATE OR REPLACE FUNCTION generate_admin_id()
RETURNS UUID AS $$
DECLARE
    new_uuid UUID;
BEGIN
    new_uuid := gen_random_uuid();
    RETURN new_uuid;
END;
$$ LANGUAGE plpgsql;

-- Then use it in your table:
-- admin_id UUID PRIMARY KEY DEFAULT generate_admin_id()
