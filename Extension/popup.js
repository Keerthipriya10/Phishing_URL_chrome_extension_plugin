var result = {};
function feature_extarction(tablink)
{

	var url = tablink;
	console.log(url);
	var url_Domain = new URL(url);
	var urlDomain = url_Domain.hostname;
	console.log(urlDomain);

var patt = /(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]?[0-9])(\.|$){4}/;
var ip = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;

if(ip.test(urlDomain)||patt.test(urlDomain)){ 
    result["IPAddress"]="1";
}else{
    result["IPAddress"]="-1";
}

//----------------------  URL Length  ----------------------


if(url.length<54){
    result["URL_Length"]="-1";
}else if(url.length>=54&&url.length<=75){
    result["URL_Length"]="0";
}else{
    result["URL_Length"]="1";
}


//----------------------   Tiny URL  ----------------------

var onlyDomain = urlDomain.replace('www.','');

if(onlyDomain.length<7){
    result["Tiny_URL"]="1";
}else{
    result["Tiny_URL"]="-1";
}

//----------------------  @ Symbol  ----------------------

patt=/@/;
if(patt.test(url)){ 
    result["AtSymbol"]="1";
}else{
    result["AtSymbol"]="-1";
}

//----------------------  Redirecting using //  ----------------------

if(url.lastIndexOf("//")>7){
    result["Redirecting"]="1";
}else{
    result["Redirecting"]="-1";
}

//----------------------  (-) Prefix/Suffix in domain  ----------------------

patt=/-/;
if(patt.test(urlDomain)){ 
    result["PrefixSuffix_in_domain"]="1";
}else{
    result["PrefixSuffix_in_domain"]="-1";
}

//---------------------- No. of Sub Domains  ----------------------



if((onlyDomain.match(RegExp('\\.','g'))||[]).length==1){ 
    result["No_of_Sub_Domains"]="-1";
}else if((onlyDomain.match(RegExp('\\.','g'))||[]).length==2){ 
    result["No_of_Sub_Domains"]="0";    
}else{
    result["No_of_Sub_Domains"]="1";
}


//---------------------- HTTPS  ----------------------

patt=/https:\/\//;
if(patt.test(url)){
    result["HTTPS"]="-1";
}else{
    result["HTTPS"]="1";
}



//----------------------  Request URL  ----------------------

var imgTags = document.getElementsByTagName("img");

var phishCount=0;
var legitCount=0;

patt=RegExp(onlyDomain,'g');

for(var i = 0; i < imgTags.length; i++){
    var src = imgTags[i].getAttribute("src");
    if(!src) continue;
    if(patt.test(src)){
        legitCount++;
    }else if(src.charAt(0)=='/' && src.charAt(1)!='/'){
        legitCount++;
    }else{
        phishCount++;
    }
}
var totalCount=phishCount+legitCount;
var outRequest=(phishCount/totalCount)*100;


if(outRequest<22){
    result["RequestURL"]="-1";
}else if(outRequest>=22&&outRequest<61){
    result["RequestURL"]="0";
}else{
    result["RequestURL"]="1";
}

//----------------------   URL of Anchor  ----------------------
var aTags = document.getElementsByTagName("a");
phishCount=0;
legitCount=0;
var allhrefs="";

for(var i = 0; i < aTags.length; i++){
    var hrefs = aTags[i].getAttribute("href");
    if(!hrefs) continue;
    allhrefs+=hrefs+"       ";
    if(patt.test(hrefs)){
        legitCount++;
    }else if(hrefs.charAt(0)=='#'||(hrefs.charAt(0)=='/'&&hrefs.charAt(1)!='/')){
        legitCount++;
    }else{
        phishCount++;
    }
}
totalCount=phishCount+legitCount;
outRequest=(phishCount/totalCount)*100;

if(outRequest<31){
    result["Anchor"]="-1";
}else if(outRequest>=31&&outRequest<=67){
    result["Anchor"]="0";
}else{
    result["Anchor"]="1";
}






//----------------------  Links in script and link  ----------------------
var sTags = document.getElementsByTagName("script");
var lTags = document.getElementsByTagName("link");

phishCount=0;
legitCount=0;

allhrefs="sTags  ";

for(var i = 0; i < sTags.length; i++){
    var sTag = sTags[i].getAttribute("src");
    if(sTag!=null){
        allhrefs+=sTag+"      ";
        if(patt.test(sTag)){
            legitCount++;
        }else if(sTag.charAt(0)=='/'&&sTag.charAt(1)!='/'){
            legitCount++;
        }else{
            phishCount++;
        }
    }
}

allhrefs+="      lTags   ";
for(var i = 0; i < lTags.length; i++){
    var lTag = lTags[i].getAttribute("href");
    if(!lTag) continue;
    allhrefs+=lTag+"       ";
    if(patt.test(lTag)){
        legitCount++;
    }else if(lTag.charAt(0)=='/'&&lTag.charAt(1)!='/'){
        legitCount++;
    }else{
        phishCount++;
    }
}

totalCount=phishCount+legitCount;
outRequest=(phishCount/totalCount)*100;

if(outRequest<17){
    result["ScriptLink"]="-1";
}else if(outRequest>=17&&outRequest<=81){
    result["ScriptLink"]="0";
}else{
    result["ScriptLink"]="1";
}

//---------------------- Server Form Handler ----------------------

var forms = document.getElementsByTagName("form");
var res = "-1";

for(var i = 0; i < forms.length; i++) {
    var action = forms[i].getAttribute("action");
    if(!action || action == "") {
        res = "1";
        break;
    }
	else if(!(action.charAt(0)=="/" || patt.test(action))) {
        res = "0";
    }
}
result["SFH"] = res;

//---------------------- Submitting to mail ----------------------

var forms = document.getElementsByTagName("form");
var res = "-1";

for(var i = 0; i < forms.length; i++) {
    var action = forms[i].getAttribute("action");
    if(!action) continue;
    if(action.startsWith("mailto")) {
        res = "1";
        break;
    }
}
result["mailto"] = res;

//---------------------- Using iFrame ----------------------

var iframes = document.getElementsByTagName("iframe");

if(iframes.length == 0) {
    result["iFrames"] = "-1";
} else {
    result["iFrames"] = "1";
}

}


function transfer(){	
		var tablink;
		chrome.tabs.getSelected(null,function(tab) {
	   	tablink = tab.url;
		$("#p1").text(tablink); 
		result["URL"] = tablink;
		feature_extarction(tablink);
		var xhr=new XMLHttpRequest();
		xhr.open("POST","http://localhost/C_E_NEW_PSO/client_server.php",false);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(result));
		console.log(typeof(xhr.responseText));
		var msg="This site seems dangerous";
		var response = parseInt(xhr.responseText)
		if (response == -1)
		{
			console.log('legitimate');
			msg="You are safe to use";
		}
		$("#div1").text(msg);
		$("#shw").show();
		return xhr.responseText;
	});
}


$(document).ready(function(){
    $("button").click(function(){	
		var val = transfer();
    });
});

chrome.tabs.getSelected(null,function(tab) {
   	var tablink = tab.url;
	$("#p1").text(tablink);
});











