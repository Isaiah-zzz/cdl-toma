const express = require('express');
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/data', (req, res) => {
    const jsonData = req.body;
    
    // Define the path to the CSV file
    const csvPath = path.join(__dirname, 'data', 'received_data.csv');

    // Check if the file exists and has data
    let fileExists = fs.existsSync(csvPath);
    let csvData;

    if (fileExists && fs.statSync(csvPath).size > 0) {
        // Convert JSON to CSV without headers
        const json2csvParser = new Parser({ header: false });
        csvData = json2csvParser.parse(jsonData) + '\n';
    } else {
        // Convert JSON to CSV with headers
        const json2csvParser = new Parser();
        csvData = json2csvParser.parse(jsonData) + '\n';
    }

    // Append the csv
    fs.appendFile(csvPath, csvData, (err) => {
        if (err) {
            return res.status(500).send('Error saving CSV data');
        }

        // Respond with success
        res.send('CSV data received and saved successfully');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});