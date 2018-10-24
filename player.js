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



// create DOM player controls
var createControlsElement = function() {
    var player = document.getElementById("player");
    var parentElem = document.getElementById("controls");

    var playBtnElem = document.createElement("button");
    playBtnElem.classList.add("controls-button");
    playBtnElem.id = "controls-playbutton";
    playBtnElem.title = "Play";
    parentElem.appendChild(playBtnElem);

    var playIconElem = document.createElement("i");
    playIconElem.classList.add("material-icons");
    playIconElem.innerText = "play_arrow";
    playBtnElem.appendChild(playIconElem);

    playBtnElem.addEventListener("click", function() {
        if(player.paused && player.src != "") {
            player.play();
        } else {
            player.pause();
        }
    });
    player.addEventListener("play", function() {
        playIconElem.innerText = "pause";
        playBtnElem.title = "Pause";
    });
    player.addEventListener("pause", function() {
        playIconElem.innerText = "play_arrow";
        playBtnElem.title = "Play";
    });

    var skipBtnElem = document.createElement("button");
    skipBtnElem.classList.add("controls-button");
    skipBtnElem.id = "controls-nextbutton";
    skipBtnElem.title = "Next Track";
    parentElem.appendChild(skipBtnElem);

    var skipIconElem = document.createElement("i");
    skipIconElem.classList.add("material-icons");
    skipIconElem.innerText = "skip_next";
    skipBtnElem.appendChild(skipIconElem);

    skipBtnElem.addEventListener("click", function() {
        playNextFile();
    });

    var trackElem = document.createElement("div");
    trackElem.id = "controls-track";
    parentElem.appendChild(trackElem);

    var nameElem = document.createElement("span");
    nameElem.id = "controls-name";
    nameElem.appendChild(document.createTextNode("\u200b")); // empty
    trackElem.appendChild(nameElem);

    var progressElem = document.createElement("div");
    progressElem.id = "controls-progress";
    trackElem.appendChild(progressElem);

    var timeElem = document.createElement("div");
    timeElem.id = "controls-currenttime";
    timeElem.style.setProperty("width", "0");
    progressElem.appendChild(timeElem);

    player.addEventListener("timeupdate", function() {
        var t = player.currentTime/player.duration*100;
        timeElem.style.setProperty("width", t+"%");
    });
    player.addEventListener("ended", function() {
        timeElem.style.setProperty("width", "0");
    });

    var muteBtnElem = document.createElement("button");
    muteBtnElem.classList.add("controls-button");
    muteBtnElem.id = "controls-mutebutton";
    muteBtnElem.title = "Mute";
    parentElem.appendChild(muteBtnElem);

    var muteIconElem = document.createElement("i");
    muteIconElem.classList.add("material-icons");
    muteIconElem.innerText = "volume_up";
    muteBtnElem.appendChild(muteIconElem);

    muteBtnElem.addEventListener("click", function() {
        if(player.muted) {
            player.muted = false;
            muteIconElem.innerText = "volume_up";
            muteBtnElem.title = "Mute";
        } else {
            player.muted = true;
            muteIconElem.innerText = "volume_off";
            muteBtnElem.title = "Unmute";
        }
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
        document.getElementById("controls-name").innerText = window.decodeURIComponent(player.src.split(/\//g).pop());
    }
};



// run
(function(){
    window.addEventListener("load", function() {
        getPlayer();
        createControlsElement();
    });
})();
