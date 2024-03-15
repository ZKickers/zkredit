const request = require('supertest');
const app = require('../app/server'); // Assuming your server file is named server.js or app.js

// Use dynamic import for Chai
import('chai').then(chai => {
  const { expect } = chai;

  describe('POST /auth/signup', () => {
    it('should create a new user and return a success message', (done) => {
      const userData = {
        username: 'testuser222',
        email: 'testuser2222@example.com',
        password: 'Test@12223111', 
      };

      request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal('User created successfully');
          done();
        });
    });

    it('should return an error if username is missing', (done) => {
      const userData = {
        email: 'testuser@example.com',
        password: 'Test@123',
      };

      request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });

  });
}).catch(error => {
  console.error('Error importing Chai:', error);
});
