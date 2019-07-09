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

var io = io();
var socket;

window.onload = function(e){
    socket = io.connect();
    socket.on("emit",function(data){
        document.getElementById(data.id).innerHTML = data.value;
    });

    socket.on("timesup",function(data){
        timesup();
    });

    socket.on("reset",function(data){
        notif("#555");
    }); 
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

function timesup(){
    notif("#f00");
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