require('dotenv/config');
const amqp = require('amqplib')

class RabbitMQ {
    constructor() {
        this.queues = {
            output: 'mqtt2mongo',
            input: 'ts2-backend',
        }
        this.connection = undefined;
        this.channel = undefined;
    }

    async connect() {
        if (typeof this.connection === "undefined") {
            this.connection = await amqp.connect(process.env.AMQP_URL);
            this.channel = await this.connection.createChannel();
        }
    }

    // Publisher
    async publisher(msg) {
        if (typeof this.connection === "undefined") {
            await this.connect();
        }
        if (typeof msg !== "string") {
            throw new Error("TypeError: The message must be string");
        }
        const queue = this.queues.output;
        this.channel.assertQueue(queue);
        this.channel.sendToQueue(queue, Buffer.from(msg));
    }

    // Consumer
    async consumer() {
        if (typeof this.connection === "undefined") {
            await this.connect();
        }
        const queue = this.queues.input;
        this.channel.assertQueue(queue);
        return this.channel.consume(queue);
    }
}

const rabbitMQ = new RabbitMQ();

module.exports = rabbitMQ;
