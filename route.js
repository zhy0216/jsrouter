/**
    Usage:
    app.addRoute("/user/<userid>/", function(){
    console.log("userid:", this.userid);
    }).addRoute("/post/<postid>/", function(){
        console.log("postid:", this.postid);
    }).addRoute("/post/<postid>/comments", function(){
        console.log("comment of post");
    })
    app.startMain("/user/1/"); // >>> userid: 1
    app.startMain("/post/2/"); // >>> postid: 2
    app.startMain("/post/1/comments"); // >>> comment of post


*/

var Route = function(){
    var self = this;

    this._orderDict = new OrderDictionary();

    this.addRoute = function(path, f){
        this._orderDict.put(path, f);
        return this;
    }

    this.startMain = function(path){
        var curPath = path || window.location.pathname;
        var keys = this._orderDict.keys();
        var done = false;
        Array.prototype.forEach.call(keys, function(v){
            if(done){
                return;
            }

            var indexQuestion = v.indexOf("?");
            if(indexQuestion !=-1){
                v = v.substring(0, indexQuestion);
            }

            var carchRe = /<([\w-]+)>/g;
            var matchArrary;
            var obj = new OrderDictionary();
            while((matchArrary = carchRe.exec(v)) != null){
                obj.put(matchArrary[1], null); 
            }

            var reMarch = new RegExp("^" + v.replace(/\//g, "\\/").replace(carchRe, "(\\w+)")+"$");
            var results;
            if((results=reMarch.exec(curPath))!=null){
                for(var i=1, length=results.length, keys=obj.keys(); i < length; i++){
                    obj.put(keys[i-1],results[i]);
                }

                self._orderDict.get(v).bind(obj._dict)();
                done = true;
                return;
            }

        });
    }
}


var OrderDictionary = function(){

    this._dict = {};
    this._keys = []; //key in order
    this.length = 0;

    this.put = function(k, v){
        if(k in this._dict){
            this.remove(k);
            this.put(k,v);

        }else{
            this._dict[k] = v;
            this._keys.push(k);
            this.length ++;
        }

        return this;
    }

    //http://ejohn.org/blog/javascript-array-remove/
    this._key_remove = function(from, to) {
          var rest = this._keys.slice((to || from) + 1 || this._keys.length);
          this._keys.length = from < 0 ? this._keys.length + from : from;
          return Array.prototype.push.apply(this._keys, rest);
    };

    this.remove = function(k){
        if(k in this._dict){
            this._key_remove(this._keys.indexOf(k));
            delete this._dict[k];
        }
    }

    this.get = function(k){
        return this._dict[k];
    }

    this.keys = function(){
        return this._keys;
    }

    this.hasKey = function(k){
        return k in this._dict;
    }
}

//nodejs export

exports.Route = Route;
exports.app = new Route();
