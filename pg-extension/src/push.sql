
-- PUSH A SINGLE DOCUMENT
DROP FUNCTION IF EXISTS fetchq_push(CHARACTER VARYING, CHARACTER VARYING, INTEGER, INTEGER, TIMESTAMP WITH TIME ZONE, JSONB);
CREATE OR REPLACE FUNCTION fetchq_push (
    PAR_queue VARCHAR,
    PAR_subject VARCHAR,
    PAR_version INTEGER,
    PAR_priority INTEGER,
    PAR_nextIteration TIMESTAMP WITH TIME ZONE,
    PAR_payload JSONB,
    OUT queued_docs INTEGER
) AS $$
DECLARE
	VAR_q VARCHAR;
    VAR_status INTEGER = 0;
BEGIN
    -- pick right status based on nextIteration date
    IF PAR_nextIteration <= NOW() THEN
		VAR_status = 1;
	END IF;

    -- push the document into the data table
    VAR_q = 'INSERT INTO fetchq__%s__documents (';
	VAR_q = VAR_q || 'subject, version, priority, status, next_iteration, payload, created_at) VALUES (';
    VAR_q = VAR_q || '''%s'', ';
    VAR_q = VAR_q || '%s, ';
    VAR_q = VAR_q || '%s, ';
    VAR_q = VAR_q || '%s, ';
    VAR_q = VAR_q || '''%s'', ';
    VAR_q = VAR_q || '''%s'', ';
    VAR_q = VAR_q || 'NOW() ';
	VAR_q = VAR_q || ')';
    VAR_q = FORMAT(VAR_q, PAR_queue, PAR_subject, PAR_version, PAR_priority, VAR_status, PAR_nextIteration, PAR_payload);
    RAISE INFO '%', VAR_q;
    EXECUTE VAR_q;
    GET DIAGNOSTICS queued_docs := ROW_COUNT;
    
    
END; $$
LANGUAGE plpgsql;
