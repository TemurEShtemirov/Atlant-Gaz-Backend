import express from 'express'

async function boostrap()  {
    const app = express()

    app.listen(3044,()=>{
        console.log('Ok');
    })
}

boostrap()