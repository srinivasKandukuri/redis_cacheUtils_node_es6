import express from "express";
import async, { reject } from 'async';
import redis from 'redis';
import { promisify } from 'util';
import request from 'request';
const ONE_HOUR_IN_SECONDS_TTL_DEFAULT = 1000 * 60 * 60;


export default class CacheUtils {
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
