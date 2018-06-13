
-- declare test case
-- DROP FUNCTION IF EXISTS fetchq_test__push();
CREATE OR REPLACE FUNCTION fetchq_test__push (
    OUT passed BOOLEAN
) AS $$
DECLARE
	VAR_queuedDocs INTEGER;
    VAR_r RECORD;
BEGIN

    --
    -- PUSH A SINGLE DOCUMENT WITH PAST DATE
    --
    
    -- initialize test
    CREATE EXTENSION fetchq;
    PERFORM fetchq_init();
    PERFORM fetchq_create_queue('foo');

    -- should be able to queue a document with future schedule
    SELECT * INTO VAR_queuedDocs FROM fetchq_push('foo', 'a1', 0, 0, NOW() + INTERVAL '1m', '{}');
    IF VAR_queuedDocs <> 1 THEN
        RAISE EXCEPTION 'It was not possible to queue the doc';
    END IF;

    SELECT * INTO VAR_r FROM fetchq__foo__documents WHERE subject = 'a1';
    IF VAR_r.status <> 0 THEN
        RAISE EXCEPTION 'Wrong status was computed for the document';
    END IF;

    -- checkout logs
    PERFORM fetchq_metric_log_pack();
    SELECT * INTO VAR_r FROM fetchq_metric_get('foo', 'pln');
    IF VAR_r.current_value <> 1 THEN
        RAISE EXCEPTION 'Wrong planned documents count';
    END IF;



    --
    -- PUSH A SINGLE DOCUMENT WITH PAST DATE
    --

    -- initialize test
    PERFORM fetchq_destroy();
    DROP EXTENSION fetchq;
    CREATE EXTENSION fetchq;
    PERFORM fetchq_init();
    PERFORM fetchq_create_queue('foo');

    -- should be able to queue a document with past schedule
    SELECT * INTO VAR_queuedDocs FROM fetchq_push('foo', 'a1', 0, 0, NOW() - INTERVAL '1m', '{}');
    IF VAR_queuedDocs <> 1 THEN
        RAISE EXCEPTION 'It was not possible to queue the doc';
    END IF;

    SELECT * INTO VAR_r FROM fetchq__foo__documents WHERE subject = 'a1';
    IF VAR_r.status <> 1 THEN
        RAISE EXCEPTION 'Wrong status was computed for the document';
    END IF;

    -- checkout logs
    PERFORM fetchq_metric_log_pack();
    SELECT * INTO VAR_r FROM fetchq_metric_get('foo', 'pnd');
    IF VAR_r.current_value <> 1 THEN
        RAISE EXCEPTION 'Wrong pending documents count';
    END IF;



    -- 
    -- PUSH MULTIPLE DOCS
    --

    -- initialize test
    PERFORM fetchq_destroy();
    DROP EXTENSION fetchq;
    CREATE EXTENSION fetchq;
    PERFORM fetchq_init();
    PERFORM fetchq_create_queue('foo');

    SELECT * INTO VAR_queuedDocs FROM fetchq_push( 'foo', 0, NOW(), '( ''a1'', 0, ''{"a":1}'', {DATA}), (''a2'', 1, ''{"a":2}'', {DATA} )');
    IF VAR_queuedDocs <> 2 THEN
        RAISE EXCEPTION 'It was not possible to queue multiple docs';
    END IF;

    -- checkout logs
    PERFORM fetchq_metric_log_pack();
    SELECT * INTO VAR_r FROM fetchq_metric_get('foo', 'pnd');
    IF VAR_r.current_value <> 2 THEN
        RAISE EXCEPTION 'Wrong pending documents count when adding multiple documents';
    END IF;



    -- cleanup
    PERFORM fetchq_destroy();
    DROP EXTENSION fetchq;

    passed = TRUE;
END; $$
LANGUAGE plpgsql;

-- run test & cleanup
-- SELECT * FROM fetchq_test__push();
-- DROP FUNCTION IF EXISTS fetchq_test__push();