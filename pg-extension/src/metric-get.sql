
-- READS A SPECIFIC METRIC FOR A SPECIFIC QUEUE
DROP FUNCTION IF EXISTS fetchq_metric_get(CHARACTER VARYING, CHARACTER VARYING);
CREATE OR REPLACE FUNCTION fetchq_metric_get (
	PAR_queue VARCHAR,
	PAR_subject VARCHAR,
	OUT current_value INTEGER,
	OUT last_update TIMESTAMP WITH TIME ZONE,
	OUT does_exists BOOLEAN
) AS $$
DECLARE
	VAR_r RECORD;
	VAR_rows INTEGER;
BEGIN
	SELECT * into VAR_r FROM fetchq_sys_metrics
	WHERE queue = PAR_queue
	AND metric = PAR_subject
	LIMIT 1;
	
	GET DIAGNOSTICS VAR_rows := ROW_COUNT;

	IF VAR_rows > 0 THEN
		current_value = VAR_r.value;
		last_update = VAR_r.updated_at;
		does_exists = true;
	END IF;
	
	IF VAR_rows = 0 THEN
		current_value = 0;
		last_update = null;
		does_exists = false;
	END IF;	
	
--	raise log '%', VAR_r.updated_at;
END; $$
LANGUAGE plpgsql;

-- READS ALL AVAILABLE METRIC FOR A QUEUE
DROP FUNCTION IF EXISTS fetchq_metric_get(CHARACTER VARYING);
CREATE OR REPLACE FUNCTION fetchq_metric_get (
	PAR_queue VARCHAR
) RETURNS TABLE (
	metric VARCHAR,
	current_value BIGINT,
	last_update TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
	RETURN QUERY
	SELECT t.metric, t.value AS current_value, t.updated_at AS last_update
	FROM fetchq_sys_metrics AS t
	WHERE queue = PAR_queue
	ORDER BY metric ASC;
END; $$
LANGUAGE plpgsql;

-- READS THE TOTAL OF A METRIC ACROSS ALL THE QUEUES
DROP FUNCTION IF EXISTS fetchq_metric_get_total(CHARACTER VARYING);
CREATE OR REPLACE FUNCTION fetchq_metric_get_total (
	PAR_metric VARCHAR,
	OUT current_value INTEGER,
	OUT does_exists BOOLEAN
) AS $$
BEGIN
	SELECT sum(value) INTO current_value
	FROM fetchq_sys_metrics
	WHERE metric = PAR_metric;

	does_exists = TRUE;
	IF current_value IS NULL THEN
		current_value = 0;
		does_exists = FALSE;
	END IF;
END; $$
LANGUAGE plpgsql;

-- GET ALL COMMOMN METRICS FOR A SPECIFIC QUEUE
DROP FUNCTION IF EXISTS fetchq_metric_get_common(CHARACTER VARYING);
CREATE OR REPLACE FUNCTION fetchq_metric_get_common(
	PAR_queue VARCHAR,
	OUT cnt INTEGER,
	OUT pnd INTEGER,
	OUT pln INTEGER,
	OUT act INTEGER,
	OUT cpl INTEGER,
	OUT kll INTEGER,
	OUT ent INTEGER,
	OUT drp INTEGER,
	OUT pkd INTEGER,
	OUT prc INTEGER,
	OUT res INTEGER,
	OUT rej INTEGER,
	OUT orp INTEGER,
	OUT err INTEGER
) AS
$BODY$
DECLARE
	VAR_q RECORD;
	VAR_c RECORD;
BEGIN
	FOR VAR_q IN
		SELECT * FROM fetchq_metric_get(PAR_queue)
	LOOP
		IF VAR_q.metric = 'cnt' THEN cnt = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'pnd' THEN pnd = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'pln' THEN pln = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'act' THEN act = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'cpl' THEN cpl = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'kll' THEN kll = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'ent' THEN ent = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'drp' THEN drp = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'pkd' THEN pkd = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'prc' THEN prc = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'res' THEN res = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'rej' THEN rej = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'orp' THEN orp = VAR_q.current_value; END IF;
		IF VAR_q.metric = 'err' THEN err = VAR_q.current_value; END IF;
	END LOOP;
END;
$BODY$
LANGUAGE plpgsql;