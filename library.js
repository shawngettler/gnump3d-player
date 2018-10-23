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

var createFolderElement = function(e, name, urls) {
    var f = document.createElement("div");
    f.classList.add("music");
    f.classList.add("music-folder");
    e.appendChild(f);

    var b = document.createElement("button");
    b.classList.add("music-button");
    b.title="Expand";
    f.appendChild(b);

    var c = document.createElement("i");
    c.classList.add("material-icons");
    c.innerText = "arrow_right";
    b.appendChild(c);

    createListingElement(f, name, urls);

    var g = document.createElement("div");
    g.classList.add("music-folder-contents");
    g.style.display = "none";
    e.appendChild(g);

    f.addEventListener("click", function() {
        if(g.style.display === "block") {
            g.style.display = "none";
            b.title = "Expand";
            c.innerText = "arrow_right"
        } else {
            g.style.display = "block";
            b.title = "Collapse";
            c.innerText = "arrow_drop_down";
        }
    });

    return g;
};

var createFileElement = function(e, name, urls) {
    var f = document.createElement("div");
    f.classList.add("music");
    f.classList.add("music-file");
    e.appendChild(f);

    createListingElement(f, name, urls);
};

var createListingElement = function(e, name, urls) {
    var s = document.createElement("span");
    s.classList.add("music-title");
    s.appendChild(document.createTextNode(window.decodeURIComponent(name)));
    e.appendChild(s);

    if(urls.length > 1) {
        var t = document.createElement("span");
        t.classList.add("music-description");
        t.appendChild(document.createTextNode(urls.length+" songs"));
        e.appendChild(t);
    }

    var b = document.createElement("button");
    b.classList.add("music-button");
    b.style.setProperty("visibility", "hidden");
    b.title="Play";
    e.appendChild(b);

    var c = document.createElement("i");
    c.classList.add("material-icons");
    c.innerText = "play_arrow";
    b.appendChild(c);

    b.addEventListener("click", function(evt) {
        evt.stopPropagation();
        playFiles(urls);
    });

    var g = document.createElement("button");
    g.classList.add("music-button");
    g.style.setProperty("visibility", "hidden");
    g.title="Enqueue";
    e.appendChild(g);

    var h = document.createElement("i");
    h.classList.add("material-icons");
    h.innerText = "playlist_add";
    g.appendChild(h);

    g.addEventListener("click", function(evt) {
        evt.stopPropagation();
        enqueueFiles(urls);
    });

    e.addEventListener("mouseover", function() {
        b.style.setProperty("visibility", "visible");
        g.style.setProperty("visibility", "visible");
    });
    e.addEventListener("mouseout", function() {
        b.style.setProperty("visibility", "hidden");
        g.style.setProperty("visibility", "hidden");
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
