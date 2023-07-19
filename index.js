const  express=require("express")
const Connect=require("./Config/Config")
const app=express()
const {ServicesMain} = require("./Route/ServicesMain")
const {ServicesSub} = require("./Route/ServicesSub")
const {Event} =require("./Route/EventBooking")
const {Appointment}=require("./Route/Appointment")
const {UsersRoute}=require("./Route/Users")
const {AdminRoute}=require("./Route/Admin")
const {pancham} =require("./Route/Panchanm")
const {Horo} =require("./Route/Horoscope")
const cors=require("cors")
app.use(express.json())
app.use(
    cors({
        origin:"*",
    })
) 

app.use("/main",ServicesMain) 
app.use("/sub",ServicesSub)
app.use("/event",Event)
app.use("/appointment",Appointment)
app.use("/pncha",pancham)
app.use("/users",UsersRoute)
app.use("/admin",AdminRoute)
app.use("/horo",Horo)

app.listen(8080,async(req,res)=>{
    try{
     await Connect
     console.log("Server Running PORT 8080")
    }
    catch{
        console.log("Server Error")
    }
})