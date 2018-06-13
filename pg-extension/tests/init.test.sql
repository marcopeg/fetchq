
-- declare test case
-- DROP FUNCTION IF EXISTS fetchq_test__init();
CREATE OR REPLACE FUNCTION fetchq_test__init (
    OUT passed BOOLEAN
) AS $$
DECLARE
	VAR_numDocs INTEGER;
    VAR_r RECORD;
BEGIN
    -- initialize test
    DROP EXTENSION IF EXISTS fetchq;
    CREATE EXTENSION fetchq;

    -- should be able to gracefully fail
    PERFORM fetchq_init();
    PERFORM fetchq_init();

    -- create the queue
    PERFORM * from fetchq_sys_queues;
    PERFORM * from fetchq_sys_metrics;
    PERFORM * from fetchq_sys_metrics_writes;
    PERFORM * from fetchq_sys_jobs;

    -- cleanup
    PERFORM fetchq_destroy();
    DROP EXTENSION fetchq;

    passed = TRUE;
END; $$
LANGUAGE plpgsql;

-- run test & cleanup
-- SELECT * FROM fetchq_test__init();
-- DROP FUNCTION IF EXISTS fetchq_test__init();