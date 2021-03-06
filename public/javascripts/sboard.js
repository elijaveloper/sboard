var v_away_points = 0;
var v_home_points = 0;
var v_time = 10 * 60 * 1000;; //in milliseconds
var v_time_timer;
var v_time_paused = false;
var v_shot = 24 * 1000; //in milliseconds
var v_shot_timer;
var v_shot_paused = false;
var v_away_fouls = 0;
var v_home_fouls = 0;
var v_qtr = 1;

var v_default_time = 10 * 60 * 1000;
var v_default_shot = 24 * 1000;
var v_timer_speed = 100;
var v_timer_skipms = 300;
var v_timer_delta = 0;

var io = io();
var socket;

window.onload = function(e){
    socket = io.connect();
}

var v_times = {
    "time":v_time,
    "shot":v_shot
}

var v_timers = {
    "time":v_time_timer,
    "shot":v_shot_timer
}

var v_pauses = {
    "time":v_time_paused,
    "shot":v_shot_paused
}

var v_default_times = {
    "time":v_default_time,
    "shot":v_default_shot
}

var v_points = {
    "away_points":v_away_points,
    "home_points":v_home_points,
    "home_fouls":v_home_fouls,
    "away_fouls":v_away_fouls,
    "qtr":v_qtr
}

function points(id,p){
    v_points[id] += p;
    if(v_points[id] <= 0){
        v_points[id] = 0;
    }
    let temp = v_points[id];
    if(id == "qtr"){
        v_points[id] = v_points[id] >= 4 ? 4 : v_points[id];
        v_points[id] = v_points[id] <= 1 ? 1 : v_points[id];
        temp = ordinal(temp);
    }
    document.getElementById(id).innerHTML = temp;
    socket.emit("emit",{
        id:id,
        value:temp
    });
}

function start(id){
    v_timers[id] = setInterval(function(){
        if(!v_pauses[id]){
            if(v_times[id] <= 0){
                timesup(id);
            }else{
                v_times[id] -= v_timer_speed;
                v_timer_delta += v_timer_speed;
                if(v_timer_delta >= v_timer_skipms){
                    socket.emit("emit",{
                        id:id,
                        value:mtm(v_times[id])
                    });
                    v_timer_delta = 0;
                }
            }
            document.getElementById(id).innerHTML = mtm(v_times[id]);
        }
    }, v_timer_speed);
    document.getElementById(id+"_start").style.display = "none";
    document.getElementById(id+"_pause").style.display = "inline-block";
    document.getElementById(id+"_stop").style.display = "inline-block";
    document.getElementById(id+"_reset").style.display = "inline-block";
}

function pause(id){
    v_pauses[id] = !v_pauses[id];
    document.getElementById(id+"_pause").innerHTML = v_pauses[id] ? "resume" : "pause";
}

function stop(id){
    var a = confirm("Stop the timer?");
    if(a){
        clearInterval(v_timers[id]);
    }
    return a;
}

function reset(id){
    var a = confirm("Reset the timer?");
    if(a){
        clearInterval(v_timers[id]);
        document.getElementById(id+"_start").style.opacity=1;
        v_times[id] = v_default_times[id];
        v_pauses[id] = false;
        document.getElementById(id).innerHTML = mtm(v_times[id]);
        socket.emit("emit",{
            id:id,
            value:mtm(v_times[id])
        });
        socket.emit("reset",{});
        document.getElementById(id+"_start").style.display = "inline-block";
        document.getElementById(id+"_pause").style.display = "none";
        document.getElementById(id+"_stop").style.display = "none";
        document.getElementById(id+"_reset").style.display = "none";
        notif("#555");
    }
}

function shotclock(id){
    v_times[id] = v_default_times[id];
    document.getElementById(id).innerHTML = mtm(v_times[id]);
}

function shotclock14(){
    let a = confirm("Reset the shotclock to 14 seconds?");
    if(a){
        v_times["shot"] = 14000;
        document.getElementById("shot").innerHTML = mtm(v_times["shot"]);
    }
}

function timesup(id){
    clearInterval(v_timers[id]);
    for(var i=0; i<10; i++){
        socket.emit("timesup",{
            id:id
        });
    }
    notif("#f00")
}

function notif(color){
    document.getElementById("notif").style.borderColor = color;
}

//helper functions
function mtm(milli)
{
      var milliseconds = (milli % 1000) / 100;
      var seconds = Math.floor((milli / 1000) % 60);
      var minutes = Math.floor((milli / (60 * 1000)) % 60);

      return (minutes == 0 ? "" : minutes) + (minutes == 0 ? "" : ":") + seconds + "." + milliseconds;
}

function ordinal(num){
    let o = ["15t","2nd","3rd","4th"];
    num = num >= 4 ? 4 : num;
    num = num <= 1 ? 1 : num;
    return o[num-1];
}