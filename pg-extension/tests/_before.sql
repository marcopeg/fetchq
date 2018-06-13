DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE OR REPLACE FUNCTION fetchq_test_init (
    OUT done BOOLEAN
) AS $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS fetchq;
    PERFORM fetchq_destroy();
    DROP EXTENSION fetchq;
    CREATE EXTENSION fetchq;
    PERFORM fetchq_init();
    done = TRUE;
END; $$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fetchq_test_clean (
    OUT done BOOLEAN
) AS $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS fetchq;
    PERFORM fetchq_destroy();
    DROP EXTENSION fetchq;
    done = TRUE;
END; $$
LANGUAGE plpgsql;
