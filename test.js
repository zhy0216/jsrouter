var Route = require("./route").Route;


var app = new Route();

app.addRoute("/user/<userid>/", function(){
    console.log("userid:", this.userid);
}).addRoute("/post/<postid>/", function(){
    console.log("postid:", this.postid);
}).addRoute("/post/<postid>/comments", function(){
    console.log("comment of post");
})
app.startMain("/user/1/");
app.startMain("/post/2/");
app.startMain("/post/1/comments");

