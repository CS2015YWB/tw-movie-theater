///分页添加各类别的电影
function showClassifyMovieByPagination(name,page,totalpage){
    $(document).ready(function(){
        let urlstr="http://localhost:3000/movies/searchByGenreName/?genrename="+name;
        $.get({url:urlstr},(data,status)=>{
            console.log(data);
            $("div.movie").remove();
            addMovieByClassifyAndPage(data,page,totalpage);
        });
    });
}
////分页添加全部电影
function showAllMovieByPagination(page,totalpage){
    $(document).ready(function(){
        let urlstr="http://localhost:3000/movies";
        $.get({url:urlstr},(data,status)=>{
            console.log(data);
            $("div.movie").remove();
            addMovieByClassifyAndPage(data,page,totalpage);
        });
    });
}
///通过分类和页数获取电影信息
function addMovieByClassifyAndPage(arr,page,totalpage) {
    ///对前page-1页进行布局
    if (page < totalpage) {
        let i = 9;
        let d = page - 1;
        for (let j = 0; j < 9; j++) {
            i = 9;
            let parent = document.getElementById("showmovie");
            //添加moive_div
            let movie_div = document.createElement("div");
            //设置div属性
            i = parseInt(i * d + j);
            let divid = "_" + arr[i].id;
            movie_div.setAttribute(divid, "newDiv");
            movie_div.innerHTML = "<div class='movie col-lg-4 col-md-6 col-xs-12'>" +
                "<div class='row' id='xxxxx'><div class='col-lg-3 col-md-3 col-xs-3' id='imgimg" + i + "'></div>" +
                "<div class='col-lg-9 col-md-9 col-xs-9' id='detail" + i + "'></div></div></div>";
            parent.appendChild(movie_div);
            //$("#imgimg").append(imgadd);
            $("#imgimg" + i).append('<img src="' + arr[i].image + '">');
            $("#detail" + i).append("<ul><li><a href='javascript:;' onclick='turnover("+arr[i].id+");' id='nnname" + i + "'></a></li></ul>");
            $("#detail" + i).append("<ul><li id='dddire" + i + "'>导演：</li></ul>");
            $("#detail" + i).append("<ul><li id='aaactor" + i + "'>主演：</li></ul>");
            $("#nnname" + i).append(arr[i].title);
            $("#dddire" + i).append(arr[i].directors);
            $("#aaactor" + i).append(arr[i].casts);
        }
    }///最后一页
    if(page == totalpage) {
        for (let i = parseInt((page - 1) * 9); i < arr.length; i++) {
            let parent = document.getElementById("showmovie");
            //添加moive_div
            let movie_div = document.createElement("div");
            //设置div属性
            let divid = "_" + arr[i].id;
            movie_div.setAttribute(divid, "newDiv");
            movie_div.innerHTML = "<div class='movie col-lg-4 col-md-6 col-xs-12'>" +
                "<div class='row' id='xxxxx'><div class='col-lg-3 col-md-3 col-xs-3' id='imgimg" + i + "'></div>" +
                "<div class='col-lg-9 col-md-9 col-xs-9' id='detail" + i + "'></div></div></div>";
            parent.appendChild(movie_div);
            let imgadd = '<img src="' + arr[i].image + '">';
            //$("#imgimg").append(imgadd);
            $("#imgimg" + i).append('<img src="' + arr[i].image + '">');
            $("#detail" + i).append("<ul><li><a href='javascript:;' onclick='turnover("+arr[i].id+");' id='nnname" + i + "'></a></li></ul>");
            $("#detail" + i).append("<ul><li id='dddire" + i + "'>导演：</li></ul>");
            $("#detail" + i).append("<ul><li id='aaactor" + i + "'>主演：</li></ul>");
            $("#nnname" + i).append(arr[i].title);
            $("#dddire" + i).append(arr[i].directors);
            $("#aaactor" + i).append(arr[i].casts);
        }
    }
}
///用来跳转到详情的html页面
function turnover(idvalue){
    window.open('subject.html?id='+idvalue);
}
///根据标签获取具体分类包含的页数
function getPageNum(arr){
    let num=arr.length;
    if(num<=9) num=1;
    else num=parseInt(1+parseInt(num/9));
    return num;
}
//进行分页
function pagination(name,arr,pagenum){
    // $("li.fenyediv").remove();///fenyeByClassify(name,urlstr,page,totalpage)
    $("#innerfenye").append("<li class='fenyediv' id='page1'>" +
        "<a id='xixi1' name='"+name+"' href='javascript:;' onclick=showClassifyMovieByPagination(this.name,1,"+pagenum+")>1</a>" +
        "</li>");
    $('#xixi1').trigger("click");
    for(let i=2;i<pagenum+1;i++){
        $("#innerfenye").append("<li class='fenyediv' id='page"+i+"'>" +
            "<a id='xixi" + i +" ' name='"+name+"' href='javascript:;' onclick=showClassifyMovieByPagination(this.name,"+i+","+pagenum+")>"+i+"</a>" +
            "</li>");
    }
}
////分页产生器
function producePagination(name){
    $("li.fenyediv").remove();
    $("div.movie").remove();
    $(document).ready(function(){
        let urlstr="http://localhost:3000/movies/searchByGenreName/?genrename="+name;
        $.get({url:urlstr},(data,status)=>{
            console.log(data);
            let pagenum=getPageNum(data);
            console.log(pagenum);
            pagination(name,data,pagenum);
        });
    });

}
////对全部形式的电影进行分页
function producePaginationForAllMovie(){
    $("li.fenyediv").remove();
    $("div.movie").remove();
    $(document).ready(function(){
        let urlstr="http://localhost:3000/movies";
        $.get({url:urlstr},(data,status)=>{
            let pagenum=getPageNum(data);
            $("#innerfenye").append("<li class='fenyediv' id='page1'>" +
                "<a id='xixi1' name='"+name+"' href='javascript:;' onclick=showAllMovieByPagination(1,"+pagenum+")>1</a>" +
                "</li>");
            $('#xixi1').trigger("click");
            for(let i=2;i<pagenum+1;i++){
                $("#innerfenye").append("<li class='fenyediv' id='page"+i+"'>" +
                    "<a id='xixi" + i +" ' name='"+name+"' href='javascript:;' onclick=showAllMovieByPagination("+i+","+pagenum+")>"+i+"</a>" +
                    "</li>");
            }
        })
    })
}
///显示分类标签
function addMovieClassify(arr){
    for(let i=0;i<arr.length;i++){
        let parent=document.getElementById("abq");
        //添加li
        let clali=document.createElement("li");
        //设置li属性
        let liid="_"+arr[i].id;
        clali.innerHTML="<li id='"+liid+"'></li>";
        parent.appendChild(clali);
        $("#"+liid).append("<a href='javascript:;'onclick=producePagination('"+arr[i].name+"')>"+arr[i].name+"</a >");
    }
}
//获得分类标签
function getAllClassify(){
    $(document).ready(function(){
        let urlstr="http://localhost:3000/moviegenre";
        $.get({url:urlstr},(data,status)=>{
            addMovieClassify(data);
        });
    });
}