document.body.bgColor='red';
var theHTML = document.getElementsByTagName('html')[0].innerHTML;
var theText = theHTML.replace(/<(?:.|\n)*?>/gm, '');
alert(theText);
alert(strip(theHTML));
function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}

