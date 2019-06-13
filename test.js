const supertest = require('supertest');
const should = require('should');

// Port number
const port = process.env.PORT || 3000;
const server = supertest.agent(`http://localhost:${port}`);

// UNIT TESTING
describe('POST /weather', () => {
  it('Testing Validation Errors 1', (done) => {
    server
      .post('/weather')
      .send({})
      .expect('Content-type', /json/)
      .expect(422)
      .end((err, res) => {
        res.statusCode.should.equal(422);
        res.body.SUCCESS.should.equal(false);
        done();
      });
  });
  it('Testing Validation Errors 2', (done) => {
    server
      .post('/weather')
      .send({ phone_number: '+201065781197000' })
      .expect('Content-type', /json/)
      .expect(422)
      .end((err, res) => {
        res.statusCode.should.equal(422);
        res.body.SUCCESS.should.equal(false);
        done();
      });
  });
  it('Testing Functionality', (done) => {
    server
      .post('/weather')
      .send({ phone_number: '+201065781197' })
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.statusCode.should.equal(200);
        res.body.SUCCESS.should.equal(true);
        done();
      });
  });
});
