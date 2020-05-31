require('dotenv/config');
const amqp = require('amqplib')

class RabbitMQ {
    constructor() {
        this.queues = {
            input: 'mqtt2mongo',
            ack_queue: 'ts2-backend',
        }
        this.connection = undefined;
        this.channel = undefined;
    }

    async connect() {
        if (typeof this.connection === "undefined") {
            this.connection = await amqp.connect(process.env.AMQP_URL);
            this.channel = await this.connection.createChannel();
        }
        this.consumer()
    }

    // Publisher
    async publisher(msg) {
        if (typeof this.connection === "undefined") {
            await this.connect();
        }
        if (typeof msg !== "string") {
            throw new Error("TypeError: The message must be string");
        }
        const queue = this.queues.input;
        const ack_queue = this.queues.ack_queue;
        this.channel.assertQueue(ack_queue);
        this.channel.sendToQueue(queue, Buffer.from(msg));
    }

    // Consumer
    async consumer() {
        if (typeof this.connection === "undefined") {
            await this.connect();
        }
        const ack_queue = this.queues.ack_queue;
        this.channel.assertQueue(ack_queue);
        this.channel.consume(ack_queue, async (msg) => {
            console.log(msg.content.toString())
            let result = await this.channel.ack(msg)
            console.log(result)
        })
    }
}

const rabbitMQ = new RabbitMQ();

module.exports = rabbitMQ;
