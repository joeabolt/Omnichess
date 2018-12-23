/* Class to create game resources based on a json file */
class Parser 
{
	/**
	 *  Loads a json file in the specified filepath and
	 *  processes it to create a new game that can be run.
	 *  Assumes that the json file has a single object called
	 *  config_data.
	 */
	static Parse(filepath)
	{
		let script = document.createElement('script');
        script.setAttribute("type","text/javascript");
        script.setAttribute("src", filepath);
		document.body.insertBefore(script, document.scripts[0]);
		
		setTimeout(() => {Parser.Load();}, 1000);
	}
	
	static Load()
	{
		console.log(config_data);
	}
}
