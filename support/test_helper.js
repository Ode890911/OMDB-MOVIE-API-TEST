const chai = require('chai');
const chaiHttp = require('chai-http')
require('dotenv').config()
chai.use(chaiHttp)
const request = require("supertest");
require('dotenv').config()

class Test_helper {

  async makeReq(app, params) {
    const agent = request.agent(app);
    let res = agent.get(`${params}`);

    return res;
  }


  yearFormat(year) {
    let dateReg = new RegExp(`[0-9]{4}$`);
    let match = true
    year.match(dateReg) // matches

    if (year.match(dateReg)) {
      match = true
    } else {
      match = false
    }
    return match
  }

  findDuplicatesMovies(movieList) {
    return movieList.filter((item, index) => movieList.indexOf(item) != index)
  }

  isMovieDuplicate(movieList) {
    return new Set(movieList).size !== movieList.length
  }
}

module.exports = Test_helper;
