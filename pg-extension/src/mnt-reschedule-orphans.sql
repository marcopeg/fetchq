-- MAINTENANCE // RESCHEDULE ORPHANS
-- returns:
-- { affected_rows: 1 }
DROP FUNCTION IF EXISTS fetchq_mnt_reschedule_orphans(CHARACTER VARYING, INTEGER);
CREATE OR REPLACE FUNCTION fetchq_mnt_reschedule_orphans (
	PAR_queue VARCHAR,
	PAR_limit INTEGER,
	OUT affected_rows INTEGER
) AS $$
DECLARE
	MAX_ATTEMPTS CONSTANT INTEGER := 5;
	VAR_q VARCHAR;
BEGIN
	VAR_q = '';
	VAR_q = VAR_q || 'UPDATE fetchq__%s__documents SET status = 1 ';
	VAR_q = VAR_q || 'WHERE id IN ( SELECT id FROM fetchq__%s__documents ';
	VAR_q = VAR_q || 'WHERE lock_upgrade IS NULL AND status = 2 AND next_iteration < NOW() AND attempts < %s ';
	VAR_q = VAR_q || 'LIMIT %s FOR UPDATE );';
	VAR_q = FORMAT(VAR_q, PAR_queue, PAR_queue, MAX_ATTEMPTS, PAR_limit);
	EXECUTE VAR_q;
	GET DIAGNOSTICS affected_rows := ROW_COUNT;

	PERFORM fetchq_metric_log_increment(PAR_queue, 'err', affected_rows);
	PERFORM fetchq_metric_log_increment(PAR_queue, 'orp', affected_rows);
	PERFORM fetchq_metric_log_increment(PAR_queue, 'pnd', affected_rows);
	PERFORM fetchq_metric_log_decrement(PAR_queue, 'act', affected_rows);

	EXCEPTION WHEN OTHERS THEN BEGIN
		affected_rows = NULL;
	END;
END; $$
LANGUAGE plpgsql;