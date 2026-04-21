const { Kafka } = require('kafkajs');
const kafka = new Kafka({ brokers: ['kafka:9092'] });
const { EventEmitter } = require('events');
const emitter = new EventEmitter();

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'company-group'});

async function initKafka()
{
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({ topic: 'company-info', fromBeginning: true});

    await consumer.run
    ({
        eachMessage: async ({ topic, message }) =>
        {
            //console.log(`[Kafka - ${topic}] ${message.value.toString()}`);
            emitter.emit('data-ready', {data: message.value.toString()});
        }
    });
}

module.exports = {producer, initKafka, emitter};