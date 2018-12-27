/* Initial script */

const game = Parser.Parse("./src/config/test01.js");
console.log(game);

const realizer = new Realizer(game);

setInterval(() => {realizer.Realize();}, 500);