-- PICK AND LOCK A DOCUMENT THAT NEEDS TO BE EXECUTED NEXT
-- returns:
-- { document_structure }
DROP FUNCTION IF EXISTS fetchq_pick(CHARACTER VARYING, INTEGER, INTEGER, CHARACTER VARYING);
CREATE OR REPLACE FUNCTION fetchq_pick (
	PAR_queue VARCHAR,
	PAR_version INTEGER,
	PAR_limit INTEGER,
	PAR_duration VARCHAR
) RETURNS TABLE (
	id INTEGER,
	subject VARCHAR,
	payload JSONB,
	version INTEGER,
	priority INTEGER,
	attempts INTEGER,
	iterations INTEGER,
	created_at TIMESTAMP WITH TIME ZONE,
	last_iteration TIMESTAMP WITH TIME ZONE,
	next_iteration TIMESTAMP WITH TIME ZONE,
	lock_upgrade TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
	LOCK_DURATION CONSTANT VARCHAR := '5m';
	-- table_name VARCHAR = 'lq_';
	-- update_query VARCHAR;
	-- output_query VARCHAR;
--	q4 lock_queue;
	-- affected_rows INTEGER;
BEGIN
	-- table_name = table_name || PAR_queue;

	-- Apply default lock duration
	IF PAR_duration = '' THEN
		PAR_duration = LOCK_DURATION;
	END IF;

    RAISE NOTICE '%', PAR_duration;

	-- CREATE TEMP TABLE lock_queue_work_on_schedule_affected_ids (id BIGINT) ON COMMIT DROP;

	-- update_query = 'WITH lock_queue_work_on_schedule_affected_ids_updated_row AS ( ';
	-- update_query = update_query || 'UPDATE %s ';
	-- update_query = update_query || 'SET status = 2, next_iteration = NOW() + ''%s'', attempts = attempts + 1 ';
	-- update_query = update_query || 'WHERE id IN ( SELECT id FROM %s ';
    -- update_query = update_query || 'WHERE lock_upgrade IS NULL AND status = 1 AND version = %s AND next_iteration < NOW() ';
	-- update_query = update_query || 'ORDER BY priority DESC, next_iteration ASC, attempts ASC ';
	-- update_query = update_query || 'LIMIT %s FOR UPDATE SKIP LOCKED) RETURNING id) ';
	-- update_query = update_query || 'INSERT INTO lock_queue_work_on_schedule_affected_ids (id) ';
	-- update_query = update_query || 'SELECT id FROM lock_queue_work_on_schedule_affected_ids_updated_row; ';
	-- update_query = FORMAT(update_query, table_name, PAR_duration, table_name, PAR_version, PAR_limit);

--	raise log '%', update_query;
	-- EXECUTE update_query;
    -- GET DIAGNOSTICS affected_rows := ROW_COUNT;

--	raise log 'UPDATED %', affected_rows;
	-- PERFORM lq_metric_log_increment(PAR_queue, 'pkd', affected_rows);
	-- PERFORM lq_metric_log_increment(PAR_queue, 'act', affected_rows);
	-- PERFORM lq_metric_log_decrement(PAR_queue, 'pnd', affected_rows);

	-- output_query = 'SELECT id, subject, payload, version, priority, attempts, iterations, created_at, last_iteration, next_iteration, lock_upgrade ';
	-- output_query = output_query || 'FROM %s WHERE id IN ( SELECT id ';
	-- output_query = output_query || 'FROM lock_queue_work_on_schedule_affected_ids); ';
	-- output_query = FORMAT(output_query, table_name);

	-- RETURN QUERY EXECUTE output_query;
--	EXCEPTION WHEN OTHERS THEN BEGIN END;

    RETURN QUERY EXECUTE 'select id, subject, payload, version, priority, attempts, iterations, created_at, last_iteration, next_iteration, lock_upgrade from fetchq__foo__documents;';
END; $$
LANGUAGE plpgsql;
