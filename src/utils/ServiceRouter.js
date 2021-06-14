const Table = require("cli-table");
const colors = require("colors");
const interfaces = require("os").networkInterfaces();

module.exports = class ServicesRouter {
  static getIpAddress() {
    for (var devName in interfaces) {
      var iface = interfaces[devName];

      for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (
          alias.family === "IPv4" &&
          alias.address !== "127.0.0.1" &&
          !alias.internal
        )
          return alias.address;
      }
    }
    return "0.0.0.0";
  }
  static viewRoutes(express, port) {
    let table = new Table({
      head: [
        colors.white.bold("Methods"),
        colors.white.bold("Paths"),
        colors.white.bold("ON"),
      ],
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
      , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
      , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
      , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
      style: { 'padding-left': 5, 'padding-right': 5}
    });
    let routes = [];
    express._router.stack.forEach((middleware) => {
      if (middleware.route) routes.push(middleware.route);
      else if (middleware.name === "router")
        middleware.handle.stack.forEach((handler) =>
          routes.push(handler.route)
        );
    });
    routes.forEach((router) => {
      table.push([
        Object.keys(router.methods),
        `http://${ServicesRouter.getIpAddress()}:${port}${router.path}`,
        colors.brightGreen.underline(Object.values(router.methods).toString()),
      ]);
    });
    console.log("");
    console.log("App running at:");
    console.log(`- listening port: ${port}`);
    console.log(
      "- Local: " + `http://localhost:${port}`.green.underline,
      "(Ctrl + Click)"
    );
    console.log(
      "- Network: " +
      `http://${ServicesRouter.getIpAddress()}:${port}`.green.underline,
      "(Ctrl + Click)"
    );
    console.log("- Press Ctrl + C again to force".red);
    console.log("- By: " + "Bruno Xavier".random);
    console.log(table.toString());
  }
}
