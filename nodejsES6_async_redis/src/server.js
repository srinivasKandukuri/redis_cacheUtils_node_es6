import express from "express";
import async from 'async';
import redis from 'redis';
const { promisify } = require('util');

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
            let setAsync = promisify(client.set).bind(client);
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            const res = await setAsync(key, ttlSec, value);
        } catch (err) {
            console.error(`Failed to set cache: ${err.message}`);
            throw err;
        }
    }

    async delCache(key) {
        let client = await this.getClient();
        let delAsync = promisify(client.del).bind(client);
        let del = await delAsync(key);
    }
}

app.get('/set', function (req, res) {
    const cache = new CacheUtils();
    cache.setCache("skk", { "datasetttttttttttt": true });
    res.send({
        success: true
    })
});

app.get('/get', async function (req, res) {
    const cache = new CacheUtils();
    let data = await cache.getCache("skk");
    console.log(data);
    res.send(data)
});


app.listen(PORT, function () {
    console.log('app listening on port', PORT);
});

export { app }