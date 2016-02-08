"use strict";


// This software is licensed under a Creative Commons License CC BY 4.0
// by Björn Quast bquast@evolution.uni-bonn.de
// http://creativecommons.org/licenses/by/4.0/
/*
The software uses OpenSeadragon (https://openseadragon.github.io/) provided under copyright by 
    Copyright © 2009 CodePlex Foundation
    Copyright © 2010-2013 OpenSeadragon contributors
according to this license: https://openseadragon.github.io/license/
*/

/*
This work is licensed under the Creative Commons Attribution 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/


// global variables to store viewer_id, viewer_div, viewer
var viewer_id;
var viewer_div;
var viewer;

//global object for image list
var seriesobject = {};



// global object to store window parameters and use them to change visibility and sizes
// margin must be given as numbers only because it is used in calculations in resizedivs 
var window_conf = {
    "openseadragon1": {
	"hidden": false,
	"rel_height": 0.86,
	"rel_width": 0.99,
	//"margin_left": 20
    },
    "pagebar": {
	"hidden": false,
	"rel_height": 0.1,
	"rel_width": 0.99,
	//"margin_left": 20
    }
}


function resizeDivs(event) {


    for (var div in window_conf) {
	var divelement = document.getElementById(div);


// some divelements are not available in fullscreen mode
	if (divelement) {
 

// console.log(divelement);
// console.log(div);


// problem when different parameters are given for height / width or when no parameter is given. need to be fixed

	    if (window_conf[div].abs_height) {
		divelement.style.height = window_conf[div].abs_height;
	    }
	    else if (window_conf[div].rel_height) {
		divelement.style.height = Math.floor(window.innerHeight * window_conf[div].rel_height);
	    }
	    if (window_conf[div].abs_width) {
		divelement.style.width = window_conf[div].abs_width;
	    }
	    else if (window_conf[div].rel_width) {
		divelement.style.width = Math.floor(window.innerWidth * window_conf[div].rel_width);
	    }
	    
	    if (window_conf[div].margin_top) {
		divelement.style.height = Math.floor((window.innerHeight - window_conf[div].margin_top) * 0.98);
		divelement.style["margin-top"] = window_conf[div].margin_top;
	    }
	    if (window_conf[div].margin_bottom) {
		divelement.style.height = Math.floor((window.innerHeight - window_conf[div].margin_bottom) * 0.98);
		divelement.style["margin-bottom"] = window_conf[div].margin_bottom;
	    }
	    
	    
	    if (window_conf[div].margin_left) {
		divelement.style.width = Math.floor((window.innerWidth - window_conf[div].margin_left) * 0.98);
		divelement.style["margin-left"] = window_conf[div].margin_left;
 	    }
	    
	    if (window_conf[div].margin_right) {
		divelement.style.width = Math.floor((window.innerWidth - window_conf[div].margin_right) * 0.98);
		divelement.style["margin-right"] = window_conf[div].margin_right;
	    }
	    
	    if (window_conf[div].hidden == true) {
		divelement.style.display = "none";
	    }
	    else {
		divelement.style.display = "block";
	    }
	}
    }
}




// first the jquery function
// in the moment restricted to show help, about
// start setup
$ (function() { 

    $('#abouttoggle').click(function() {
	$('#aboutwindow').toggle();
    });

    $('#aboutwindow').click(function() {
	$('#aboutwindow').hide();
    });

    setup ();
// replaces
// window.addEventListener("load", setup);

});



function loaderror(event) {
    console.log ("could not read json file");
    alert("could not read json file");
}



function loadimagefile(event) {
    seriesobject = JSON.parse(event.target.responseText);
    
// aufrufe müssen in diese function, da sie sonst vor dem Ende des asynchronen Ladens aufgerufen werden
    initviewer(seriesobject);
    generatescalebar(seriesobject);


//    return seriesobject;
}    

    


function setup() {


    viewer_id = "viewer0";
    
    viewer_div = document.createElement("div");
    viewer_div.setAttribute("id", viewer_id);
    
    var openseadragon_div = document.getElementById("openseadragon1");
    openseadragon_div.appendChild(viewer_div);
    
    
    // add handler for scrolling and zooming
    document.getElementById(viewer_id).addEventListener("mousewheel", mousescroll);
    document.getElementById(viewer_id).addEventListener("DOMMouseScroll", mousescroll);
    
    window.addEventListener("keyup", keyupscroll);
    window.addEventListener("keypress", keypressscroll);
    
    
    // get data for new viewer and init viewer;	
    
    var imagesRequest = new XMLHttpRequest();
    imagesRequest.addEventListener("load", loadimagefile);
    // console.log(seriesobject);
    imagesRequest.addEventListener("error", loaderror);
    
    var imagelistfile = "./series_img/imagelist.json";  
    
    imagesRequest.open("get", imagelistfile);
    imagesRequest.send();
    
    resizeDivs();
    window.addEventListener("resize", resizeDivs);


}
 

//viewer code here



function initviewer(seriesobject) {


//    console.log("readarray");
//    for (var i=0; i < tilesarray.length; i++) {
//	console.log(tilesarray[i]);
//    }


    viewer = OpenSeadragon({
// use the global viewer_id for getting the div to insert the viewer 
	id: viewer_id,
	prefixUrl: "./openseadragon-bin-2.0.0/images/",
	tileSources: seriesobject.tilesarray,
	sequenceMode: true,
	preserveViewport: true,
	immediateRender: true,
	
	//    autoHideControls: false,
	//    showReferenceStrip: true,
	//    referenceStripScroll: 'vertical',
	//    springStiffness: 10,
	
	defaultZoomLevel: 0.5,	
	minZoomLevel: 0.4,
	maxZoomLevel: 20.0,
	
	showNavigator: true,
	gestureSettingsMouse: {
	scrollToZoom: false
	}
    });


    if (seriesobject.tilesarray.length > 2) {
	var startsection = Math.floor(seriesobject.tilesarray.length / 2);	
	viewer.goToPage(startsection);
    }


    setSlideParameter(seriesobject, viewer.currentPage());

}


function setSlideParameter (seriesobject, currentpage) {

//console.log(currentpage);

// some divelements are not available in fullscreen mode
    if (document.getElementById("pagebar")) {


	

	var infobox1;
	var infobox2;
	var actionbox;
	var pagebardiv;

	var slidelabel;
	var distancelabel;

	var slideinfo;
	var distanceinfo;


 
	if (!(document.getElementById("slide"))) {
	    pagebardiv = document.getElementById("pagebar");

	    infobox1 = pagebardiv.appendChild(document.createElement("div")); 
	    infobox1.setAttribute("id", "infobox1");

	    infobox2 = pagebardiv.appendChild(document.createElement("div")); 
	    infobox2.setAttribute("id", "infobox2");

	    var p_medialabel = infobox1.appendChild(document.createElement("p"));
	    p_medialabel.setAttribute("id", "medialabel");
	    p_medialabel.setAttribute("class", "small");
//	    var span_media = p_medialabel.appendChild(document.createElement("span")); 
	    var mediainfo = document.createTextNode("Image series: " + seriesobject.label);
	    p_medialabel.appendChild(mediainfo); 

	    // viewer is the global variable containing the OpenSeadragon viewer
	    var series_id = viewer.id.replace(/viewer_/, ""); 
	    var contributor = seriesobject.contributor;
	    
	    var p_contributor = infobox1.appendChild(document.createElement("p"));
	    p_contributor.setAttribute("id", "mediacontributor");
	    p_contributor.setAttribute("class", "small");
	    var contributorinfo = document.createTextNode("Images by: " +  contributor);
	    p_contributor.appendChild(contributorinfo); 

	    
	    slidelabel = infobox2.appendChild(document.createElement("p"));
	    slidelabel.setAttribute("id", "slide");
	    slidelabel.setAttribute("class", "small");
	    slideinfo = document.createTextNode("");
	    slidelabel.appendChild(slideinfo); 

	    distancelabel = infobox2.appendChild(document.createElement("p"));
	    distancelabel.setAttribute("id", "distance");
	    distancelabel.setAttribute("class", "small");
	    distanceinfo = document.createTextNode("");
	    distancelabel.appendChild(distanceinfo); 


// add slider after SlideParameter view was initialized

	    actionbox = pagebardiv.appendChild(document.createElement("div"));
 	    actionbox.setAttribute("id", "actionbox");

	    var slidebox = actionbox.appendChild(document.createElement("div"));
 	    slidebox.setAttribute("id", "slideme");


// var sliceslider = $(" #slideme ").slider();


	    var showcurrent = $("<div id='slidecurrent'></div>").insertBefore("#slideme").text(currentpage + 1);
//	    var showmin = $("<div id='slidemin'></div>").insertBefore("#slideme").text(1);
//	    var showmax = $("<div id='slidemax'></div>").insertAfter("#slideme").text(seriesobject.tilesarray.length);



	    var slidesslider = $("#slideme").slider({
		min: 0,
		max: seriesobject.tilesarray.length - 1,
		step: 1,
		value: currentpage,
		stop: function(event, ui) {
		    console.log("ui-value: ", ui.value);
		    viewer.goToPage(ui.value);
		    $("#slidecurrent").text(ui.value + 1);
		    updateinfo ();
 		}
	    });
	    updateinfo ();
	}


	else {
	    updateinfo ();
	}
    }
}



function updateinfo () {

    var currentpage = viewer.currentPage();


    var distance;
    if ((seriesobject.section_distances_list) && (seriesobject.section_distances_list.length > 0) && (seriesobject.px_dim_z)) { //take length because an empty array might also be a defined array: "section_distance_list": [], appears to be defined
	distance = parseFloat(seriesobject.section_distances_list[currentpage] * seriesobject.px_dim_z).toFixed(2);
    }
    else if ((seriesobject.real_distances_list) && (seriesobject.real_distances_list.length > 0)) {
	distance = parseFloat(seriesobject.real_distances_list[currentpage]).toFixed(2);
    }
    else if (seriesobject.px_dim_z) {
	distance = parseFloat(currentpage * seriesobject.px_dim_z).toFixed(2);
    }
    else {
	distance = currentpage;
    }
    var distancetext = "Distance: " + distance + seriesobject.px_dim_unit;
    
    var slidepath = seriesobject.tilesarray[currentpage];
    //console.log(slidepath);
    var slidename = slidepath.replace(/.*\/|.dzi/g, "");
    var slidetext = "Section: " + slidename;
    //console.log(slidename);
    
    
    var infobox2 = document.getElementById("infobox2");
    
    var oldslidelabel = document.getElementById("slide");
    var newslidelabel = document.createElement("p");
    newslidelabel.setAttribute("id", "slide");
    newslidelabel.setAttribute("class", "small");
    
    var olddistancelabel = document.getElementById("distance");
    var newdistancelabel = document.createElement("p");
    newdistancelabel.setAttribute("id", "distance");
    newdistancelabel.setAttribute("class", "small");
    
    infobox2.replaceChild(newslidelabel, oldslidelabel);
    var slideinfo = document.createTextNode(slidetext);
    newslidelabel.appendChild(slideinfo); 
    
    infobox2.replaceChild(newdistancelabel, olddistancelabel);
    var distanceinfo = document.createTextNode(distancetext);
    newdistancelabel.appendChild(distanceinfo); 
    
    console.log(currentpage);
    $("#slidecurrent").text(currentpage + 1);
    $("#slideme").slider("value", currentpage);

}



function generatescalebar(seriesobject) { 

var pxinmeter; 

    var factor;
    if (seriesobject.px_dim_unit == "nm") {
	factor = 1000000000;
    }
    if (seriesobject.px_dim_unit == "µm") {
	factor = 1000000;
    }
    if (seriesobject.px_dim_unit == "mm") {
	factor = 1000;
    }
    
    if (seriesobject.px_dim_x) {
	pxinmeter = 1 / seriesobject.px_dim_x * factor;
    }
    else {
	pxinmeter = 1;
    }
    
    if (seriesobject.invertscalebar) {
	viewer.scalebar({
	    pixelsPerMeter: pxinmeter,
	    minWidth: "50px",
	    backgroundColor: "rgba(0, 0, 0, 0.5)",
	    color: "rgb(255, 255, 255)",
	    fontColor: "rgb(255, 255, 255)"
	});
    }
    else {
	viewer.scalebar({

	    pixelsPerMeter: pxinmeter,
	    minWidth: "50px",
	});
    }
}




function keypressscroll(event) {
    var currentpage = viewer.currentPage();

//	console.log("keypressed");

    var zoomdelta = 0;
    var pagedelta = 0;
    var delta = 0;
    var currentpage = viewer.currentPage();


    if ((event.charCode == 43)) {
	zoomdelta = 1;
    }
    else if (event.charCode == 45) {
	zoomdelta = -1;
    }

    else if ((event.keyCode == 39) || (event.keyCode == 34))  {
	pagedelta = 1;
    } 
    else if ((event.keyCode == 37) || (event.keyCode == 33)) {
	pagedelta = -1;
    } 



    if (zoomdelta != 0) {
	delta = Math.pow(2, (zoomdelta * 0.5)); //* 0.5 changes the velocity or stepsize for zooming
	//    var windowsize = viewer.viewport.getWindowsize();
	var position = OpenSeadragon.getMousePosition(event);
//	var newposition = viewer.viewport.windowToViewportCoordinates(position);
//	console.log(position);
//	console.log(delta);
//	console.log("newposition " + newposition);
//	viewer.viewport.zoomBy(delta, newposition);
	viewer.viewport.zoomBy(delta);
        viewer.viewport.applyConstraints();
    }


    else if (pagedelta != 0) {
	viewer.goToPage(currentpage + pagedelta);
    }
    //console.log(event.wheelDelta);
    //console.log(delta);
    //console.log(currentpage + delta);
    event.stopPropagation();
    event.preventDefault();

    setSlideParameter(seriesobject, viewer.currentPage());

//    event.cancelBubble = true;
//    event.cancel = true;
//    event.returnValue = false;
//    return false;
}



function keyupscroll(event) {
    var currentpage = viewer.currentPage();

    var zoomdelta = 0;
    var pagedelta = 0;
    var delta = 0;
    var currentpage = viewer.currentPage();


    if ((event.keyCode == 39) || (event.keyCode == 34))  {
	pagedelta = 1;
    } 
    else if ((event.keyCode == 37) || (event.keyCode == 33)) {
	pagedelta = -1;
    } 


    else if (pagedelta != 0) {
	viewer.goToPage(currentpage + pagedelta);
    }
    event.stopPropagation();
    event.preventDefault();

    setSlideParameter(seriesobject, viewer.currentPage());
}


    

function mousescroll(event) {
 
    var currentpage = viewer.currentPage();
 
//console.log("match");

    var delta = 0;
    var currentpage = viewer.currentPage();


    if ((event.ctrlKey) || (event.altKey)) {
	if (event.wheelDelta) { //IE, Opera
            delta = -event.wheelDelta / 40;
	}
	else if (event.detail) { //Firefox
            delta = event.detail / 3;
	}

	delta = Math.pow(2, (delta * 0.5)); //* 0.5 changes the velocity or stepsize for zooming
	//    var windowsize = viewer.viewport.getWindowsize();
	var position = (OpenSeadragon.getMousePosition(event));
	var newposition = viewer.viewport.windowToViewportCoordinates(position);
	viewer.viewport.zoomBy(delta, newposition);
        viewer.viewport.applyConstraints();
    }

    else {

	if (event.wheelDelta) { //IE, Opera
            delta = Math.floor(-event.wheelDelta / 80);
// fires an event on each mousewheel step? then normalizing delta to 1 or -1 one will be the best solution...
	    delta = (delta >= 0) ? 1 : -1; // if (delta >= 0) {delta = 1;} else {delta = -1;}
	}
	else if (event.detail) { //Firefox
            delta = event.detail / 3;
	}
	viewer.goToPage(currentpage + delta);
	setSlideParameter(seriesobject, viewer.currentPage());
    }
    event.stopPropagation();
    event.preventDefault();

}
