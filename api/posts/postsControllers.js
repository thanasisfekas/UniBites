require('dotenv').config();
const express = require("express");
const appRouter = express.Router();
const pool  = require("../../db.js");
const sdk = require("node-appwrite");
const {InputFile} = require('node-appwrite/file');
const multer =  require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const client = new sdk.Client()
    .setEndpoint(process.env.API_ENDPOINT)
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.API_KEY);

const cloudstorage = new sdk.Storage(client);

// appRouter.delete('delete',)


appRouter.get('/meals' , async (req,res)=>{
    let meals = (await pool.query("SELECT * from listing where poster= ? ",[req.session.usr_id]))[0];
    const lst_id = meals.map(meal=> meal.lst_id);
    
    const req_count = (await pool.query("SELECT count(rq_id),lst_id from requests where lst_id in(?) group by lst_id" , [lst_id]))[0].reduce((acc,curr)=>{
        acc[curr.lst_id] = curr['count(rq_id)'];
        return acc;
    },{});

    const req_info = (await pool.query("SELECT requests.std_id,lst_id,usr_username ,created_at  from requests join user on requests.std_id = user.usr_id where status='PENDING' and lst_id IN(?)",[lst_id]))[0].reduce((acc,curr)=>{
        if(!acc[curr.lst_id]) acc[curr.lst_id] =[];
        acc[curr.lst_id].push([curr.usr_username , curr.created_at]);
        return acc;
    },{});

    const requests  = Object.entries(req_info).reduce((acc,curr)=>{
        acc[curr[0]] ={
            count : req_count[curr[0]],
            info: curr[1]
        };
        return acc;
    },{});

    const tags = (await pool.query('SELECT mtag_type,lst_id FROM lst_has_meal_tag JOIN meal_tag on lst_has_meal_tag.mtag_id = meal_tag.mtag_id where lst_has_meal_tag.lst_id IN (?)',[lst_id]))[0].reduce((acc,curr)=>{
        if(!acc[curr.lst_id])
            acc[curr.lst_id] =[];
        acc[curr.lst_id].push(curr.mtag_type);
        return acc;
    },{});

    const pickup_windows = (await pool.query('SELECT lst_id,pickup_start,pickup_end from pickup_window WHERE lst_id IN (?)',[lst_id]))[0].reduce((acc,curr)=>{
        if(!acc[curr.lst_id])
            acc[curr.lst_id] = [];
        acc[curr.lst_id].push([curr.pickup_start,curr.pickup_end]);
        return acc;
    },{});

    const allergens = (await pool.query('SELECT allerg_type,lst_id FROM lst_has_allergens JOIN allergens on lst_has_allergens.allerg_id=allergens.allerg_id where lst_has_allergens.lst_id in (?)',[lst_id]))[0].reduce((acc,curr)=>{
        if(!acc[curr.lst_id])
            acc[curr.lst_id] = [];
        acc[curr.lst_id].push(curr.allerg_type);
        return acc;
    },{});


    let images =await  cloudstorage.listFiles(process.env.BUCKET_ID);
    const fileIdRegex =new RegExp(`^(${lst_id.join('|')})_.*`);
    images = images.files.filter((img)=> fileIdRegex.test(img.$id));
    
    images = images.reduce((acc,curr)=>{
        const meal = curr.$id.split('_')[0];
        acc[meal] = `${process.env.API_ENDPOINT}/storage/buckets/${process.env.BUCKET_ID}/files/${curr.$id}/view?project=${process.env.PROJECT_ID}`;
        return acc;
    });


    meals = meals.map(meal=>{
        return {
            ...meal,
            requests:requests[meal.lst_id] ?? 0,
            tags: tags[meal.lst_id] ?? [],
            pickup_windows: pickup_windows[meal.lst_id]?.map(window =>
                ({   
                    start:window[0],
                    end :window[1]
                })
            ) ?? [],
            allergens : allergens[meal.lst_id] ?? [],
            imgUrl : images[meal.lst_id] ?? ''
        }
    });

    
    res.status(200).json({status:"READY-MEALS",body:meals});
});






module.exports = appRouter;