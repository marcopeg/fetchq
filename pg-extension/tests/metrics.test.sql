
-- declare test case
-- DROP FUNCTION IF EXISTS fetchq_test__metrics();
CREATE OR REPLACE FUNCTION fetchq_test__metrics (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_r RECORD;
BEGIN

    -- initialize test
    CREATE EXTENSION fetchq;
    PERFORM fetchq_init();
    PERFORM fetchq_create_queue('foo');

    -- test set counters
    PERFORM fetchq_metric_set('a', 'b', 4);
    PERFORM fetchq_metric_set('a', 'b', 5);
    PERFORM fetchq_metric_increment('a', 'b', 5);
    PERFORM fetchq_metric_increment('a', 'b', -3);

    -- test log counters
    PERFORM fetchq_metric_log_increment('a', 'b', 10);
    PERFORM fetchq_metric_log_decrement('a', 'b', 5);
    PERFORM fetchq_metric_log_pack();

    SELECT * INTO VAR_r from fetchq_metric_get('a', 'b');
    IF VAR_r.current_value <> 12 THEN
        RAISE EXCEPTION 'Wrong metric computation';
    END IF;

    -- test reset on logs
    PERFORM fetchq_metric_log_increment('b', 'c', 10);
    PERFORM fetchq_metric_log_decrement('b', 'c', 5);
    PERFORM fetchq_metric_log_set('b', 'c', 99);
    PERFORM fetchq_metric_log_pack();

    SELECT * INTO VAR_r from fetchq_metric_get('b', 'c');
    IF VAR_r.current_value <> 99 THEN
        RAISE EXCEPTION 'Wrong metric computation';
    END IF;

    -- cleanup
    PERFORM fetchq_destroy();
    DROP EXTENSION fetchq;

    passed = TRUE;
END; $$
LANGUAGE plpgsql;

-- run test & cleanup
-- SELECT * FROM fetchq_test__metrics();
-- DROP FUNCTION IF EXISTS fetchq_test__metrics();