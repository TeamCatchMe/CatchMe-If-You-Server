import express = require("express");
const app = express();
import connectDB from "./loaders/db";

connectDB();
app.use(express.json());

// Define Routes
app.use("/user", require("./api/user"));
app.use("/main", require("./api/main"));
app.use("/maincard", require("./api/maincard"));
app.use("/activity", require("./api/activity"));
app.use("/report", require("./api/report"));
app.use("/character", require("./api/character"));
app.use("/other", require("./api/other"));
app.use("/setting", require("./api/setting"));
app.use("/test", require("./api/dbtest"));

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
