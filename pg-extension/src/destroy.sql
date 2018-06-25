
DROP FUNCTION IF EXISTS fetchq_destroy();
CREATE OR REPLACE FUNCTION fetchq_destroy (
    OUT was_destroyed BOOLEAN
) AS $$
DECLARE
    VAR_q RECORD;
BEGIN

    -- drop all queues
    FOR VAR_q IN
		SELECT (name) FROM fetchq_sys_queues
	LOOP
        PERFORM fetchq_doc_drop_queue(VAR_q.name);
	END LOOP;

    -- Queues Index
    DROP TABLE fetchq_sys_queues CASCADE;

    -- Metrics Overview
    DROP TABLE fetchq_sys_metrics CASCADE;

    -- Metrics Writes
    DROP TABLE fetchq_sys_metrics_writes CASCADE;

    -- Maintenance Jobs
    DROP TABLE fetchq_sys_jobs CASCADE;

    -- handle output with graceful fail support
	was_destroyed = TRUE;
    EXCEPTION WHEN OTHERS THEN BEGIN
		was_destroyed = FALSE;
	END;

END; $$
LANGUAGE plpgsql;
