const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// create the web application using express
const app = express();
app.use(express.static(publicPath));

// tell web app to start listening on the given port.
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
