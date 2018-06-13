
-- declare test case
-- DROP FUNCTION IF EXISTS fetchq_test__pick();
CREATE OR REPLACE FUNCTION fetchq_test__pick (
    OUT passed BOOLEAN
) AS $$
DECLARE
	VAR_queuedDocs INTEGER;
    VAR_r RECORD;
BEGIN

    --
    -- PUSH A SINGLE DOCUMENT WITH PAST DATE
    --
    
    -- initialize test
    CREATE EXTENSION fetchq;
    PERFORM fetchq_init();
    PERFORM fetchq_create_queue('foo');

    -- insert dummy data
    PERFORM fetchq_push('foo', 'a1', 0, 0, NOW(), '{}');
    PERFORM fetchq_push('foo', 'a2', 0, 0, NOW(), '{}');

    -- get first document
    SELECT * INTO VAR_r from fetchq_pick('foo', 0, 1, '5m');
    RAISE NOTICE '%', VAR_r;


    -- cleanup
    PERFORM fetchq_destroy();
    DROP EXTENSION fetchq;

    passed = TRUE;
END; $$
LANGUAGE plpgsql;

-- run test & cleanup
-- SELECT * FROM fetchq_test__pick();
-- DROP FUNCTION IF EXISTS fetchq_test__pick();