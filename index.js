const { app } = require("./app");
const { viewRoutes } = require("./src/utils/serviceRouter");

app.listen(process.env.APP_PORT || 3000, () => {
    viewRoutes(app, process.env.APP_PORT || 3000);
});
