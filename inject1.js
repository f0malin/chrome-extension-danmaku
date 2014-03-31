amplify.request.define( "danmu_receive", "ajax", {
    url: "http://www.hukaa.com/chrome_danmu/receive",
    dataType: "text",
    type: "GET"
});


$(document).ready(function() {
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
var danmu_speed = [1, 1, 1, 1, 1];

function switchDiv(state) {
    if (state == "ON") {
        $("body").append('<div id="chrome_danmu_outter" style="text-align:center;border-top:1px solid blue;padding-top:5px;width:100%;position:fixed;bottom:0px;height:30px;z-index:9999;background-color:white"> <form id="chrome_danmu_form"><input id="chrome_danmu_input" type="text" style="min-width:160px;width:60%;border:1px solid blue;" /> <input style="background:blue;color:white;padding:2px;" type="submit" value="发送"/></form> </div>');
        $("body").append('<div id="chrome_danmu_show" style="position:fixed;top:0px;z-index:9998"></div>');
        for (var i=0; i< danmu_speed.length; i++) {
            $("#chrome_danmu_show").append('<div id="chrome_danmu_div_'+i+'" style="position:relative;left:0px;font-weight:bold;">aaaaa</div>');
        }
        intervalId = setInterval(function() {

            for (var i=0;i<danmu_speed.length;i++) {
                var div = $('#chrome_danmu_div_' + i);
                console.log(div.css("left"));
                div.css("left", (parseInt(div.css("left")) - danmu_speed[i]) + "px");
            }
        }, 50);
        $("#chrome_danmu_form").submit(function() {
            console.log(window.location);
            console.log("message: " + $("#chrome_danmu_input").val());
            amplify.request(
                "danmu_receive",
               {
                   message: $("#chrome_danmu_input").val(),
                   url: window.location.href,
                   uid: localStorage.uid
                }, function( data ) {
                    if (!localStorage.uid) {
                        localStorage.uid = data;
                    }
                    console.log("data: " + data);
                }
            );
            $("#chrome_danmu_input").val("");
            return false;
        });
    } else {
        $("#chrome_danmu_outter").remove();
        $("#chrome_danmu_show").remove();
        clearInterval(intervalId);
    }
}

