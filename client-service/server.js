const express = require('express');
const cors = require('cors');
const { initKafka, emitter } = require('./kafka');
const startGrpcServer = require('./grpcServer');
const { findClient } = require('./clientData');
const axios = require('axios');
const app = express();
const companyUrl = 'http://company-service:3002';

app.use(express.json());
app.use(cors());

app.post('/client-info', async (req, res) =>
{
    
    const { name } = req.body;
    console.log(`Searching for client: ${name}`);

    const client = findClient(name);

    if (!client)
    {
        console.log('Invalid client!');
        return res.json({ message: 'Could not find any information about this client, try "John".' });
    }

    console.log(`Client found! Requesting data from company service`);
    try
    {
        const companyResponse = await axios.post(`${companyUrl}/data/${name}`)
        const data = companyResponse.data;

        const companyData = await new Promise((resolve) =>
        {
            emitter.once('data-ready', (value) =>
            {
                resolve(value);
            });
        });

        console.log(`Received data from company service via Kafka: ${companyData.data}`);

        res.json(Object.assign({}, JSON.parse(companyData.data), data));
    }
    catch(error)
    {
        console.log('Error fetching data from company service', error.message);
        res.status(500).json({ error: 'Failed to retrieve information from company' });
    }
    
});

initKafka();
startGrpcServer();

app.listen(3001, () => console.log('Client Service running on port 3001'));