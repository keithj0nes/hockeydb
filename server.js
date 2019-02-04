const express = require('express');

const app = express();
const port = process.env.PORT || 8010;

app.get('/api/start', (req, res) => {
    res.send('Getting data from the express server.');
  });

app.listen(port, () => console.log(`Server running on port ${port}`))