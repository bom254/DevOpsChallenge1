const express = require('express');
const app = express();
const port = 3000;

app.get('/hello', (req, res) => {
	res.send('Hello, Welcome to Heha Movers, How may we assit you!!');
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
