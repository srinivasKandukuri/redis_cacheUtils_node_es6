import express from "express";
import async, { reject } from 'async';
import redis from 'redis';
import { promisify } from 'util';
import request from 'request';

const app = express();
const PORT = process.env.PORT || 3000;

class CacheUtils {
    constructor() {
        let client = null;
    }
    async getClient() {
        //const port = process.env.REDIS_PORT;
        //const url = process.env.REDISCLOUD_URL || "redis://127.0.0.1:6378";
        if (!this.client) {
            this.client = await redis.createClient();
        }
        return this.client;
    }
    async getCache(key) {
        try {
            let client = await this.getClient();
            let getAsync = promisify(client.get).bind(client);
            const res = await getAsync(key);
            return JSON.parse(res);
        } catch (err) {
            console.error(`Failed to retrieve results: ${err.message}`);
            throw err;
        }

    }
    async setCache(key, value, ttlSec) {
        try {
            let client = await this.getClient();
            let setAsync = promisify(client.setex).bind(client);
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            let res = await setAsync(key, ttlSec, value);
            console.log(res);
        } catch (err) {
            console.error(`Failed to set cache: ${err.message}`);
            throw err;
        }
    }

    async delCache(key) {
        try {
            let client = await this.getClient();
            let delAsync = promisify(client.del).bind(client);
            let del = await delAsync(key);
            console.log(del);
        } catch (err) {
            console.error(`Failed to delete cache: ${err.message}`);
            throw err;
        }
    }
}

app.get('/set', (req, res) => {
    const cache = new CacheUtils();
    cache.setCache("skk", { "datasetttttttttttt": true }, 1000);
    res.send({
        success: true
    })
});

app.get('/get', async (req, res) => {
    const cache = new CacheUtils();
    let data = await cache.getCache("skk");
    console.log(data);
    res.send(data)
});

app.get('/del', async (req, res) => {
    const cache = new CacheUtils();
    let data = await cache.delCache("skk");
    console.log(data);
    res.send(data)
});


async function getAPIData(url){
    return new Promise((resolve, reject) => {
        request(url, (error, response, data) =>{
            if(error) reject(error)
            else resolve(data)
        })
    })
}


app.get('/storeAPI', async (req, res) => {
    let data = await getAPIData('http://datasource.kapsarc.org/api/datasets/1.0/search/?rows=1');
    console.log(data);
    const cache = new CacheUtils();
    cache.setCache("API", data, 1000);
    res.send(data);
})


app.get('/getCacheAPI', async (req, res) => {
    const cache = new CacheUtils();
    let response =  await cache.getCache("API");
    console.log(response);
    res.send(response)
})


app.listen(PORT, function () {
    console.log('app listening on port', PORT);
});

export { app }