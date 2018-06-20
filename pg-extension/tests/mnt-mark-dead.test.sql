-- declare test case
CREATE OR REPLACE FUNCTION fetchq_test__mnt_mark_dead_01 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'IT WAS NOT POSSIBLE TO MARK AS DEAD';
    VAR_r RECORD;
BEGIN
    
    -- initialize test
    PERFORM fetchq_test_init();
    PERFORM fetchq_create_queue('foo');

    -- insert dummy data & force the date in the past
    PERFORM fetchq_push('foo', 'a1', 0, 0, NOW() - INTERVAL '1 milliseconds', '{}');
    PERFORM fetchq_pick('foo', 0, 1, '5m');
    UPDATE fetchq__foo__documents SET attempts = 5, next_iteration = NOW() - INTERVAL '1 milliseconds';
    
    PERFORM fetchq_mnt_mark_dead('foo', 100);
    PERFORM fetchq_metric_log_pack();

    -- run the test
    SELECT * INTO VAR_r FROM fetchq_metric_get('foo', 'kll');
    IF VAR_r.current_value != 1 THEN
        RAISE EXCEPTION 'failed - %', VAR_testName;
    END IF;

    -- cleanup
    PERFORM fetchq_test_clean();

    passed = TRUE;
END; $$
LANGUAGE plpgsql;