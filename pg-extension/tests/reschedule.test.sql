

CREATE OR REPLACE FUNCTION fetchq_test__reschedule_01 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'COULD NOT RESCHEDULE';
    VAR_r RECORD;
BEGIN
    
    -- initialize test
    PERFORM fetchq_test_init();
    PERFORM fetchq_create_queue('foo');

    -- insert dummy data
    PERFORM fetchq_doc_push('foo', 'a1', 0, 1, NOW() - INTERVAL '1s', '{}');
    SELECT * INTO VAR_r FROM fetchq_doc_pick('foo', 0, 2, '5m');

    -- perform reschedule
    PERFORM fetchq_reschedule('foo', VAR_r.id, NOW() + INTERVAL '1y');

    -- get first document
    SELECT * INTO VAR_r from fetchq__foo__documents WHERE id = VAR_r.id;
    IF VAR_r.iterations IS NULL THEN
        RAISE EXCEPTION 'failed - % (unespected number of iterations)', VAR_testName;
    END IF;

    -- cleanup
    PERFORM fetchq_test_clean();

    passed = TRUE;
END; $$
LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION fetchq_test__reschedule_02 (
    OUT passed BOOLEAN
) AS $$
DECLARE
    VAR_testName VARCHAR = 'COULD NOT RESCHEDULE WITH PAYLOAD';
    VAR_r RECORD;
BEGIN
    
    -- initialize test
    PERFORM fetchq_test_init();
    PERFORM fetchq_create_queue('foo');

    -- insert dummy data
    PERFORM fetchq_doc_push('foo', 'a1', 0, 1, NOW() - INTERVAL '1s', '{}');
    SELECT * INTO VAR_r FROM fetchq_doc_pick('foo', 0, 2, '5m');

    -- perform reschedule
    PERFORM fetchq_reschedule('foo', VAR_r.id, NOW() + INTERVAL '1y', '{"a":1}');

    -- get first document
    SELECT * INTO VAR_r from fetchq__foo__documents 
    WHERE id = VAR_r.id
    AND payload @> '{"a": 1}';

    IF VAR_r.iterations IS NULL THEN
        RAISE EXCEPTION 'failed - % (unespected number of iterations)', VAR_testName;
    END IF;

    -- cleanup
    PERFORM fetchq_test_clean();

    passed = TRUE;
END; $$
LANGUAGE plpgsql;

