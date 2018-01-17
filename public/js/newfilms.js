/*影讯：显示正在上映的电影（最新电影）*/
window.onload=$(document).ready(function(){
    let hrefStr = location.href;
    let idIndex = hrefStr.indexOf("?id=") + 4;
    let id = '';
    if(typeof (idIndex+8) =="number"){
        id = hrefStr.substr(idIndex, 8);
    }else{
        id = hrefStr.substr(idIndex,7);
    }

    let newfilms_ip = 'http://localhost:3000/newfilms'
    let newfilms_url = newfilms_ip;
    $.get(newfilms_url,function (res,status) {
        console.log(res);
        let html = "";
        for(let i=0; i<12; i++){
            html += "<div class='col-md-2 poster' style='height: 220px; text-align: center;'>"
                 + "<a href='javascript:;' onclick='turnover("+res[i].id+")'>";
            html += `<img src='${res[i].image}' style='height: 80%'>` +
                "<p style='margin-top: 8px; margin-bottom:5px; text-align: center'>"
                 +res[i].title+"</p>"+"</a>"+"</div>";
        }
        document.getElementById("newfilms").innerHTML = html;
    });

    let highscorefilms_ip = 'http://localhost:3000/highscorefilms'
    let highscorefilms_url = highscorefilms_ip;
    $.get(highscorefilms_url,function (res,status) {
        console.log(res);
        let html = "";
        for(let i=0; i<12; i++){
            html += "<div class='col-md-2 poster' style='height: 220px; text-align: center;'>"
                + "<a href='javascript:;' onclick='turnover("+res[i].id+")'>";
            html += `<img src='${res[i].image}' style='height: 80%'>` +
                "<p style='margin-top: 8px; margin-bottom:5px; text-align: center'>"
                +res[i].title+"</p>"+"</a>"+"</div>";
        }
        document.getElementById("highscorefilms").innerHTML = html;
    });
});

function turnover(id) {
    window.open('subject.html?id='+id,"_self");
}
