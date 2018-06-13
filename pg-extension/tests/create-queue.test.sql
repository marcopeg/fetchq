
-- declare test case
-- DROP FUNCTION IF EXISTS fetchq_test__create_queue();
CREATE OR REPLACE FUNCTION fetchq_test__create_queue (
    OUT passed BOOLEAN
) AS $$
DECLARE
	VAR_numDocs INTEGER;
    VAR_r RECORD;
BEGIN
    -- initialize test
    CREATE EXTENSION fetchq;
    PERFORM * from fetchq_init();

    -- create the queue
    SELECT * INTO VAR_r FROM fetchq_create_queue('foo');
    IF VAR_r.was_created IS NOT true THEN
        RAISE EXCEPTION 'could not create the queue';
    END IF;

    -- check basic tables
    PERFORM * FROM fetchq__foo__documents;
    PERFORM * FROM fetchq__foo__metrics;
    PERFORM * FROM fetchq__foo__errors;

    -- check jobs table
    SELECT COUNT(*) INTO VAR_numDocs FROM fetchq_sys_jobs WHERE subject = 'foo';
    IF VAR_numDocs < 4 THEN
		RAISE EXCEPTION 'it seems there are not enough maintenance jobs';
	END IF;

    -- cleanup test
    PERFORM fetchq_destroy();
    DROP EXTENSION fetchq;

    passed = TRUE;
END; $$
LANGUAGE plpgsql;

-- run test & cleanup
-- SELECT * FROM fetchq_test__create_queue();
-- DROP FUNCTION IF EXISTS fetchq_test__create_queue();
