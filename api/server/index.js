const express = require('express')
const app = express()
const path = require("path");
const cors = require('cors')
const catchAsync = require('./utils/catchAsync')
const dotenv = require('dotenv')
require('dotenv').config()
const axios = require('axios')
const API_KEY = process.env.RIOT_API_KEY
const PORT = process.env.PORT || 3001
app.use(express.json());
const corsOptions = {
    origin: ["URL ALLOWED", "https://teal-kleicha-20ec09.netlify.app/"],
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors({ origin: true }))

app.listen(PORT, () => {
    console.log('Listening on port 3001')
})

app.post('/userParam', catchAsync(async (req, res) => {
    const { username } = req.body;
    const userInfo = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${API_KEY}`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            res.status(404, err)
        })
    res.json(userInfo)
}))
// 

app.post('/getMatchHistory', catchAsync(async (req, res) => {
    const { puuid } = req.body
    const userMatchHistory = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${API_KEY}`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {

            console.log(err.response.statusText)

        })
    res.json(userMatchHistory)
}))

app.post('/getMatchData', catchAsync(async (req, res) => {
    const { matchHistory } = req.body
    console.log(matchHistory)
    let fullMatchData = []
    for (let match of matchHistory) {
        const specificMatchData = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${API_KEY}`)
        fullMatchData.push(specificMatchData.data.info)

    }
    res.json(fullMatchData)
}))

app.post('/getRankedData', catchAsync(async (req, res) => {
    const { id } = req.body;

    const rankedData = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${API_KEY}`)
        .then((res) => {
            return res.data

        })
    res.json(rankedData)
}))



