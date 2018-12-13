/* Initial script */

/* load other scripts */
function loadjs(filename)
{
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", filename);
}

// Order matters - prerequisites before their dependents
var scriptsToLoad = ["Component.js", "Vector.js"];

scriptsToLoad.forEach(loadjs);

var alpha = new Vector(1, 2);
var beta = new Component(1, 1, false, false, false);