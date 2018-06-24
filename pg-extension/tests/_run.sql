
-- regression tests
SELECT * FROM fetchq_test__init();
SELECT * FROM fetchq_test__create_queue_01();
SELECT * FROM fetchq_test__create_queue_02();
SELECT * FROM fetchq_test__create_queue_03();
SELECT * FROM fetchq_test__drop_queue();
SELECT * FROM fetchq_test__metrics_01();
SELECT * FROM fetchq_test__metrics_02();
SELECT * FROM fetchq_test__metrics_03();
SELECT * FROM fetchq_test__push_01();
SELECT * FROM fetchq_test__push_02();
SELECT * FROM fetchq_test__push_03();
SELECT * FROM fetchq_test__pick_01();
SELECT * FROM fetchq_test__pick_02();
SELECT * FROM fetchq_test__pick_03();
SELECT * FROM fetchq_test__pick_04();
SELECT * FROM fetchq_test__mnt_make_pending_01();
SELECT * FROM fetchq_test__mnt_reschedule_orphans_01();
SELECT * FROM fetchq_test__mnt_reschedule_orphans_02();
SELECT * FROM fetchq_test__mnt_mark_dead_01();
SELECT * FROM fetchq_test__mnt_mark_dead_02();
SELECT * FROM fetchq_test__mnt_run_01();
SELECT * FROM fetchq_test__mnt_run_all_01();
SELECT * FROM fetchq_test__reschedule_01();
SELECT * FROM fetchq_test__reschedule_02();
SELECT * FROM fetchq_test__log_error_01();
SELECT * FROM fetchq_test__log_error_02();
SELECT * FROM fetchq_test__reject_01();
SELECT * FROM fetchq_test__reject_02();
SELECT * FROM fetchq_test__complete_01();
SELECT * FROM fetchq_test__complete_02();
SELECT * FROM fetchq_test__kill_01();
SELECT * FROM fetchq_test__kill_02();
SELECT * FROM fetchq_test__drop_01();
SELECT * FROM fetchq_test__queue_set_max_attempts_01();
SELECT * FROM fetchq_test__queue_set_current_version_01();
SELECT * FROM fetchq_test__queue_drop_version_01();
SELECT * FROM fetchq_test__queue_drop_version_02();

-- load tests
-- SELECT * FROM fetchq_test__load_01(10000);
-- SELECT * FROM fetchq_test__load_02(5000);
-- SELECT * FROM fetchq_test__load_03(2, 5000);
