"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const db_1 = __importDefault(require("./loaders/db"));
// Connect Database
db_1.default();
app.use(express.json());
// Define Routes
app.use("/test", require("./api/test"));
app.use("/post", require("./api/post"));
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "production" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
app
    .listen(5000, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: 5000 🛡️
    ################################################
  `);
})
    .on("error", (err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map