const express = require('express');
const router = express.Router();

///////    getters  ////////////

router.get('/', (req,res) => {
    res.render('index', {title: 'My courses HP', message:'courses HP'});
});

module.exports = router;
    