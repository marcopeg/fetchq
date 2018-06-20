-- MAINTENANCE // CREATE PENDINGS
-- returns:
-- { affected_rows: 1 }
DROP FUNCTION IF EXISTS fetchq_mnt_make_pending(CHARACTER VARYING, INTEGER);
CREATE OR REPLACE FUNCTION fetchq_mnt_make_pending (
	PAR_queue VARCHAR,
	PAR_limit INTEGER,
	OUT affected_rows INTEGER
) AS $$
DECLARE
	VAR_q VARCHAR;
BEGIN
    VAR_q = '';
	VAR_q = VAR_q || 'UPDATE fetchq__%s__documents SET status = 1 ';
	VAR_q = VAR_q || 'WHERE id IN ( ';
	VAR_q = VAR_q || 'SELECT id FROM fetchq__%s__documents ';
	VAR_q = VAR_q || 'WHERE status = 0 AND next_iteration <= now() ';
	VAR_q = VAR_q || 'ORDER BY priority DESC, next_iteration ASC, attempts ASC ';
	VAR_q = VAR_q || 'LIMIT %s  ';
	VAR_q = VAR_q || 'FOR UPDATE); ';
	VAR_q = FORMAT(VAR_q, PAR_queue, PAR_queue, PAR_limit);

	-- RAISE NOTICE '%', VAR_q;

	EXECUTE VAR_q;
	GET DIAGNOSTICS affected_rows := ROW_COUNT;

    -- RAISE NOTICE '%', affected_rows;

	PERFORM fetchq_metric_log_increment(PAR_queue, 'pnd', affected_rows);
	PERFORM fetchq_metric_log_decrement(PAR_queue, 'pln', affected_rows);

	EXCEPTION WHEN OTHERS THEN BEGIN
		affected_rows = NULL;
	END;
END; $$
LANGUAGE plpgsql;