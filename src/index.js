'use strict'

let express = require('express');
let orm = require('orm');
let app = express();
const cors =  require('cors');
const database = "/home/yanwenbo/Desktop/tw-movie-theater/src/movies.db";

app.use(cors());


//``需要用这个，而不是字符串的单引号
app.use(orm.express(`sqlite://${database}`,{
    define:function(db, models,next){
        models.Movie = db.define("movie", {
            //id: String,
            title : String,
            alt : String,
            year : String,
            rating : String,
            original_title : String,
            directors : String,
            casts : String,
            image : String
        });
        models.Genre = db.define("genre",{
            //id:String,
            name : String
        });

        models.Movie_genre = db.define("movie_genre",{
            movie_id : String,
            genre_id : String
        });

        models.Comment = db.define("comment",{
            movie_id : String,
            user : String,
            content : String
        });

        models.Introduction = db.define("introduction",{
            movie_id : String,
            content : String
        });
        next();
    }}));

//返回最新电影
app.get('/newfilms', function (req, res) {
    req.models.Movie.find({}, 50,[ "year", "Z" ],function (err, movie) {
        console.log(movie);
        res.send(movie);
    });
});
//返回高分电影
app.get('/highscorefilms', function (req, res) {
    req.models.Movie.find({}, 50,[ "rating", "Z" ],function (err, movie) {
        console.log(movie);
        res.send(movie);
    });
});

//搜索
app.get('/sousuo',function (req, res) {
    req.models.Movie.find({},function (err, movie) {
        if(err) return console.log(err);
        res.send(movie);
    });
});

///返回分类信息
app.get("/moviegenre",function (req, res) {
    req.models.Genre.find(function (err, movie_genre) {
        if(err) console.log(err);
        res.send(movie_genre);
    })
});

//按类别id返回排名前20的电影
app.get("/movies/searchByGenreid",function(req,res){
    let genreid=req.query.genreid;
    req.models.Movie_genre.find({genre_id:genreid},function(err,movie_genre){
        if(err)console.log(err);
        res.send(movie_genre);
        console.log(res);

    });
});
///根据分类名返回相关电影
app.get("/movies/searchByGenreName",(req,res)=>{
    let genrename=req.query.genrename;
    req.models.Genre.find({name:genrename},(err,genre)=>{
        if(err) console.log(err);
        let genreid=genre.map(i => i.id);
        req.models.Movie_genre.find({genre_id:genreid},(err,movie_genre)=>{
            if(err) console.log(err);
            console.log(res);
            let movieinfo=movie_genre.map(i => i.movie_id);
            req.models.Movie.find({id:movieinfo},(err,movie)=>{
                if(err) console.log(err);
                res.send(movie);

            });
        });
    });
});

//返回所有电影的信息
app.get("/movies",function(req,res){
    req.models.Movie.find(function(err,movie){
        if(err) console.log(err);
        res.send(movie);
    });
});

//返回电影详细信息
app.get('/information', function (req,res) {
    let movie_id = req.query.id;
    req.models.Movie.find({id: movie_id}, function (err, movie) {
        if (err) return console.log(err);
        let genreList = movie;
        req.models.Introduction.find({movie_id:movie_id},function (err,movie) {
            if(err) return console.log(err);
            genreList.push({"introduction":movie[0].content});
            //获取电影的类型并处理成字符串
            req.models.Movie_genre.find({movie_id: movie_id}, function (err, movie) {
                if (err) return console.log(err);
                let genreId = [];
                for (let genre_id in movie) {
                    genreId.push(movie[genre_id].genre_id);
                }
                //
                req.models.Genre.find({id: genreId}, function (err, movie) {
                    if (err) return console.log(err);
                    console.log(genreId);
                    let genre = " ";
                    for (let i in movie) {
                        genre += movie[i].name;
                        if (i < movie.length - 1) {
                            genre += " / ";
                        }
                    }
                    genreList.push({"genre":genre});
                    console.log(genreList);
                    let data = JSON.stringify(genreList);
                    res.send(genreList);
                });
            });
        });
    });
});

