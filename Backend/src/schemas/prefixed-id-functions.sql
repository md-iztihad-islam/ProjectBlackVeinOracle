-- Create a sequences table to track ID counters for each prefix
CREATE TABLE IF NOT EXISTS id_sequences (
    prefix TEXT PRIMARY KEY,
    current_value BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default sequences for each entity type
INSERT INTO id_sequences (prefix, current_value) VALUES
    ('ADM', 0),
    ('USR', 0),
    ('OFC', 0),
    ('THN', 0),
    ('CRM', 0),
    ('ORG', 0),
    ('CFS', 0),
    ('JAL', 0),
    ('ARS', 0),
    ('INC', 0),
    ('BAL', 0),
    ('GDR', 0),
    ('LOC', 0),
    ('CLB', 0),
    ('CEL', 0)
ON CONFLICT DO NOTHING;

-- Function to generate prefixed sequential IDs
CREATE OR REPLACE FUNCTION generate_prefixed_id(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
    formatted_id TEXT;
BEGIN
    -- Increment and get the next value for this prefix
    UPDATE id_sequences 
    SET current_value = current_value + 1,
        updated_at = NOW()
    WHERE id_sequences.prefix = generate_prefixed_id.prefix
    RETURNING current_value INTO next_val;
    
    -- Format as PREFIX-0000001
    formatted_id := prefix || '-' || LPAD(next_val::TEXT, 7, '0');
    
    RETURN formatted_id;
END;
$$ LANGUAGE plpgsql;

-- Function to reset a sequence
CREATE OR REPLACE FUNCTION reset_sequence(prefix TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE id_sequences 
    SET current_value = 0,
        updated_at = NOW()
    WHERE id_sequences.prefix = reset_sequence.prefix;
END;
$$ LANGUAGE plpgsql;

-- Function to get current sequence value
CREATE OR REPLACE FUNCTION get_current_sequence_value(prefix TEXT)
RETURNS BIGINT AS $$
DECLARE
    current_val BIGINT;
BEGIN
    SELECT current_value INTO current_val 
    FROM id_sequences 
    WHERE id_sequences.prefix = get_current_sequence_value.prefix;
    RETURN current_val;
END;
$$ LANGUAGE plpgsql;
