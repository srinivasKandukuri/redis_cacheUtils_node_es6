import express from "express";
import async from 'async';

const app = express();
const PORT = process.env.PORT || 3000;


app.get('/',function(res,req){
    res.sendStatus(200).send({
        success:true
    })
});  

app.listen(PORT, function () {
    console.log('app listening on port', PORT);
});

export { app }