
CREATE OR REPLACE FUNCTION fetchq_test__metric_reset_all_01 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'COULD NOT RESET ALL QUEUE METRICS';
    VAR_affectedRows INTEGER;
    VAR_r RECORD;
BEGIN
    
    -- initialize test
    PERFORM fetchq_test_init();
    
    -- insert dummy data - queue foo
    PERFORM fetchq_create_queue('foo');
    PERFORM fetchq_push('foo', 'a1', 0, 1, NOW() - INTERVAL '10s', '{}');
    PERFORM fetchq_push('foo', 'a2', 0, 1, NOW() - INTERVAL '9s', '{}');
    PERFORM fetchq_push('foo', 'a3', 0, 1, NOW() - INTERVAL '8s', '{}');
    PERFORM fetchq_push('foo', 'a4', 0, 1, NOW() - INTERVAL '7s', '{}');
    PERFORM fetchq_push('foo', 'a5', 0, 1, NOW() - INTERVAL '6s', '{}');
    SELECT * INTO VAR_r FROM fetchq_pick('foo', 0, 1, '5m');
    PERFORM fetchq_reschedule('foo', VAR_r.id, NOW() + INTERVAL '1y');
    SELECT * INTO VAR_r FROM fetchq_pick('foo', 0, 1, '5m');
    PERFORM fetchq_reject('foo', VAR_r.id, 'foo', '{"a":1}');
    SELECT * INTO VAR_r FROM fetchq_pick('foo', 0, 1, '5m');
    PERFORM fetchq_complete('foo', VAR_r.id);
    SELECT * INTO VAR_r FROM fetchq_pick('foo', 0, 1, '5m');
    PERFORM fetchq_kill('foo', VAR_r.id);
    SELECT * INTO VAR_r FROM fetchq_pick('foo', 0, 1, '5m');
    PERFORM fetchq_drop('foo', VAR_r.id);

    -- insert dummy data - queue faa
    PERFORM fetchq_create_queue('faa');
    PERFORM fetchq_push('faa', 'a1', 0, 1, NOW() - INTERVAL '10s', '{}');
    PERFORM fetchq_push('faa', 'a2', 0, 1, NOW() - INTERVAL '9s', '{}');
    PERFORM fetchq_push('faa', 'a3', 0, 1, NOW() - INTERVAL '8s', '{}');
    PERFORM fetchq_push('faa', 'a4', 0, 1, NOW() - INTERVAL '7s', '{}');
    PERFORM fetchq_push('faa', 'a5', 0, 1, NOW() - INTERVAL '6s', '{}');
    SELECT * INTO VAR_r FROM fetchq_pick('faa', 0, 1, '5m');
    PERFORM fetchq_reschedule('faa', VAR_r.id, NOW() + INTERVAL '1y');
    SELECT * INTO VAR_r FROM fetchq_pick('faa', 0, 1, '5m');
    PERFORM fetchq_reject('faa', VAR_r.id, 'faa', '{"a":1}');
    SELECT * INTO VAR_r FROM fetchq_pick('faa', 0, 1, '5m');
    PERFORM fetchq_complete('faa', VAR_r.id);
    SELECT * INTO VAR_r FROM fetchq_pick('faa', 0, 1, '5m');
    PERFORM fetchq_kill('faa', VAR_r.id);
    SELECT * INTO VAR_r FROM fetchq_pick('faa', 0, 1, '5m');
    PERFORM fetchq_drop('faa', VAR_r.id);

    -- run maintenance
    PERFORM fetchq_mnt_run_all(100);
    PERFORM fetchq_metric_log_pack();

    -- empty stats so to force recreate
    TRUNCATE fetchq_sys_metrics;
    TRUNCATE fetchq_sys_metrics_writes;

    -- get all computed metrics
    PERFORM fetchq_metric_reset_all();
    GET DIAGNOSTICS VAR_affectedRows := ROW_COUNT;
    IF VAR_affectedRows <> 2 THEN
        RAISE EXCEPTION 'failed - % (count, expected 2, received %)', VAR_testName, VAR_affectedRows;
    END IF;
    
    -- cleanup
    PERFORM fetchq_test_clean();
    passed = TRUE;
END; $$
LANGUAGE plpgsql;
