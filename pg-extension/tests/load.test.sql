CREATE OR REPLACE FUNCTION fetchq_test__load_01 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'LOAD TEST 01';
    VAR_r RECORD;
    StartTime timestamptz;
    EndTime timestamptz;
    Delta double precision;
BEGIN
    
    -- initialize test
    PERFORM fetchq_test_init();
    PERFORM fetchq_create_queue('foo');

    -- insert documents one by one
    StartTime := clock_timestamp();
    FOR VAR_r IN
		SELECT generate_series(1, 1000) AS id, md5(random()::text) AS descr
	LOOP
        PERFORM fetchq_push('foo', VAR_r.descr, 0, 0, NOW() + (random() * (NOW() + '60 days' - NOW())) + '-30 days', '{}');
	END LOOP;
    EndTime := clock_timestamp();
    Delta := 1000 * ( extract(epoch from EndTime) - extract(epoch from StartTime) );
    RAISE NOTICE 'Insert Duration in millisecs=%', ROUND(Delta);

    -- run maintenance
    StartTime := clock_timestamp();
    PERFORM fetchq_mnt_run_all(100000);
    PERFORM fetchq_metric_log_pack();
    EndTime := clock_timestamp();
    Delta := 1000 * ( extract(epoch from EndTime) - extract(epoch from StartTime) );
    RAISE NOTICE 'Maintenance Duration in millisecs=%', ROUND(Delta);

    -- cleanup
    -- PERFORM fetchq_test_clean();

    passed = TRUE;
END; $$
LANGUAGE plpgsql;