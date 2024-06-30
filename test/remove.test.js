import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import express from 'express';
import removePoll from '../controllers/removePoll.js'; // Adjust the path as necessary
import db from '../routes/db-config.js'; // Adjust the path as necessary

// Setup the express app for testing
const app = express();
app.use(express.json());
app.post('/api/removePoll', removePoll);

describe('POST /api/removePoll', () => {
    let dbQueryStub;

    beforeEach(() => {
        dbQueryStub = sinon.stub(db, 'query');
    });

    afterEach(() => {
        dbQueryStub.restore();
    });

    it('should return error if pollId is missing', (done) => {
        request(app)
            .post('/api/removePoll')
            .send({})
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).to.equal('error');
                expect(res.body.error).to.include('Poll ID is required.');
                done();
            });
    });

    it('should remove poll and related data successfully', (done) => {
        dbQueryStub.onFirstCall().resolves();
        dbQueryStub.onSecondCall().resolves();
        dbQueryStub.onThirdCall().resolves();

        request(app)
            .post('/api/removePoll')
            .send({ pollId: 1 })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).to.equal('success');
                expect(res.body.success).to.include('Poll and related data have been removed successfully!');
                done();
            });
    });

    it('should handle internal server errors', (done) => {
        dbQueryStub.rejects(new Error('Database error'));

        request(app)
            .post('/api/removePoll')
            .send({ pollId: 1 })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.status).to.equal('error');
                expect(res.body.error).to.include('An error occurred while removing the poll.');
                done();
            });
    });
});
