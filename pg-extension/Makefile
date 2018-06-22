version ?= 0.0.1
pg_version ?= 9.6

reset:
	rm -rf $(CURDIR)/data
	rm -rf $(CURDIR)/extension
	mkdir $(CURDIR)/data
	mkdir $(CURDIR)/data/pg
	mkdir $(CURDIR)/extension

build:
	mkdir -p $(CURDIR)/extension
	cp $(CURDIR)/src/fetchq.control $(CURDIR)/extension/fetchq.control
	cat $(CURDIR)/src/info.sql \
		$(CURDIR)/src/init.sql \
		$(CURDIR)/src/destroy.sql \
		$(CURDIR)/src/get-queue-id.sql \
		$(CURDIR)/src/create-queue-indexes.sql \
		$(CURDIR)/src/create-queue.sql \
		$(CURDIR)/src/drop-queue.sql \
		$(CURDIR)/src/metric-set.sql \
		$(CURDIR)/src/metric-increment.sql \
		$(CURDIR)/src/metric-log-set.sql \
		$(CURDIR)/src/metric-log-increment.sql \
		$(CURDIR)/src/metric-log-decrement.sql \
		$(CURDIR)/src/metric-log-pack.sql \
		$(CURDIR)/src/metric-get.sql \
		$(CURDIR)/src/push.sql \
		$(CURDIR)/src/push-many.sql \
		$(CURDIR)/src/pick.sql \
		$(CURDIR)/src/mnt-make-pending.sql \
		$(CURDIR)/src/mnt-reschedule-orphans.sql \
		$(CURDIR)/src/mnt-mark-dead.sql \
		$(CURDIR)/src/mnt-run.sql \
		$(CURDIR)/src/reschedule.sql \
		$(CURDIR)/src/log-error.sql \
		$(CURDIR)/src/reject.sql \
		$(CURDIR)/src/complete.sql \
		$(CURDIR)/src/kill.sql \
		$(CURDIR)/src/drop.sql \
		> $(CURDIR)/extension/fetchq--${version}.sql

build-test:
	mkdir -p $(CURDIR)/data
	cat $(CURDIR)/tests/_before.sql \
		$(CURDIR)/tests/init.test.sql \
		$(CURDIR)/tests/create-queue.test.sql \
		$(CURDIR)/tests/drop-queue.test.sql \
		$(CURDIR)/tests/metrics.test.sql \
		$(CURDIR)/tests/push.test.sql \
		$(CURDIR)/tests/pick.test.sql \
		$(CURDIR)/tests/mnt-make-pending.test.sql \
		$(CURDIR)/tests/mnt-reschedule-orphans.test.sql \
		$(CURDIR)/tests/mnt-mark-dead.test.sql \
		$(CURDIR)/tests/mnt-run.test.sql \
		$(CURDIR)/tests/reschedule.test.sql \
		$(CURDIR)/tests/log-error.test.sql \
		$(CURDIR)/tests/reject.test.sql \
		$(CURDIR)/tests/complete.test.sql \
		$(CURDIR)/tests/kill.test.sql \
		$(CURDIR)/tests/drop.test.sql \
		$(CURDIR)/tests/load.test.sql \
		$(CURDIR)/tests/_run.sql \
		> $(CURDIR)/data/fetchq--${version}.test.sql

start-pg:
	docker run --rm -d \
		--name fetchq \
		-p 5432:5432 \
		-e "POSTGRES_USER=fetchq" \
		-e "POSTGRES_PASSWORD=fetchq" \
		-e "POSTGRES_DB=fetchq" \
		-v $(CURDIR)/data/pg:/var/lib/postgresql/data \
		-v $(CURDIR)/extension/fetchq.control:/usr/share/postgresql/$(pg_version)/extension/fetchq.control \
		-v $(CURDIR)/extension/fetchq--${version}.sql:/usr/share/postgresql/$(pg_version)/extension/fetchq--${version}.sql \
		-v $(CURDIR)/data/fetchq--${version}.test.sql:/tests/fetchq--${version}.test.sql \
		postgres:$(pg_version)

start-delay:
	sleep 20

start: reset build build-test start-pg
	docker logs -f fetchq

stop:
	docker stop fetchq

test: reset build build-test start-pg start-delay test-run stop

test-run: build build-test
	docker exec \
		fetchq \
		psql \
			-v ON_ERROR_STOP=1 \
			-h localhost \
			--username fetchq \
			--dbname fetchq \
			-a -f /tests/fetchq--${version}.test.sql

init: build
	docker exec \
		fetchq \
		psql \
			-v ON_ERROR_STOP=1 \
			-h localhost \
			--username fetchq \
			--dbname fetchq \
			-c 'DROP SCHEMA public CASCADE;CREATE SCHEMA public;CREATE EXTENSION fetchq;SELECT * FROM fetchq_init();'
