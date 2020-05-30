require('dotenv/config');
const amqp = require('amqplib/callback_api')

class rabbitMQ {

    constructor() {
        this.queue = 'mqtt2mongo';
    }

    bail(err) {
        console.error(err);
        process.exit(1);
    }

    connect() {
        amqp.connect(process.env.AMQP_URL, (err, conn) => {
            if (err != null) this.bail(err);
            //this.consumer(conn, this.queue)
            //this.publisher(conn, this.queue)
        })
    }

    // Publisher
    publisher(conn, queue, msg) {
        conn.createChannel(on_open);
        function on_open(err, ch) {
            if (err != null) this.bail(err);
            ch.assertQueue(queue);
            ch.sendToQueue(queue, Buffer.from(msg));
        }
    }

    // Consumer
    consumer(conn, queue) {
        var ok = conn.createChannel(on_open);
        function on_open(err, ch) {
            if (err != null) bail(err);
            ch.assertQueue(queue);
            ch.consume(queue, function (msg) {
                if (msg !== null) {
                    //console.log(msg.content.toString());
                    ch.ack(msg);
                }
            });
        }
    }
}

module.exports = rabbitMQ;