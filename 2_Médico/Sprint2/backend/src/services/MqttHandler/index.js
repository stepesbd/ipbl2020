require('dotenv/config');
const mqtt = require('mqtt');

class MqttHandler {
    constructor() {
        this.mqttClient = null;
        this.host = process.env.MQTT_HOST;
        this.port = process.env.MQTT_PORT;
        this.username = process.env.MQTT_USER; // mqtt credentials if these are needed to connect
        this.password = process.env.MQTT_PASSWORD;
    }

    connect(subscriber) {
        // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
        this.mqttClient = mqtt.connect(this.host, {
            //port: this.port
        });

        // Mqtt error calback
        this.mqttClient.on('error', (err) => {
            console.log(err);
            this.mqttClient.end();
        });

        // Connection callback
        this.mqttClient.on('connect', () => {
            console.log(`mqtt client connected`);
        });

        // mqtt subscriptions
        this.mqttClient.subscribe(subscriber);

        // When a message arrives, console.log it
        this.mqttClient.on('message', function (topic, message) {
            console.log(message.toString());
        });

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`);
        });
    }

    // Sends a mqtt message to topic: mytopic
    sendMessage(message) {
        this.mqttClient.publish('mqtt2mongo', message);
    }
}

module.exports = MqttHandler;