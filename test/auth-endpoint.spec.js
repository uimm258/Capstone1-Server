
const app = require('../src/app')
const chai = require("chai");

let defaultUser = {
    name: "admin",
    password: "admin@123"
};

let token;

// parent block
describe("Admin", () => {
    beforeEach(done => {
        chai
            .request(app)
            .post("/admin")
            .send(defaultUser)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    beforeEach(done => {
        chai
            .request(app)
            .post("/admin")
            .send(defaultUser)
            .end((err, res) => {
                token = res.body.token;
                res.should.have.status(200);
                done();
            });
    });
    afterEach(done => {
        // After each test we truncate the database
        User.remove({}, err => {
            done();
        });
    });

});