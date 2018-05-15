import axios from 'axios';
import roundTo from 'round-to'

const url = 'http://apilayer.net/api/live';
const access_key = '15fe6929b18bb510ff0c2a180c1a20e8'
const source = 'GBP'; // source not supported on free tier
const format = 1;

const getConversion = (curr) => {
	return new Promise((resolve, reject) => {
		axios.get(`${url}?access_key=${access_key}&format=${format}`).then(response => {
			resolve(response.data.quotes[`USD${curr}`]);
		}).catch(error => {
			reject(error);
		});
	}).catch((error) => {
		return error;
	});
};

const convert = (obj, conversion) => {
	Object.keys(obj).forEach((key) => {
		if (typeof obj[key] === 'number') {
			obj[key] = roundTo(obj[key] * conversion, 2);
		};
	});
	return obj
}

module.exports = { getConversion, convert };