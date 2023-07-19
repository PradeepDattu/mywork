const mongoose=require("mongoose")

const servicesMainSchema=mongoose.Schema({
    smname:{type:String,required:true},
    image:{type:String,required:true},
    description:{type:String,require:true},
    sdescription:{type:String,require:true}
})

const ServicesMainModel=mongoose.model("servicesMain",servicesMainSchema)

module.exports={
    ServicesMainModel
}