//thanks to https://github.com/bigeasy/signal
;(function (definition) {
  if (typeof module == "object" && module.exports) module.exports = definition();
  else if (typeof define == "function") define(definition);
  else this.tz = definition();
}) (function(){

    var Route = function(){
        "use strict";
        var self = this;

        this._orderDict = new OrderDictionary();

        this.addRoute = function(path, f){
            this._orderDict.put(path, f);
            return this;
        };

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

                var catchRe = /<([\w-]+)>/g;
                var matchArrary;
                var obj = new OrderDictionary();
                while((matchArrary = catchRe.exec(v)) !== null){
                    // console.log(matchArrary)
                    obj.put(matchArrary[1], null); 
                }

                var reMarch = new RegExp("^" + v.replace(/\//g, "\\/").replace(catchRe, "([\\w-]+)")+"$");
                // console.log(reMarch)
                var results;
                if((results=reMarch.exec(curPath)) !== null){
                    for(var i=1, length=results.length, keys=obj.keys(); i < length; i++){
                        // console.log(keys)
                        // console.log(results)
                        obj.change(keys[i-1],results[i]);
                    }

                    self._orderDict.get(v).bind(obj._dict)();
                    done = true;
                    return;
                }

            });
        };
    };


    var OrderDictionary = function(){
        "use strict";

        this._dict = {};
        this._keys = []; //key in order
        this.length = 0;

        // this method will change the order
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
        };

        // this method will not change the order
        this.change = function(k, v){
            if(! k in this._dict){
                
                this._keys.push(k);
                this.length ++;
            }
            this._dict[k] = v;
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
        };

        this.get = function(k){
            return this._dict[k];
        };

        this.keys = function(){
            return this._keys;
        };

        this.hasKey = function(k){
            return k in this._dict;
        };
    };

    return { Route: Route, app: new Route() };

});
