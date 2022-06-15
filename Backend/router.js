const express=require('express')
const router=express.Router()

router.get('/',(req,res)=>{

    res.send("Akash Is Ready to build Chat App")
})

//Now exports it
module.exports=router

