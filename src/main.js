/* Initial script */

const game = Parser.Parse("./src/config/test01.js");

const realizer = new Realizer(game);

setInterval(() => {realizer.Realize();}, 500);