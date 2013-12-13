var assert = require("assert");

var Route = require("./route").Route;

describe('Route', function(){
    var app = new Route();
    var result = 0;

    app.addRoute("/user/<userid>/", function(){
        result = this.userid;
    }).addRoute("/post/<postid>/", function(){
        result = this.postid;
    }).addRoute("/post/<postid>/comments", function(){
        result = this.postid;
    });

    describe('#startMain()', function(){
        it("should run each route function", function(){
            app.startMain("/user/1/");
            assert.equal(result, "1");
            app.startMain("/post/2/");
            assert.equal(result, "2");
            app.startMain("/post/1/comments");
            assert.equal(result, "1");
        });

    });


});








