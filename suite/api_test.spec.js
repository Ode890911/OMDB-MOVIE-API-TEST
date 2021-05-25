const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const chai = require('chai');
const chaiHttp = require('chai-http')
const request = require("supertest");
chai.use(chaiHttp)
const expect = chai.expect
const assert = chai.assert

const url = 'http://www.omdbapi.com'

const Test_helper = require('../support/test_helper')
let help = new Test_helper();

let movieToSearch = 'thomas';
const myApik = process.env.API_KEY


describe('OMDb API - The Open Movie Database', () => {

  it('test no api key all', async () => {
    const response = await help.makeReq(url, '?s=star')
    expect(response.statusCode).to.equal(401)
    expect(response.body).to.deep.equal({ "Response": "False", "Error": "No API key provided." });
  })

  // 3. Extend api_test.rb by creating a test that performs a search on 'thomas'.

  it('Search  movie with \'thomas\' in the title', async () => {

    const response = await help.makeReq(url, `?s=${movieToSearch}&type=movie&apikey=${myApik}`)
    const movies = response.body['Search']

    movies.forEach((movie) => {

      // Verify all titles are a relevant match
      expect(movie['Title'].toLowerCase()).to.include(movieToSearch.toLowerCase())

      // - Verify keys include Title, Year, imdbID, Type, and Poster for all records in the response
      assert.containsAllKeys(movie, ['Title', 'Year', 'imdbID', 'Type', 'Poster']);
      expect(movie).to.include.all.keys('Title', 'Year', 'imdbID', 'Type', 'Poster');

      // - Verify values are all of the correct object class
      assert.typeOf(movie, 'object');
      assert.typeOf(Object.values(movie), 'array');

      // - Verify year matches correct format
      let year = movie['Year']
      expect(help.yearFormat(year)).to.be.true
    })

  })

  //5. Add a test that verifies none of the poster links on page 1 are broken
  it("verifies none of the poster links on page 1 are broken", async () => {

    const response = await help.makeReq(url, `?s=${movieToSearch}&page=1&type=movie&apikey=${myApik}`)
    const movies = response.body['Search']

    for (let mov of movies) {
      let posterLink = mov['Poster']
      const agent = request.agent(posterLink);
      let posterLinkRes = await agent.get(posterLink)
      expect(posterLinkRes.statusCode).not.to.equal(500)
    }
  });

  // 6. Add a test that verifies there are no duplicate records across the first 5 pages
  it("verifies there are no duplicate records across the first 5 pages", async () => {
    const response = await help.makeReq(url, `?s=${movieToSearch}&page=5&type=movie&apikey=ba5a252d`)
    const movies = response.body['Search']

    let movieString = []
    for (var i = 0; i < movies.length; i++) {
      movieString.push(JSON.stringify(movies[i]))
    }
    expect(help.isMovieDuplicate(movieString)).to.be.false;

  });

  // 7 Add a test that verifies something you are curious about with regard to movies or data in the database.

  it("verifies the series \'Ozark\' actors", async () => {
    movieToSearch = 'Ozark'
    const response = await help.makeReq(url, `?t=${movieToSearch}&type=series&apikey=${myApik}`)
    let actors = response.body['Actors']
    expect(actors).to.include('Laura Linney')

  });
})
