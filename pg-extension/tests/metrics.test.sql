

CREATE OR REPLACE FUNCTION fetchq_test__metrics_01 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_r RECORD;
BEGIN

    -- initialize test
    PERFORM fetchq_test_init();
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

    -- cleanup test
    PERFORM fetchq_test_clean();

    passed = TRUE;
END; $$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fetchq_test__metrics_02 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_qA VARCHAR = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    VAR_qB VARCHAR = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
    VAR_r RECORD;
BEGIN

    -- initialize test
    PERFORM fetchq_test_init();

    -- test set counters
    PERFORM fetchq_metric_set(VAR_qA, 'b', 4);
    PERFORM fetchq_metric_set(VAR_qA, 'b', 5);
    PERFORM fetchq_metric_increment(VAR_qA, 'b', 5);
    PERFORM fetchq_metric_increment(VAR_qA, 'b', -3);

    -- test log counters
    PERFORM fetchq_metric_log_increment(VAR_qA, 'b', 10);
    PERFORM fetchq_metric_log_decrement(VAR_qA, 'b', 5);
    PERFORM fetchq_metric_log_pack();

    SELECT * INTO VAR_r from fetchq_metric_get(VAR_qA, 'b');
    IF VAR_r.current_value <> 12 THEN
        RAISE EXCEPTION 'Wrong metric computation';
    END IF;

    -- test reset on logs
    PERFORM fetchq_metric_log_increment(VAR_qB, 'c', 10);
    PERFORM fetchq_metric_log_decrement(VAR_qB, 'c', 5);
    PERFORM fetchq_metric_log_set(VAR_qB, 'c', 99);
    PERFORM fetchq_metric_log_pack();

    SELECT * INTO VAR_r from fetchq_metric_get(VAR_qB, 'c');
    IF VAR_r.current_value <> 99 THEN
        RAISE EXCEPTION 'Wrong metric computation';
    END IF;

    -- cleanup test
    PERFORM fetchq_test_clean();

    passed = TRUE;
END; $$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fetchq_test__metrics_03 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'COULD NOT GET ALL QUEUE METRICS';
    VAR_qA VARCHAR = 'foo';
    VAR_r RECORD;
    VAR_affectedRows INTEGER;
BEGIN

    -- initialize test
    PERFORM fetchq_test_init();

    -- set counters
    PERFORM fetchq_metric_set(VAR_qA, 'a', 2);
    PERFORM fetchq_metric_set(VAR_qA, 'b', 3);
    PERFORM fetchq_metric_increment(VAR_qA, 'c', 3);
    PERFORM fetchq_metric_increment(VAR_qA, 'd', 4);
    PERFORM fetchq_metric_log_decrement(VAR_qA, 'a', 1);
    PERFORM fetchq_metric_log_decrement(VAR_qA, 'b', 1);
    PERFORM fetchq_metric_log_decrement(VAR_qA, 'd', 5);
    PERFORM fetchq_metric_log_pack();

    -- run the test
    PERFORM fetchq_metric_get(VAR_qA);
    GET DIAGNOSTICS VAR_affectedRows := ROW_COUNT;
    
    -- test result rows
    IF VAR_affectedRows <> 4 THEN
        RAISE EXCEPTION 'failed - % (affected_rows, expected "4", got "%")', VAR_testName, VAR_affectedRows;
    END IF;

    -- test result order
    SELECT * INTO VAR_r FROM fetchq_metric_get(VAR_qA);
    IF VAR_r.metric <> 'a' THEN
        RAISE EXCEPTION 'failed - % (metric, expected "a", got "%")', VAR_testName, VAR_r.metric;
    END IF;

    -- cleanup test
    PERFORM fetchq_test_clean();
    passed = TRUE;
END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fetchq_test__metrics_04 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'COULD NOT GET TOTAL FOR A METRIC';
    VAR_r RECORD;
BEGIN

    -- initialize test
    PERFORM fetchq_test_init();

    -- set counters
    PERFORM fetchq_metric_set('a', 'tot', 1);
    PERFORM fetchq_metric_set('b', 'tot', 3);
    PERFORM fetchq_metric_log_increment('a', 'tot', 1);
    PERFORM fetchq_metric_log_decrement('b', 'tot', 1);
    PERFORM fetchq_metric_log_pack();

    -- run the test
    SELECT * INTO VAR_r FROM fetchq_metric_get_total('tot');
    
    -- test result rows
    IF VAR_r.current_value <> 4 THEN
        RAISE EXCEPTION 'failed - % (current_value, expected "4", got "%")', VAR_testName, VAR_r.current_value;
    END IF;

    -- cleanup test
    PERFORM fetchq_test_clean();
    passed = TRUE;
