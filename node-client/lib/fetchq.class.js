const winston = require('winston')
const { Pool } = require('pg')

const { createConnect } = require('./functions/connect')
const { createDisconnect } = require('./functions/disconnect')
const { createInit } = require('./functions/init')
const { createInfo } = require('./functions/info')
const { createQueueList } = require('./functions/queue.list')
const { createQueueGet } = require('./functions/queue.get')
const { createQueueCreate } = require('./functions/queue.create')
const { createQueueDrop } = require('./functions/queue.drop')
const { createDocPush } = require('./functions/doc.push')
const { createDocPushMany } = require('./functions/doc.push-many')
const { createDocPick } = require('./functions/doc.pick')
const { createDocReschedule } = require('./functions/doc.reschedule')
const { createDocReject } = require('./functions/doc.reject')
const { createDocComplete } = require('./functions/doc.complete')
const { createDocKill } = require('./functions/doc.kill')
const { createDocDrop } = require('./functions/doc.drop')
const { createMetricLogPack } = require('./functions/metric.log-pack')
const { createMetricGet } = require('./functions/metric.get')
const { createMetricGetTotal } = require('./functions/metric.get-total')
const { createMetricGetCommon } = require('./functions/metric.get-common')
const { createMetricGetAll } = require('./functions/metric.get-all')
const { createMetricCompute } = require('./functions/metric.compute')
const { createMetricComputeAll } = require('./functions/metric.compute-all')
const { createMetricReset } = require('./functions/metric.reset')
const { createMetricResetAll } = require('./functions/metric.reset-all')
const { createMntRun } = require('./functions/mnt.run')
const { createMntRunAll } = require('./functions/mnt.run-all')
const { Maintenance } = require('./maintenance.class')

class Fetchq {
    constructor (config = {}) {
        this.pool = new Pool(config.connect)
        this.logger = new winston.Logger({
            level: config.logLevel || 'verbose',
            transports: [
                new (winston.transports.Console)(),
            ]
        })

        this.connect = createConnect(this)
        this.disconnect = createDisconnect(this)
        this.init = createInit(this)
        this.info = createInfo(this)
        this.daemons = []

        this.queue = {
            list: createQueueList(this),
            get: createQueueGet(this),
            create: createQueueCreate(this),
            drop: createQueueDrop(this),
        }

        this.doc = {
            push: createDocPush(this),
            pushMany: createDocPushMany(this),
            pick: createDocPick(this),
            reschedule: createDocReschedule(this),
            reject: createDocReject(this),
            complete: createDocComplete(this),
            kill: createDocKill(this),
            drop: createDocDrop(this),
        }

        this.metric = {
            logPack: createMetricLogPack(this),
            get: createMetricGet(this),
            getTotal: createMetricGetTotal(this),
            getCommon: createMetricGetCommon(this),
            getAll: createMetricGetAll(this),
            compute: createMetricCompute(this),
            computeAll: createMetricComputeAll(this),
            reset: createMetricReset(this),
            resetAll: createMetricResetAll(this),
        }

        this.mnt = {
            run: createMntRun(this),
            runAll: createMntRunAll(this),
        }
    }

    async startMaintenance (settings) {
        const daemon = new Maintenance(this, settings)
        this.daemons.push(daemon)
        return await daemon.start()
    }

    stopMaintenance() {
        return Promise.all(this.daemons.map(d => d.stop()))
    }
}

module.exports = {
    Fetchq
}
