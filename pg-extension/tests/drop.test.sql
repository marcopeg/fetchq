
CREATE OR REPLACE FUNCTION fetchq_test__drop_01 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'COULD NOT DROP A DOCUMENT';
    VAR_r RECORD;
BEGIN
    
    -- initialize test
    PERFORM fetchq_test_init();
    PERFORM fetchq_create_queue('foo');

    -- insert dummy data
    PERFORM fetchq_doc_push('foo', 'a1', 0, 1, NOW() - INTERVAL '1s', '{}');
    SELECT * INTO VAR_r FROM fetchq_pick('foo', 0, 2, '5m');

    -- perform reschedule
    PERFORM fetchq_drop('foo', VAR_r.id);
    PERFORM fetchq_mnt_run_all(100);
    PERFORM fetchq_metric_log_pack();

    -- get no docs
    SELECT * INTO VAR_r from fetchq__foo__documents
    WHERE id = VAR_r.id;
    IF VAR_r.id IS NOT NULL THEN
        RAISE EXCEPTION 'failed - %', VAR_testName;
    END IF;

    -- cleanup
    PERFORM fetchq_test_clean();

    passed = TRUE;
END; $$
LANGUAGE plpgsql;