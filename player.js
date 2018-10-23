/**
 * player.js
 *
 * Audio player with custom DOM controls.
 */



// playlist
var playlist = [];



// player controls
var playFiles = function(urls) {
    playlist = urls;
};

var enqueueFiles = function(urls) {
    playlist = playlist.concat(urls);
};
