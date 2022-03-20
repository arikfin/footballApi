const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Match = require('../models/match');
const User = require('../models/user');

// Read
router.get('/getMatches', async(request, response) => {
    // Version 1
    // try{
    //     const matches = await Match.find();
    //     return response.status(200).json({
    //         message: matches
    //     })
    // } catch (error) {
    //     return response.status(500).json({
    //         message: error
    //     })
    // }


    //Version 2
    Match.find()
    .then(results => {
        return response.status(200).json({
            message: results
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })

})



// Create
router.post('/createMatch',(request,response) => {
    const {homeTeamName, awayTeamName, homeScore,awayScore, stadium, homeWin } = request.body;
    const id = mongoose.Types.ObjectId();
    const _match = new Match({
        _id: id,
        homeTeamName: homeTeamName,
        awayTeamName: awayTeamName,
        homeScore: homeScore,
        awayScore: awayScore,
        stadium: stadium,
        homeWin: homeWin
    });
    return _match.save()
    .then(results => {
        return response.status(200).json({
            message: results
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
})

// Read User
router.get('/getUser', async(request, response) => {
    User.find()
    .then(results => {
        return response.status(200).json({
            message: results
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })

})



// Create User
router.post('/createUser',(request,response) => {
    const {firstName, lastName,email,passWord} = request.body;
    const id = mongoose.Types.ObjectId();
    const _user = new User({
        _id: id,
        firstName : firstName,
        lastName : lastName,
        email : email,
        passWord: passWord
    });
    return _user.save()
    .then(results => {
        return response.status(200).json({
            message: results
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
})

//Update
router.put('/updateMatch/:id',async(request,response) => {
    const matchId = request.params.id;
    Match.findById(matchId)
    .then(match => {
        if(match){
            const {homeTeamName, awayTeamName, homeScore,awayScore, stadium, homeWin } = request.body;
            match.homeTeamName = homeTeamName;
            match.awayTeamName = awayTeamName;
            match.homeScore = homeScore;
            match.awayScore = awayScore;
            match.stadium = stadium;
            match.homeWin = homeWin;

            return match.save()
            .then(match_updated => {
                return response.status(200).json({
                    message: match_updated
                })
            })


            
        } else {
            return response.status(404).json({
                message: 'Game is no exist'
            })

         } 
    })
    .catch(err => {
        return response.status(500).json({
        message: err
        })
    })

})

//Delete 
router.delete('/removeMatch/:id',async(request,response) => {
    const matchId = request.params.id;
    Match.findByIdAndDelete(matchId)
    .then(results => {
        return response.status(200).json({
            message:results
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })

    })
})



module.exports = router;