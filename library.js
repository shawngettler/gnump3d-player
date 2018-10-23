/*
 * library.js
 *
 * File library from GNUMP3d recursive folder listing.
 */



// data
var library = {};



// build library data
var buildLibrary = function(root, path, url) {
    var i = path.shift();
    if(path.length > 0) {
        root[i] = root[i] || {};
        buildLibrary(root[i], path, url);
    } else {
        root[i] = url;
    }
};

var recurseLibrary = function(root, tracks) {
    tracks = tracks || [];
    for(var i in root) {
        if(typeof root[i] === "string") {
            tracks.push(root[i]);
        } else {
            recurseLibrary(root[i], tracks);
        }
    }
    return tracks;
};



// create DOM listing
var buildListing = function(root, e) {
    e = e || document.getElementById("library");
    var l = [];
    for(var i in root) {
        if(typeof root[i] === "string") {
            l.push(i);
        } else {
            buildListing(root[i], createFolderElement(e, i, recurseLibrary(root[i])));
        }
    }
    for(var i of l) {
        createFileElement(e, i, [root[i]]);
    }
};

var createFolderElement = function(parentElem, name, urls) {
    var folderElem = document.createElement("div");
    folderElem.classList.add("music");
    folderElem.classList.add("music-folder");
    parentElem.appendChild(folderElem);

    var expandBtnElem = document.createElement("button");
    expandBtnElem.classList.add("music-button");
    expandBtnElem.title="Expand";
    folderElem.appendChild(expandBtnElem);

    var expandIconElem = document.createElement("i");
    expandIconElem.classList.add("material-icons");
    expandIconElem.innerText = "arrow_right";
    expandBtnElem.appendChild(expandIconElem);

    createListingElement(folderElem, name, urls);

    var contentsElem = document.createElement("div");
    contentsElem.classList.add("music-folder-contents");
    contentsElem.style.display = "none";
    parentElem.appendChild(contentsElem);

    folderElem.addEventListener("click", function() {
        if(contentsElem.style.display === "block") {
            expandBtnElem.title = "Expand";
            expandIconElem.innerText = "arrow_right";
            contentsElem.style.display = "none";
        } else {
            expandBtnElem.title = "Collapse";
            expandIconElem.innerText = "arrow_drop_down";
            contentsElem.style.display = "block";
        }
    });

    return contentsElem;
};

var createFileElement = function(parentElem, name, urls) {
    var fileElem = document.createElement("div");
    fileElem.classList.add("music");
    fileElem.classList.add("music-file");
    parentElem.appendChild(fileElem);

    createListingElement(fileElem, name, urls);
};

var createListingElement = function(parentElem, name, urls) {
    var titleElem = document.createElement("span");
    titleElem.classList.add("music-title");
    titleElem.appendChild(document.createTextNode(window.decodeURIComponent(name)));
    parentElem.appendChild(titleElem);

    if(urls.length > 1) {
        var descElem = document.createElement("span");
        descElem.classList.add("music-description");
        descElem.appendChild(document.createTextNode(urls.length+" songs"));
        parentElem.appendChild(descElem);
    }

    var playBtnElem = document.createElement("button");
    playBtnElem.classList.add("music-button");
    playBtnElem.style.setProperty("visibility", "hidden");
    playBtnElem.title="Play";
    parentElem.appendChild(playBtnElem);

    var playIconElem = document.createElement("i");
    playIconElem.classList.add("material-icons");
    playIconElem.innerText = "play_arrow";
    playBtnElem.appendChild(playIconElem);

    playBtnElem.addEventListener("click", function(evt) {
        evt.stopPropagation();
        playFiles(urls);
    });

    var enqueueBtnElem = document.createElement("button");
    enqueueBtnElem.classList.add("music-button");
    enqueueBtnElem.style.setProperty("visibility", "hidden");
    enqueueBtnElem.title="Enqueue";
    parentElem.appendChild(enqueueBtnElem);

    var enqueueIconElem = document.createElement("i");
    enqueueIconElem.classList.add("material-icons");
    enqueueIconElem.innerText = "playlist_add";
    enqueueBtnElem.appendChild(enqueueIconElem);

    enqueueBtnElem.addEventListener("click", function(evt) {
        evt.stopPropagation();
        enqueueFiles(urls);
    });

    parentElem.addEventListener("mouseover", function() {
        playBtnElem.style.setProperty("visibility", "visible");
        enqueueBtnElem.style.setProperty("visibility", "visible");
    });
    parentElem.addEventListener("mouseout", function() {
        playBtnElem.style.setProperty("visibility", "hidden");
        enqueueBtnElem.style.setProperty("visibility", "hidden");
    });
};



// request list of files
var getLibrary = function() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
        var tracks = xhr.response.split(/\n/g).filter(t=>t!="");
        var href = window.location.href;
        for(var i = 0; i < tracks.length; i++) {
            var path = tracks[i].replace(href, "").replace(".mp3", "").split(/\//g);
            buildLibrary(library, path, tracks[i]);
        }
        buildListing(library);
    });
    xhr.open("GET", "recurse.m3u", true);
    xhr.send();
};



// run
(function(){
    window.addEventListener("load", function() {
        getLibrary();
    });
})();
