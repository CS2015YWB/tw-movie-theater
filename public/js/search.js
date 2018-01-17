$(document).ready(function () {
   haha();
});

let result=[];

function haha() {
    let urlstr = "http://localhost:3000/sousuo";
    $.get({url: urlstr}, (data, status) => {
        for (let i in data) {
            result.push(data[i]);
        }
    });
}
$(function() {
        $("#search_button").click(()=>{
            let result2=[];
            $("div.searchmovie").remove();
            $("div.xiangxixinxi").remove();
            $.each(result, function (i, item) {
                if ($("#search_text").val()&&result[i].title.indexOf($("#search_text").val()) > '-1') {
                    console.log(item);
                    result2.push(item);
                }
                if(result[i].id==$("#search_text").val()){
                    result2.push(item);
                }
            });
        searchMovie(result2);
    });
});

function searchMovie(arr){
    if(arr.length === 0)
        document.getElementById("error").innerHTML = "<h1></h1>" + "<h2>搜索结果...</h2>" + "<h3 style='align-self: center; color：#585f5c'>" +
            "对不起,未找到您所要查找的" + " 《 " + $("#search_text").val() + " 》 " + "电影" + "</h3>" + "<div style='height:450px;'></div>";
    else
        document.getElementById("error").innerHTML = "<h1></h1>" + "<h2>搜索结果...</h2>";
    for(let i=0;i<arr.length;i++){
        let parent=document.getElementById("searchresult");
        //添加moive_div
        let searchmovie_div=document.createElement("div");
        //设置div属性
        let divid="_"+arr[i].id;
        searchmovie_div.setAttribute(divid,"newDiv");
        searchmovie_div.innerHTML="<div class='searchmovie col-lg-7 col-md-6 col-xs-12'>" +
            "<div class='row' id='xxxxx'><div class='col-lg-2 col-md-3 col-xs-3' id='movieimg"+i+"'></div>" +
            "<div class='col-lg-10 col-md-9 col-xs-9' id='moviedetail"+i+"'></div></div></div>";
        parent.appendChild(searchmovie_div);
        $("#movieimg"+i).append('<img src="'+arr[i].image+'">');
        $("#moviedetail"+i).append("<ul><li><a href='javascript:;' onclick='turnover("+arr[i].id+");' id='moviename"+i+"'></a></li></ul>");
        $("#moviedetail"+i).append("<ul><li id='moviedire"+i+"'>导演：</li></ul>");
        $("#moviedetail"+i).append("<ul><li id='movieactor"+i+"'>主演：</li></ul>");
        $("#moviename"+i).append(arr[i].title);
        $("#moviedire"+i).append(arr[i].directors);
        $("#movieactor"+i).append(arr[i].casts);
    }
}

///用来跳转到详情的html页面
function turnover(idvalue){
    window.open('subject.html?id='+idvalue,"_self");
}