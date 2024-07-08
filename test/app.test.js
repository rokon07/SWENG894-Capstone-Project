import request from 'supertest';
import jwt from 'jsonwebtoken';
import { expect } from 'chai';
import express from 'express';

let app;

before(async () => {
    app = (await import('../index.js')).default;
});

describe('GET /', () => {
    it('should render the index page with status loggedOut if no token is present', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.include('loggedOut');
                done();
            });
    });

    it('should render the index page with status loggedIn if token is valid', (done) => {
        const token = jwt.sign({ id: 1, username: 'testuser' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        request(app)
            .get('/')
            .set('Cookie', `userRegistered=${token}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.include('loggedIn');
                expect(res.text).to.include('testuser');
                done();
            });
    });
});

describe('GET /register', () => {
    it('should render the register page', (done) => {
        request(app)
            .get('/register')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.include('Register');
                done();
            });
    });
});

describe('GET /login', () => {
    it('should render the login page', (done) => {
        request(app)
            .get('/login')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.include('Login');
                done();
            });
    });
});
