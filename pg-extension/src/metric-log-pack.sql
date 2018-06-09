DROP FUNCTION IF EXISTS fetchq_metric_log_pack();
CREATE OR REPLACE FUNCTION fetchq_metric_log_pack (
	OUT affected_rows INTEGER
) AS $$
DECLARE
	VAR_r RECORD;
	VAR_sum INTEGER;
	VAR_tmp INTEGER;
BEGIN
	affected_rows = 0;

	-- reset counters to current value
	FOR VAR_r IN
		SELECT DISTINCT ON (queue, metric) id, queue, metric, reset
		FROM fetchq_sys_metrics_writes
		WHERE reset IS NOT NULL
		ORDER BY queue, metric, created_at DESC
	LOOP
		PERFORM fetchq_metric_set(VAR_r.queue, VAR_r.metric, VAR_r.reset::integer);

		DELETE FROM fetchq_sys_metrics_writes
		WHERE id <= VAR_r.id
		AND queue = VAR_r.queue
		AND metric = VAR_r.metric;

		GET DIAGNOSTICS VAR_tmp := ROW_COUNT;
		affected_rows = affected_rows + VAR_tmp;
	END LOOP;

	-- aggregate the rest of increments
	FOR VAR_r IN
		SELECT DISTINCT ON (queue, metric) id, queue, metric, increment
		FROM fetchq_sys_metrics_writes
		WHERE increment IS NOT NULL
		ORDER BY queue, metric, created_at ASC
	LOOP
		SELECT SUM(increment) INTO VAR_sum
		FROM fetchq_sys_metrics_writes
		WHERE queue = VAR_r.queue
		AND metric = VAR_r.metric;

		PERFORM fetchq_metric_increment(VAR_r.queue, VAR_r.metric, VAR_sum);

		DELETE FROM fetchq_sys_metrics_writes
		WHERE queue = VAR_r.queue
		AND metric = VAR_r.metric;

		GET DIAGNOSTICS VAR_tmp := ROW_COUNT;
		affected_rows = affected_rows + VAR_tmp;
	END LOOP;

END; $$
LANGUAGE plpgsql;