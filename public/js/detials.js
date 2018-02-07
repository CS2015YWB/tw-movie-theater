//ajax请求
window.onload=$(document).ready(function(){
    //得到电影id
    let hrefStr = location.href;
    let idIndex = hrefStr.indexOf("?id=") + 4;
    let id="";
    if(typeof (idIndex+8) === "number"){
        id += hrefStr.substr(idIndex, 8);
    }else{
        id += hrefStr.substr(idIndex,7);
    }
    /*电影的详细信息展示*/
    console.log(id);
    let ip= 'http://localhost:3000/';
    let information_url = ip + 'information?id=' + id;

    $.get(information_url,function(res,status){
        information(res);
    });

    let comment_url = ip + 'comment?id='+ id;
    $.get(comment_url,function (res,status) {
        comment(res);
    });

    let genrating_url = ip + 'genrating?id=' + id;
    $.get(genrating_url,function (res,status) {
        genrating(res);
    });


    let xiangguan_url = ip + 'xiangguan?id=' + id;
    $.get(xiangguan_url,function (res,status) {
        xiangguan(res);
    });

});
function dealBr(string) {//去除\n并改成<br>
    let result = string.replace(/\n/," ");
    result = result.replace(/\n/g, `${`<br>`}`);
    console.log(result);
    return result;
}
function turnover(idvalue) {
    window.location.href='subject.html?id='+idvalue;
}
//得到电影的详细信息
function information(res) {
    console.log(res);
    document.images.image.src = res[0].image;
    document.getElementById("title").innerHTML = res[0].title;
    document.getElementById("directors").innerHTML = res[0].directors;
    document.getElementById("casts").innerHTML = res[0].casts;
    document.getElementById("year").innerHTML = res[0].year;
    document.getElementById("rating").innerHTML = res[0].rating;
    document.getElementById("original_title").innerHTML = res[0].original_title;
    document.getElementById("introduction").innerHTML = dealBr(res[1].introduction);
    document.getElementById("genre").innerText = res[2].genre;
}
//得到评论
function comment(res) {
    console.log(res);
    let html ="";
    for(let i in res){
        html+="<blockquote>"+"<span style='color: blue;font-size: 110%'>"+res[i].user+"</span>"+":"+res[i].content+"</blockquote>";
    }
    document.getElementById("comment").innerHTML = html;
}
//得到排行榜单
function genrating(res) {
    console.log(res);
    let html = "<h3>"+"该类好评"+"</h3>"+"<table width='100%' class='table-striped' style='font-size: 110%;font-style: italic;'>";
    for(let i = 1; i<res.length+1;i++){
        html +="<tr >"+"<a href='javascript:;' onclick='turnover("+res[i-1].id+")'>"+"<th>"+"top"+(i)+"<th>";
        html +="<th>"+res[i-1].title+"</th>";
        html +="<th>"+res[i-1].rating+"</th>"+"</a>"+"</tr>";
    }
    document.getElementById("genrating").innerHTML = html;
}

//得到相关电影
function xiangguan(res) {
    console.log(res);
    let html = "<h3>"+"相关电影"+"</h3>";
    let len = res.length<6?res.length:6;   //判断相似电影是否有留个
    for(let i = 0; i<len;i++){
        html+= "<div class='col-xs-4 col-md-4 col-lg-4' style='height:160px'>"+
            "<a href='javascript:;' onclick='turnover("+res[i].id+")'>"+
            `<img height='80%' src='${res[i].image}' alt='${res[i].title}'>`+
            "<p style='text-align: center;font-size: 60%; margin-top: 5px'>"+res[i].title+
            "</p>"+"</a>"+"</div>";
    }
    document.getElementById("xiangguan").innerHTML = html;
}

