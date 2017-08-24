//schema
var mongoose = require('mongoose');
var pollSchema = mongoose.Schema({
    pollId: {type:String, unique:true},
    secret: String,
    locale: String,
    questions: [{id:String, choices:[{id:String, count:Number}]}],
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date
    
},
{
    collection: 'polldata'                                                      
});

//model
var Poll=mongoose.model( 'Poll', pollSchema, 'polldata' );
module.exports = Poll;