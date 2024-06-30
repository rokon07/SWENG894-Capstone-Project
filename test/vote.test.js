import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import crypto from 'crypto';
import express from 'express';
import vote from '../controllers/vote.js'; 
import db from '../routes/db-config.js'; 

const app = express();
app.use(express.json());
app.post('/api/vote', vote);

describe('POST /api/vote', () => {
    let dbQueryStub;

    beforeEach(() => {
        dbQueryStub = sinon.stub(db, 'query');
    });

    afterEach(() => {
        dbQueryStub.restore();
    });

    it('should return error if required fields are missing', (done) => {
        request(app)
            .post('/api/vote')
            .send({
                pollId: 1,
                // Missing candidateId, candidateName, userId, userEmail
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).to.equal('error');
                expect(res.body.error).to.include('Please select a candidate.');
                done();
            });
    });

    it('should return error if user is not found', (done) => {
        dbQueryStub.onFirstCall().resolves([{ enable_anonymous: 0 }]);
        dbQueryStub.onSecondCall().resolves([]);

        request(app)
            .post('/api/vote')
            .send({
                pollId: 1,
                candidateId: 1,
                candidateName: 'Candidate 1',
                userId: 1,
                userEmail: 'user@example.com'
            })
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).to.equal('error');
                expect(res.body.error).to.include('User not found.');
                done();
            });
    });

    it('should return error if user has already voted', (done) => {
        dbQueryStub.onFirstCall().resolves([{ enable_anonymous: 0 }]);
        dbQueryStub.onSecondCall().resolves([{ dob: '2000-01-01', gender: 'Male', race: 'Asian' }]);
        dbQueryStub.onThirdCall().resolves([{ user_id: 1 }]);

        request(app)
            .post('/api/vote')
            .send({
                pollId: 1,
                candidateId: 1,
                candidateName: 'Candidate 1',
                userId: 1,
                userEmail: 'user@example.com'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).to.equal('error');
                expect(res.body.error).to.include('You have already voted in this poll!');
                done();
            });
    });

    it('should submit a vote successfully', (done) => {
        dbQueryStub.onFirstCall().resolves([{ enable_anonymous: 0 }]);
        dbQueryStub.onSecondCall().resolves([{ dob: '2000-01-01', gender: 'Male', race: 'Asian' }]);
        dbQueryStub.onThirdCall().resolves([]);

        request(app)
            .post('/api/vote')
            .send({
                pollId: 1,
                candidateId: 1,
                candidateName: 'Candidate 1',
                userId: 1,
                userEmail: 'user@example.com'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).to.equal('success');
                expect(res.body.success).to.include('Your vote has been submitted!');
                done();
            });
    });

    it('should handle internal server errors', (done) => {
        dbQueryStub.rejects(new Error('Database error'));

        request(app)
            .post('/api/vote')
            .send({
                pollId: 1,
                candidateId: 1,
                candidateName: 'Candidate 1',
                userId: 1,
                userEmail: 'user@example.com'
            })
            .expect(500)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).to.equal('error');
                expect(res.body.error).to.include('Internal server error');
                done();
            });
    });
});
