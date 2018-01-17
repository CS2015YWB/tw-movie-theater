
function show(num)
{
    for(var i=1; i<=5; i++)
    {
        document.getElementById("d"+i).style.display="none";
    }
    document.getElementById("d"+num).style.display="block";
}