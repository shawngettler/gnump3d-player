/**
 * player.js
 *
 * Audio player with custom DOM controls.
 */



// playlist
var playlist = [];



// player internals
var getPlayer = function() {
    var player = document.getElementById("player");
    player.volume = 0.3;

    player.addEventListener("ended", function() {
        playNextFile();
    });
};



// player controls
var playFiles = function(urls) {
    playlist = urls;
    playNextFile();
};

var enqueueFiles = function(urls) {
    playlist = playlist.concat(urls);
};

var playNextFile = function() {
    var player = document.getElementById("player");
    if(playlist.length > 0) {
        player.pause();
        player.src = playlist.shift();
        player.load();
        player.play();
    }
};



// run
(function(){
    window.addEventListener("load", function() {
        getPlayer();
    });
})();
