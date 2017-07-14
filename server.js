// initialize Express in project
const express = require('express');
const app = express();

const axios = require('axios');
//import axios from 'axios'

// const http = require('http');
const parse = require('parse-link-header');
// import parse from 'parse-link-header'

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Sets up the index page to accept the obj containing the array of movies. Currently set to static values.
app.get('/', (req, res) => {
	console.log('get endpoint')
// by default this is giving us 1 page of 10 results. We can change the page number, and the number of results per page, which maxes out at 50. Need to get the headers, which will tell us how many pages there are, and then loop through that many times to piece it together. 

// This gets us the default setting depending on the URL. Currently set to 50 per page, using the first page.

	const url = 'http://anapioficeandfire.com/api/characters?pageSize=50';
	let lastPage = 0;
	let pageResult = 0;
	let linkHeader = "";
	let dataArray =[];

	axios.get(url)
		.then( result => {
			linkHeader = result.headers.link;
			let parsed = parse(linkHeader);
			lastPage = Number(parsed.last.page);
			console.log(lastPage);
			for (let i=1; i<=lastPage; i++){
				axios.get(url + '&page=' + i )
				.then( result => {
					let filterChunk = result.data.filter(character => character.name!=="" && character.born !=="" && character.died !=="")
					.map((character) => {
						return {
							name: character.name,
							born: character.born,
							died: character.died,
							gender: character.gender
						}
					});
					dataArray = dataArray.concat(filterChunk);
					pageResult ++;
					console.log(pageResult)
					if (pageResult === lastPage){
						res.send({characters: dataArray})
					}

				})
				.catch( error => {
					console.log(error);
				});
			}

		})
		.catch( error => {
			console.log(error);
		});

	});

// start Express on port 8080
app.listen(8080, () => {
	console.log('Server Started on http://localhost:8080');
	console.log('Press CTRL + C to stop server');
});
