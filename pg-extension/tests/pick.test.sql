
-- declare test case
-- DROP FUNCTION IF EXISTS fetchq_test__pick();
CREATE OR REPLACE FUNCTION fetchq_test__pick_01 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'OLDER DOCUMENT SHOULD GO FIRST';
    VAR_r RECORD;
BEGIN
    
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



CREATE OR REPLACE FUNCTION fetchq_test__pick_02 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'HIGER PRIORITY SHOULD GO FIRST';
    VAR_r1 RECORD;
    VAR_r RECORD;
BEGIN
    
    -- initialize test
    PERFORM fetchq_test_init();
    PERFORM fetchq_create_queue('foo');

    -- insert dummy data
    PERFORM fetchq_push('foo', 'a1', 0, 1, NOW() - INTERVAL '1s', '{}');
    PERFORM fetchq_push('foo', 'a2', 0, 0, NOW() - INTERVAL '1s', '{}');

    -- get first document
    SELECT * INTO VAR_r from fetchq_pick('foo', 0, 1, '5m');
    IF VAR_r.subject <> 'a1' THEN
        RAISE EXCEPTION 'failed - %', VAR_testName;
    END IF;

    -- cleanup
    PERFORM fetchq_test_clean();

    passed = TRUE;
END; $$
LANGUAGE plpgsql;
