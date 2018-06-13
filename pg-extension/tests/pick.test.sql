
-- declare test case
-- DROP FUNCTION IF EXISTS fetchq_test__pick();
CREATE OR REPLACE FUNCTION fetchq_test__pick (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR;
    VAR_r RECORD;
BEGIN

    -- TEST NAME --
    VAR_testName = 'OLDER DOCUMENT SHOULD GO FIRST';
    -- TEST NAME --
    
    -- initialize test
    PERFORM fetchq_test_init();
    PERFORM fetchq_create_queue('foo');

    -- insert dummy data
    PERFORM fetchq_push('foo', 'a1', 0, 0, NOW() - INTERVAL '1s', '{}');
    PERFORM fetchq_push('foo', 'a2', 0, 0, NOW() - INTERVAL '2s', '{}');

    -- get first document
    SELECT * INTO VAR_r from fetchq_pick('foo', 0, 1, '5m');
    IF VAR_r.subject != 'a2' THEN
        RAISE EXCEPTION 'failed - %', VAR_testName;
    END IF;


    -- cleanup
    PERFORM fetchq_test_clean();

    passed = TRUE;
END; $$
LANGUAGE plpgsql;

-- run test & cleanup
-- SELECT * FROM fetchq_test__pick();
-- DROP FUNCTION IF EXISTS fetchq_test__pick();