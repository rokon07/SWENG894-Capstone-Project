import { expect } from 'chai';
import sinon from 'sinon';
import db from '../routes/db-config.js';
import updateWinners from '../controllers/updateWinners.js';

describe('updateWinners', () => {
    let dbQueryStub;

    beforeEach(() => {
        dbQueryStub = sinon.stub(db, 'query');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should log a message when no polls are found with past deadlines and no winner', async () => {
        dbQueryStub.resolves([[]]);

        const consoleLogStub = sinon.stub(console, 'log');

        await updateWinners();

        expect(consoleLogStub.calledWith('No polls found with past deadlines and no winner.')).to.be.true;
    });

    it('should log a message when no candidates are found for a poll', async () => {
        dbQueryStub.onFirstCall().resolves([[{ id: 1 }]]);
        dbQueryStub.onSecondCall().resolves([[]]);

        const consoleLogStub = sinon.stub(console, 'log');

        await updateWinners();

        expect(consoleLogStub.calledWith('No candidates found for poll ID 1')).to.be.true;
    });

    it('should update the winner for a poll', async () => {
        dbQueryStub.onFirstCall().resolves([[{ id: 1 }]]);
        dbQueryStub.onSecondCall().resolves([[{ name: 'Candidate 1', votes: 10 }]]);
        dbQueryStub.onThirdCall().resolves();

        const consoleLogStub = sinon.stub(console, 'log');

        await updateWinners();

        expect(dbQueryStub.calledWith('UPDATE polls SET winner = ? WHERE id = ?', ['Candidate 1', 1])).to.be.true;
        expect(consoleLogStub.calledWith('Updated winner for poll ID 1: Candidate 1')).to.be.true;
    });

    it('should log an error if an exception occurs', async () => {
        const error = new Error('Something went wrong');
        dbQueryStub.rejects(error);

        const consoleErrorStub = sinon.stub(console, 'error');

        await updateWinners();

        expect(consoleErrorStub.calledWith('Error updating winners:', error)).to.be.true;
    });
});
