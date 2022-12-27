const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');


//get current user profile based on token login
router.get('/me', auth,async (req,res) => {

    try{

        const profile = await Profile.findOne({ user: req.user.id})

        if(!profile){
            return res.status(400).json({msg: 'no profile for this user'});
        }
        res.json(profile);

    }catch(err){
        console.error(err.massage);
        res.status(500).send('server error');
    }


});


module.exports = router;