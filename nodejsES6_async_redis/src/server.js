import express from "express";
import async, { reject } from 'async';
import request from 'request';
import CacheUtils from './utils/cacheUtils';

const cache = new CacheUtils();
const app = express();
const PORT = process.env.PORT || 3000;



app.get('/set', async (req, res) => {
    let response;
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
    let response = await cache.setCache("API", data);
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
})


app.get('/getCacheAPI', async (req, res) => {
    let response = await cache.getCache("API");
    res.send(response)
})


app.listen(PORT, function () {
    console.log('app listening on port', PORT);
});

export { app }