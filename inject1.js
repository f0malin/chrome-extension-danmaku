var j = jQuery.noConflict();

amplify.request.define( "danmu_receive", "ajax", {
    url: "http://www.hukaa.com/chrome_danmu/receive",
    dataType: "text",
    type: "GET"
});

amplify.request.define( "danmu_get", "ajax", {
    url: "http://www.hukaa.com/chrome_danmu/get",
    dataType: "json",
    type: "GET"
});


j(document).ready(function() {
    console.log(window.innerWidth + "x" + window.innerHeight);
    // ask the init state
    chrome.runtime.sendMessage({ask_state: true}, function(response) {
        switchDiv(response.plugin_switch);
    });
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switchDiv(request.plugin_switch);
    });

});

var intervalId;
var cm;
var danmu_arr = [];
var last_timestamp = 0;
var colors = [
    "#0000A0",
    "#0000FF",
    "#00FF00",
    "#00FFFF",
    "#020202",
    "#0F80FF",
    "#1400FF",
    "#2380FF",
    "#2800FF",
    "#282828",
    "#2B002B",
    "#2F2F2F",
    "#321932",
    "#3780FF",
    "#3C00FF",
    "#400080",
    "#4B80FF",
    "#4F4F4F",
    "#5000FF",
    "#5F80FF",
    "#6400FF",
    "#643264",
    "#666666",
    "#6A006A",
    "#6F6F6F",
    "#7380FF",
    "#7800FF",
    "#8000FF",
    "#808080",
    "#8080C0",
    "#8080FF",
    "#80FF00",
    "#80FF80",
    "#8780FF",
    "#8C00FF",
    "#964B96",
    "#969696",
    "#999999",
    "#9B80FF",
    "#A000FF",
    "#AA00AA",
    "#AAAA55",
    "#AF80FF",
    "#B400FF",
    "#B4B4B4",
    "#B6B6B6",
    "#BBBBBB",
    "#BFBF40",
    "#C0C0C0",
    "#C380FF",
    "#C480C4",
    "#C480FF",
    "#C800FF",
    "#C864C8",
    "#CC0000",
    "#D2D2D2",
    "#D5D52B",
    "#D6D6D6",
    "#D780FF",
    "#D90000",
    "#DC00FF",
    "#EA0000",
    "#EA00EA",
    "#EAEA15",
    "#EB80FF",
    "#F000FF",
    "#F6F6F6",
    "#FF0000",
    "#FF00FF",
    "#FF10FF",
    "#FF20FF",
    "#FF2BFF",
    "#FF30FF",
    "#FF40FF",
    "#FF50FF",
    "#FF55FF",
    "#FF60FF",
    "#FF70FF",
    "#FF8000",
    "#FF80C0",
    "#FF80FF",
    "#FF96FF",
    "#FFA0FF",
    "#FFAFFF",
    "#FFC8FF",
    "#FFFF00",
    "#FFFF80",
];

function switchDiv(state) {
    if (state == "ON") {
        j("body").append('<div id="chrome_danmu_outter" style="text-align:center;border-top:1px solid blue;padding-top:5px;width:100%;position:fixed;bottom:0px;height:30px;z-index:9999;background-color:white"> <form id="chrome_danmu_form"><input id="chrome_danmu_input" type="text" style="min-width:160px;width:60%;border:1px solid blue;" /> <input style="background:blue;color:white;padding:2px;" type="submit" value="发送"/></form> </div>');
        j("body").append('<div id="chrome_danmu_show" style="position:fixed;top:0px;width:100%;bottom:35px;z-index:9998" class="abp"><div class="container" id="commentCanvas" style="height:100%"></div></div>');
        cm = new CommentManager($('commentCanvas'));
        cm.init();
        cm.startTimer();
        intervalId = setInterval(function() {
            var danmu = danmu_arr.shift();
            if (danmu) {
                cm.sendComment({ text: danmu.message, mode: Math.ceil(Math.random()*6), stime: 1000, dbid: new Date().getTime % 3600, size:Math.ceil(15+Math.random()*30), color: colors[Math.floor(Math.random()*colors.length)], shadow: (Math.random()>0.5?true:false)});
                last_timestamp = danmu.create_at;
            } else {
                amplify.request(
                    "danmu_get",
                    {
                        url: window.location.href,
                        timestamp: last_timestamp
                    }, function(data) {
                        danmu_arr = data.reverse();
                    }
                );
                    
            }
        }, 1000);

        
        j("#chrome_danmu_form").submit(function() {
            console.log(window.location);
            console.log("message: " + j("#chrome_danmu_input").val());
            amplify.request(
                "danmu_receive",
               {
                   message: j("#chrome_danmu_input").val(),
                   url: window.location.href,
                   uid: localStorage.uid
                }, function( data ) {
                    if (!localStorage.uid) {
                        localStorage.uid = data;
                    }
                    console.log("data: " + data);
                }
            );
            j("#chrome_danmu_input").val("");
            return false;
        });
    } else {
        j("#chrome_danmu_outter").remove();
        j("#chrome_danmu_show").remove();
        clearInterval(intervalId);
        if (cm) {
            cm.stopTimer();
            cm = null;
        }
    }
}

