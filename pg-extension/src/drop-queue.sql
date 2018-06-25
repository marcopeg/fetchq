
-- DROP A QUEUE
-- returns:
-- { was_dropped: TRUE }
DROP FUNCTION IF EXISTS fetchq_drop_queue(CHARACTER VARYING);
CREATE OR REPLACE FUNCTION fetchq_drop_queue (
	PAR_queue VARCHAR,
	OUT was_dropped BOOLEAN
) AS $$
DECLARE
	table_name VARCHAR = 'fetchq__';
	drop_query VARCHAR;
BEGIN
	was_dropped = TRUE;
	table_name = table_name || PAR_queue;

	-- drop indexes
	-- PERFORM fetchq_drop_queue_indexes(PAR_queue);

	-- drop queue table
	drop_query = 'DROP TABLE %s__documents;';
	drop_query = FORMAT(drop_query, table_name);
	EXECUTE drop_query;

	-- drop errors table
	drop_query = 'DROP TABLE %s__errors;';
	drop_query = FORMAT(drop_query, table_name);
	EXECUTE drop_query;

	-- drop stats table
	drop_query = 'DROP TABLE %s__metrics;';
	drop_query = FORMAT(drop_query, table_name);
	EXECUTE drop_query;

	-- drop domain namespace
	DELETE FROM fetchq_sys_queues
	WHERE name = PAR_queue;

	-- drop maintenance tasks
	DELETE FROM fetchq_sys_jobs WHERE subject = PAR_queue;

	-- drop counters
	DELETE FROM fetchq_sys_metrics
	WHERE queue = PAR_queue;

	-- drop metrics logs
	DELETE FROM fetchq_sys_metrics_writes
	WHERE queue = PAR_queue;

	EXCEPTION WHEN OTHERS THEN BEGIN
		was_dropped = FALSE;
	END;
END; $$
LANGUAGE plpgsql;
