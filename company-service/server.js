const express = require('express');
const { producer, initKafka, emitter } = require('./kafka');

const client = require('./grpcClient');
const cors = require('cors');
const { findCompany } = require('./companyData');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/data/:name', async (req, res) => 
{
    const name = req.params.name;
    const response = {'Net worth': '$USD 10,000,000'};
    console.log('Sending response to client service!');
    res.json(response);

    await producer.send
    ({
        topic: 'client-info',
        messages: [{value: `{"Client":"${name}", "Job": "CEO"}`}]
    });
});

app.post('/company-info', async (req, res) =>
{
    const { name } = req.body;
    console.log(`Searching for company: ${name}`);

    const comp = findCompany(name);

    if (!comp)
    {
        console.log('Invalid company!');
        return res.json({ message: 'Could not find any information about this company, try "TestCompany".' });
    }

    console.log(`Company found! Requesting data from client service`);
    client.GetCompanyValue({ name: name }, async (err, response) => 
    {
        if (err)    return res.json({ message: `gRPC failed ${err}`, err});

        console.log(`gRPC: message received: ${ response.value }`);

        const clientData = await new Promise((resolve) =>
        {
            emitter.once('data-ready', (value) =>
            {
                resolve(value);
            });
        });

        console.log(`Received data from client service via Kafka: ${clientData.data}`);

        res.json(Object.assign({}, JSON.parse(clientData.data), JSON.parse(response.value)));

    });
});

initKafka();


app.listen(3002, () => console.log('CompanyService running on port 3002!'));