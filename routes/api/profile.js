const express = require('express');
const {check, validationResult} = require('express-validator');
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

// create / update profile
router.post('/',[auth, 
    [check('location', 'location of the user').not().isEmpty(),
    check('phone', 'user phone').not().isEmpty()

]] , async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }


    //get location and phone from body
    const{location,phone,name} = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    

    if(location){
        profileFields.location = location;
    }
    if(phone){
        profileFields.phone = phone;
    }
    if(name){
        profileFields.name = name;
    }

    try{
        let profile = await Profile.findOne({user: req.user.id});

        if(profile){
            // update
            profile = await Profile.findOneAndUpdate({user: req.user.id},{ $set:
            profileFields
            }, {new: true});

            return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.error(err.massage);
        res.status(500).send('server error');
    }
    
});


// delete profile , user
router.delete('/', auth,async (req,res) => {

    try{

        await Profile.findOneAndRemove({ user: req.user.id});
        await User.findOneAndRemove({ _id: req.user.id});
        res.json({msg: 'deleted'});

    }catch(err){
        console.error(err.massage);
        res.status(500).send('server error');
    }


});

module.exports = router;