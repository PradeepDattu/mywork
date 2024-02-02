const express = require("express");
const Connect = require("./Config/Config");
const app = express();
const bodyParser = require("body-parser");
const { ServicesMain } = require("./Route/ServicesMain");
const { ServicesSub } = require("./Route/ServicesSub");
const { Event } = require("./Route/EventBooking");
const { Appointment } = require("./Route/Appointment");
const { UsersRoute } = require("./Route/Users");
const { GalleryRoute } = require("./Route/Gallery");
const { AdminRoute } = require("./Route/Admin");
const { pancham } = require("./Route/Panchanm");
const { Horo } = require("./Route/Horoscope");
const { RevenueRoute } = require("./Route/Revenue");
const { YoutubeRoute } = require("./Route/Youtube");
const cors = require("cors");
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use("/main", ServicesMain);
app.use("/sub", ServicesSub);
app.use("/event", Event);
app.use("/appointment", Appointment);
app.use("/pncha", pancham);
app.use("/users", UsersRoute);
app.use("/admin", AdminRoute);
app.use("/horo", Horo);
app.use("/gallery", GalleryRoute);
app.use("/revenue", RevenueRoute);
app.use("/youtube", YoutubeRoute);



app.listen(8080, async (req, res) => {
  try {
    await Connect;
    console.log("Server Running PORT 8080");
  } catch {
    console.log("Server Error");
  }
});
