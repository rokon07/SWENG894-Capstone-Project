import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import request from 'supertest';
import sinon from 'sinon';
const chai = await import('chai');
const { expect } = chai;

const db = await import('../routes/db-config.js');
const poll = await import('../controllers/poll.js');
import express from 'express';

// Setup the express app for testing
const app = express();
app.use(express.json());
app.post('/api/poll', poll.default);

describe('POST /api/poll', () => {
    let dbQueryStub;

    beforeEach(() => {
        dbQueryStub = sinon.stub(db.default, 'query');
    });

    afterEach(() => {
        dbQueryStub.restore();
    });

    it('should return error if required fields are missing', (done) => {
        request(app)
            .post('/api/poll')
            .send({
                title: 'Test Poll',
                admin_email: 'admin@example.com',
                // Missing deadline, age, and candidates
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).to.equal('error');
                expect(res.body.error).to.include('Please provide all required fields');
                done();
            });
    });

    it('should create a poll and return success message', (done) => {
        const pollId = 1;
        const candidates = ['Candidate 1', 'Candidate 2'];

        // Mock the database insert responses
        dbQueryStub.onFirstCall().resolves([{ insertId: pollId }]);
        dbQueryStub.onSecondCall().resolves();

        request(app)
            .post('/api/poll')
            .send({
                title: 'Test Poll',
                admin_email: 'admin@example.com',
                deadline: '2024-12-31',
                age: 18,
                polltype: 'Public',
                enableAnonymous: true,
                candidates: candidates
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).to.equal('success');
                expect(res.body.success).to.include('Poll has been created successfully');
                done();
            });
    });

    it('should create a private poll and return success message with poll code', (done) => {
        const pollId = 1;
        const candidates = ['Candidate 1', 'Candidate 2'];
        const generatedCode = 'ABC123';

        sinon.stub(crypto, 'randomBytes').returns(Buffer.from('abc123'));

        // Mock the database insert responses
        dbQueryStub.onFirstCall().resolves([{ insertId: pollId }]);
        dbQueryStub.onSecondCall().resolves();

        request(app)
            .post('/api/poll')
            .send({
                title: 'Test Poll',
                admin_email: 'admin@example.com',
                deadline: '2024-12-31',
                age: 18,
                polltype: 'Private',
                enableAnonymous: true,
                candidates: candidates
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).to.equal('success');
                expect(res.body.success).to.include(`Poll has been created successfully! Poll Code: ${generatedCode}`);
                crypto.randomBytes.restore();
                done();
            });
    });

    it('should handle internal server errors', (done) => {
        // Mock a database error
        dbQueryStub.rejects(new Error('Database error'));

        request(app)
            .post('/api/poll')
            .send({
                title: 'Test Poll',
                admin_email: 'admin@example.com',
                deadline: '2024-12-31',
                age: 18,
                polltype: 'Public',
                enableAnonymous: true,
                candidates: ['Candidate 1', 'Candidate 2']
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
