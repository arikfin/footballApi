const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Match = require('../models/match');
const User = require('../models/user');
const bcryptjs = require('bcryptjs'); //
const jwt = require('jsonwebtoken');

// Read Match
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

// Create Match
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

//Update Match
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

//Delete Match
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
router.post('/createUser',async(request,response) => {
    const {firstName, lastName,email,passWord} = request.body;
    const id = mongoose.Types.ObjectId();
    // 1. is user exist in DB?
    User.findOne({email : email})
    .then(async account => {
        if(account)
        {
            return response.status(200).json({
                message: 'User exist'
            })
        }
        else
        {
            //2. crypt password
            const hash = await bcryptjs.hash(passWord,10);
            //3. generate passCode
            const code = generateCode(100000,999999);
            //4. create new account
            const _user = new User({
                _id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                passWord: hash,
                passCode: code
            })
            return _user.save()
            .then(account_created => {
                return response.status(200).json({
                    message:account_created
                })
            })
        }
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })

    // const id = mongoose.Types.ObjectId();
    // const _user = new User({
    //     _id: id,
    //     firstName : firstName,
    //     lastName : lastName,
    //     email : email,
    //     passWord: passWord
    // });
    // return _user.save()
    // .then(results => {
    //     return response.status(200).json({
    //         message: results
    //     })
    // })
    // .catch(err => {
    //     return response.status(500).json({
    //         message: err
    //     })
    // })
})

// verify User
router.post('/verifyAccount', async(request,response) => {
    const {email,passCode} = request.body;
    User.findOne({email : email})
    .then(account => {
        if(account){
            if(parseInt(account.passCode) === parseInt(passCode)){
                account.isApproved = true;
                return account.save()
                .then(account_updated =>{
                    return response.status(200).json({
                        message: account_updated
                    })
                })
            }
            else{
                return response.status(200).json({
                    message: 'Pass code not match'
                })
            }
        }
        else{
            return response.status(200).json({
                message: 'User not found'
            })
        }
    })
    
    .catch(err => {
        return response.status(500).json({
            message: err
    })    
  })
})


router.post('/login', async(request, response) => {
    const {email,passWord} = request.body;
    User.findOne({ email: email})
    .then(async account => {
        if(account){

            if(account.isApproved){
                const isMatch = await bcryptjs.compare(passWord, account.passWord);
                if(isMatch){

                    const data = {
                        account_name: account.firstName + ' ' + account.lastName,
                        email: account.email,
                        id: account.id,
                    }
                    const token = await jwt.sign(data, '5MECY2Ft27dPBcbkxahvCFaal2wkFVA0');
                    return response.status(200).json({
                        message: token
                    })

                } else {
                    return response.status(200).json({
                        message: 'Pass word is not match, try again'
                    })
                }
            } else {
                return response.status(200).json({
                    message: 'You need to activate your account'
                })
            }

        } else {
            return response.status(200).json({
                message: 'User not found'
            })
        }
    })

    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })

})



function generateCode(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}


module.exports = router;