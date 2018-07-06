import express from "express";
import async, { reject } from 'async';
import redis from 'redis';
import { promisify } from 'util';
import request from 'request';

const app = express();
const PORT = process.env.PORT || 3000;
const ONE_HOUR_IN_SECONDS_TTL_DEFAULT = 1000 * 60 * 60;

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


    /**
     * Get an item from the redis store
     * @param {String} cacheKey 
     */
    async getCache(cacheKey) {
        try {
            let client = await this.getClient();
            let getAsync = promisify(client.get).bind(client);
            let res = await getAsync(cacheKey);
            if (!res)
                return null;
            res = JSON.parse(res);
            return res;
        } catch (err) {
            console.error(`Failed to retrieve results: ${err.message}`);
            throw err;
        }

    }

    /**
     * Set an item to the redis store
     * @param {String} cacheKey 
     * @param {Object} data  JSON.stringify-able object
     * @param {Number} cacheExpire  TTL in seconds
     */
    async setCache(cacheKey, data, cacheExpire = ONE_HOUR_IN_SECONDS_TTL_DEFAULT) {
        try {
            let client = await this.getClient();
            let setAsync = promisify(client.setex).bind(client);
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }
            let res = await setAsync(cacheKey, cacheExpire, data);
            if (!res)
                return null;
            return res;
        } catch (err) {
            console.error(`Failed to set cache: ${err.message}`);
            throw err;
        }
    }


    /**
     * Delete cache based on Key
     * @param {String} cacheKey 
     */
    async delCache(cacheKey) {
        try {
            let client = await this.getClient();
            let delAsync = promisify(client.del).bind(client);
            let del = await delAsync(cacheKey);
            if (!del)
                return null
            return del;
        } catch (err) {
            console.error(`Failed to delete cache: ${err.message}`);
            throw err;
        }
    }
}

app.get('/set', async (req, res) => {
    let response;
    const cache = new CacheUtils();
    let data = await cache.setCache("sk", { "dataset": "true" }, 1000);
    if (!data)
        response = {
            success: true,
            message: "Data unable to set"
        }
    else
        response = {
            success: true,
            message: "Data set to key successfully"
        }

    res.send(response);
});

app.get('/get', async (req, res) => {
    let response;
    const cache = new CacheUtils();
    let data = await cache.getCache("sk");
    if (!data || data == null) {
        response = {
            success: true,
            message: "Requested data not avialable"
        }
    } else {
        response = {
            success: true,
            message: "Requested data avialable",
            data: data
        }
    }
    res.send(response);
});

app.get('/del', async (req, res) => {
    let response;
    const cache = new CacheUtils();
    let data = await cache.delCache("sk");
    if (!data)
        response = {
            success: true,
            message: "Not data avialable to delete on this key"
        }
    else
        response = {
            success: true,
            message: "Data deleted successfully"
        }

    res.send(response);
});


async function getAPIData(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, data) => {
            if (error) reject(error)
            else resolve(data)
        })
    })
}


app.get('/storeAPI', async (req, res) => {
    let data = await getAPIData('http://datasource.kapsarc.org/api/datasets/1.0/search/?rows=1');
    console.log(data);
    const cache = new CacheUtils();
    cache.setCache("API", data);
    res.send(data);
})


app.get('/getCacheAPI', async (req, res) => {
    const cache = new CacheUtils();
    let response = await cache.getCache("API");
    res.send(response)
})


app.listen(PORT, function () {
    console.log('app listening on port', PORT);
});

export { app }