END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fetchq_test__metrics_05 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'COULD NOT GET COMMON METRICS';
    VAR_r RECORD;
    VAR_sum INTEGER = 0;
BEGIN

    -- initialize test
    PERFORM fetchq_test_init();

    -- set counters
    PERFORM fetchq_metric_set('a', 'cnt', 1);
    PERFORM fetchq_metric_set('a', 'pnd', 2);
    PERFORM fetchq_metric_set('a', 'pln', 3);
    PERFORM fetchq_metric_set('a', 'act', 4);
    PERFORM fetchq_metric_set('a', 'cpl', 5);
    PERFORM fetchq_metric_set('a', 'kll', 6);
    PERFORM fetchq_metric_set('a', 'ent', 7);
    PERFORM fetchq_metric_set('a', 'drp', 8);
    PERFORM fetchq_metric_set('a', 'pkd', 9);
    PERFORM fetchq_metric_set('a', 'prc', 10);
    PERFORM fetchq_metric_set('a', 'res', 11);
    PERFORM fetchq_metric_set('a', 'rej', 12);
    PERFORM fetchq_metric_set('a', 'orp', 13);
    PERFORM fetchq_metric_set('a', 'err', 14);
    PERFORM fetchq_metric_log_pack();

    -- run the test
    SELECT * INTO VAR_r FROM fetchq_metric_get_common('a');
    VAR_sum = VAR_sum + VAR_r.cnt;
    VAR_sum = VAR_sum + VAR_r.pnd;
    VAR_sum = VAR_sum + VAR_r.pln;
    VAR_sum = VAR_sum + VAR_r.act;
    VAR_sum = VAR_sum + VAR_r.cpl;
    VAR_sum = VAR_sum + VAR_r.kll;
    VAR_sum = VAR_sum + VAR_r.ent;
    VAR_sum = VAR_sum + VAR_r.drp;
    VAR_sum = VAR_sum + VAR_r.pkd;
    VAR_sum = VAR_sum + VAR_r.prc;
    VAR_sum = VAR_sum + VAR_r.res;
    VAR_sum = VAR_sum + VAR_r.rej;
    VAR_sum = VAR_sum + VAR_r.orp;
    VAR_sum = VAR_sum + VAR_r.err;
    
    IF VAR_sum <> 105 THEN
        RAISE EXCEPTION 'failed - % (current_value, expected "105", got "%")', VAR_testName, VAR_sum;
    END IF;

    -- cleanup test
    PERFORM fetchq_test_clean();
    passed = TRUE;
END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fetchq_test__metrics_06 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'COULD NOT GET ALL METRICS';
    VAR_r RECORD;
    VAR_affectedRows INTEGER;
BEGIN

    -- initialize test
    PERFORM fetchq_test_init();

    -- set counters
    PERFORM fetchq_create_queue('foo');
    PERFORM fetchq_push('foo', 'a1', 0, 1, NOW() - INTERVAL '1s', '{}');
    PERFORM fetchq_pick('foo', 0, 2, '5m');
    PERFORM fetchq_create_queue('faa');
    PERFORM fetchq_push('faa', 'a1', 0, 1, NOW() - INTERVAL '1s', '{}');
    SELECT * INTO VAR_r FROM fetchq_pick('faa', 0, 2, '5m');
    PERFORM fetchq_reschedule('faa', VAR_r.id, NOW() + INTERVAL '1y', '{"a":1}');
    PERFORM fetchq_metric_log_pack();

    -- run the test
    PERFORM fetchq_metric_get_all();
    GET DIAGNOSTICS VAR_affectedRows := ROW_COUNT;
    
    -- test result rows
    IF VAR_affectedRows <> 2 THEN
        RAISE EXCEPTION 'failed - % (affected_rows, expected "2", got "%")', VAR_testName, VAR_affectedRows;
    END IF;

    -- cleanup test
    PERFORM fetchq_test_clean();
    passed = TRUE;
END; $$
LANGUAGE plpgsql;