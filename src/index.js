require('dotenv').config();

// Server
const app = require('./server');

// Database
require('./database');

// Start the server
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
})