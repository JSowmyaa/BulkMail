const express = require ("express")
const cors = require ("cors")
const XLSX = require ("xlsx")

const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://sowmyaa:123@sowmyaa.u9juo.mongodb.net/passkey?retryWrites=true&w=majority&appName=Sowmyaa").then(()=>{
    console.log("Connected to DataBase")
}).catch(()=>{
    console.log("Failed to connect DataBase")
})

const credential = mongoose.model("credential",{},"bulkmail")






app.post("/sendemail",function(req,res){

    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then((data)=>{
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
              user: data[0].toJSON().user,
              pass: data[0].toJSON().pass,
            }
          });
          
          new Promise(async function (resolve,reject){
            try{
                for(let i=0; i<emailList.length; i++)
                    {
                     await transporter.sendMail(
                        {
                            from:"jsowmyaa17@gmail.com",
                            to:emailList[i],
                            subject: "A message from Bulk Mail App",
                            text:msg 
                        }
                    ) 
                    console.log("Email send to : " + emailList[i])
                }
                resolve("sucessfull")
            }
            catch(error){
                reject("failed")
            }
        })
        .then(function(){
            res.send(true)
        })
        .catch(function(){
            res.send(false)
        })
    })
    
    .catch((error)=>{
        console.log(error)
    })
    
})

app.listen(5000,function(){
    console.log("server started...")
})