import mongoose from 'mongoose';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

let app = express();
app.server = http.createServer(app);
mongoose.connect(`mongodb://127.0.0.1:27017/checkout`);

app.use(bodyParser.json({
	limit : '100kb'
}));
app.use(bodyParser.urlencoded({
 	extended: true
})); 

app.use(express.static('public'));

app.use('/api', routes);

app.server.listen(process.env.PORT || 8080, () => {
	console.log(`Listening on port ${app.server.address().port}`);
});

module.exports = app.server;