//评论
app.get('/comment',function (req,res) {
    let movie_id = req.query.id;
    req.models.Comment.find({movie_id:movie_id},function(err,movie){
        if(err) return console.log(err);
        console.log(movie);
        res.send(movie);
    });
});

//返回该类电影排行
app.get("/genrating", function (req,res) {
    let movie_id = req.query.id;
    req.models.Movie_genre.find({movie_id:movie_id},function (err,movie_genre) {
        if(err)  return console.log(err);
        let genreId = [];
        for (let genre_id in movie_genre) {
            genreId.push(movie_genre[genre_id].genre_id);
        }
        req.models.Movie_genre.find({genre_id:genreId},function (err,movie) {
            if(err) return console.log(err);
            let movieList = [];
            if(genreId.length === 1){//如果只有一个类型，那就返回该类型的电影
                for (let i in movie){
                    movieList.push(movie[i].movie_id);
                }
            }else{//如果这里有两种类型其以上的，先返回两种类型共有的，接着返回只有一种类型的
                let typeOne = [];
                let typeTwo = [];
                for(let i in movie){
                    if(movie[i].genre_id === genreId[0]){
                        typeOne.push(movie[i]);
                    }else if(genreId.length>=1 && movie[i].genre_id === genreId[1]){
                        typeTwo.push(movie[i]);
                    }
                }
                for(let i in typeOne){
                    for(let j in typeTwo){
                        if(typeOne[i].movie_id === typeTwo[j].movie_id){
                            if(typeOne[i].movie_id !== movie_id){
                                movieList.push(typeOne[i].movie_id);
                            }
                            typeOne.splice(i,1);
                            typeTwo.splice(j,1);
                        }
                    }
                }
                for(let i in typeOne){
                    movieList.push(typeOne[i].movie_id);
                }
                for(let i in typeTwo){
                    movieList.push(typeTwo[i].movie_id);
                }
                console.log(movie_id);
                let num = parseInt(movie_id);//转换格式
                movieList.splice(movieList.indexOf(num),1);//delete the movie_id
            }
            req.models.Movie.find({id:movieList},10,["rating",'Z'],function (err,movie) {
                //console.log(movie);
                res.send(movie);
            });
        })
    })

});

// 返回相关电影
app.get("/xiangguan",function (req, res) {
    let movie_id = req.query.id;
    req.models.Movie_genre.find({movie_id:movie_id},function (err,movie_genre) {
        if(err)  return console.log(err);
        let genreId = [];
        for (let genre_id in movie_genre) {
            genreId.push(movie_genre[genre_id].genre_id);
        }
        req.models.Movie_genre.find({genre_id:genreId},function (err,movie) {
            if(err) return console.log(err);
            let movieList = [];
            if(genreId.length === 1){//如果只有一个类型，那就返回该类型的电影
                for (let i in movie){
                    movieList.push(movie[i].movie_id);
                }
            }else{//如果这里有两种类型其以上的，先返回两种类型共有的，接着返回只有一种类型的
                let typeOne = [];
                let typeTwo = [];
                for(let i in movie){
                    if(movie[i].genre_id === genreId[0]){
                        typeOne.push(movie[i]);
                    }else if(genreId.length>=1 && movie[i].genre_id === genreId[1]){
                        typeTwo.push(movie[i]);
                    }
                }
                for(let i in typeOne){
                    for(let j in typeTwo){
                        if(typeOne[i].movie_id === typeTwo[j].movie_id){
                            if(typeOne[i].movie_id !== movie_id){
                                movieList.push(typeOne[i].movie_id);
                            }
                            typeOne.splice(i,1);
                            typeTwo.splice(j,1);
                        }
                    }
                }
                for(let i in typeOne){
                    movieList.push(typeOne[i].movie_id);
                }
                for(let i in typeTwo){
                    movieList.push(typeTwo[i].movie_id);
                }
                console.log(movie_id);
                let num = parseInt(movie_id);//转换格式
                movieList.splice(movieList.indexOf(num),1);//delete the movie_id
            }
            req.models.Movie.find({id:movieList},function (err,movie) {
                //console.log(movie);
                res.send(movie);
            });
        })
    })

});

//测试文件，连接成功
app.listen(3000,() => {
    console.log("running on port 3000...");
});
