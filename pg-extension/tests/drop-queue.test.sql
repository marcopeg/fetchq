
-- declare test case
-- DROP FUNCTION IF EXISTS fetchq_test__drop_queue();
CREATE OR REPLACE FUNCTION fetchq_test__drop_queue_01 (
    OUT passed BOOLEAN
) AS $$
DECLARE
	VAR_numDocs INTEGER;
    VAR_r RECORD;
BEGIN
    -- initialize test
    PERFORM fetchq_test_init();

    -- create & drop the queue
    PERFORM fetchq_create_queue('foo');
    PERFORM fetchq_push('foo', 'a1', 0, 0, NOW() + INTERVAL '1m', '{}');
    PERFORM fetchq_metric_log_pack();
    PERFORM fetchq_push('foo', 'a2', 0, 0, NOW() + INTERVAL '1m', '{}');
    SELECT * INTO VAR_r FROM fetchq_drop_queue('foo');
    IF VAR_r.was_dropped IS NOT true THEN
        RAISE EXCEPTION 'could not drop the queue';
    END IF;

    -- check queue index
    SELECT COUNT(*) INTO VAR_numDocs FROM fetchq_sys_queues WHERE name = 'foo';
    IF VAR_numDocs > 0 THEN
		RAISE EXCEPTION 'queue index was not dropped';
	END IF;

    -- check jobs table
    SELECT COUNT(*) INTO VAR_numDocs FROM fetchq_sys_jobs WHERE subject = 'foo';
    IF VAR_numDocs > 0 THEN
		RAISE EXCEPTION 'queue jobs were not dropped';
	END IF;

    -- check logs writes
    SELECT COUNT(*) INTO VAR_numDocs FROM fetchq_sys_metrics_writes
    WHERE queue = 'foo';
    IF VAR_numDocs > 0 THEN
		RAISE EXCEPTION 'queue metrics writes were not dropped';
	END IF;

    -- check logs
    SELECT COUNT(*) INTO VAR_numDocs FROM fetchq_sys_metrics
    WHERE queue = 'foo';
    IF VAR_numDocs > 0 THEN
		RAISE EXCEPTION 'queue metrics were not dropped';
	END IF;


    -- cleanup test
    -- PERFORM fetchq_test_clean();
    passed = TRUE;
END; $$
LANGUAGE plpgsql;

-- run test & cleanup
-- SELECT * FROM fetchq_test__drop_queue();
-- DROP FUNCTION IF EXISTS fetchq_test__drop_queue();
