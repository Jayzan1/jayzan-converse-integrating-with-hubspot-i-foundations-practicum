require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;
const CUSTOM_OBJECT_ID = process.env.HUBSPOT_CUSTOM_OBJECT_ID;

// Route 1: Homepage - list all Virtual Staff records
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${process.env.HUBSPOT_CUSTOM_OBJECT_ID}?properties=name,role,department`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const resp = await axios.get(url, { headers });
    const data = resp.data.results;
    console.log(data); // <-- add this to see what properties are actually returned
    res.render('homepage', { records: data });
  } catch (err) {
    console.error('Error fetching Virtual Staff:', err.response?.data || err.message);
    res.send('Error fetching Virtual Staff records.');
  }
});



// Route 2: Form to add new Virtual Staff
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Add New Virtual Staff' });
});

// Route 3: Handle form submission to create new record
app.post('/update-cobj', async (req, res) => {
  const { name, role, department } = req.body;

  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const data = {
    properties: {
      name,
      role,
      department
    }
  };

  try {
    await axios.post(url, data, { headers });
    res.redirect('/');
  } catch (err) {
    console.error('Error creating Virtual Staff:', err.response?.data || err.message);
    res.send('Error creating Virtual Staff record.');
  }
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
