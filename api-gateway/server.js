const express = require('express');
const axios = require('axios');
const { verifyToken } = require('./auth');
const { services } = require('./config');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/search', verifyToken, async (req, res) => 
{
    const { type, name } = req.body;

    try
    {
        if (type == 'client')
        {
            console.log("Redirect to: client service");
            const response = await axios.post(`${services.client}/client-info`, { name });
            return res.json(response.data);
        }
        else if (type == 'company')
        {
            console.log("Redirect to: company service");
            const response = await axios.post(`${services.company}/company-info`, { name });
            return res.json(response.data);
        }
        else
        {
            return res.status(400).json({ message: 'Invalid type'});
        }
    }
    catch(err)
    {
        res.status(500).json({ message: 'Gateway error', error: err.message});
    }
});

app.listen(3000, () => console.log('API Gateway running on port 3000'));