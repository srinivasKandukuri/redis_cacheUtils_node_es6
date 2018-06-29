"use strict";

import redis from 'redis';
import async from 'async';

class CacheUtils{

    constructor(){
        let client 	= null;         
    }

   async getClient(){
        const port = process.env.REDIS_PORT;
        const url = process.env.REDISCLOUD_URL || "127.0.0.1:6378";
        if(!this.client){
            this.client =  await redis.createClient(url);
        }
        return this.client;
    }


    async getCache(key){
        try{
            let client = await this.getClient();
            let data = await client.get(key);
            console.log(data);
            //data.then((data)=>{
             //   return JSON.parse(res);
            //})
        } catch(err){
            console.error(`Failed to retrieve results: ${err.message}`);
            throw err;
        }
        
    }


    async setCache(key, dataset){
        let client = await this.getClient();
        let data = await client.setex(key, 100, JSON.stringify(dataset));
        data.then((data)=>{
            return JSON.parse(res);
        })
    }


    
}


module.exports = CacheUtils;