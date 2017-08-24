//Polls api for mongo using node and express

var express=require('express');
var bodyParser= require('body-parser');
var credentials = require('./credentials/credentials.js');
var db = require('./models/db');
var Poll=require("./models/Poll");
var app=express();
var endPointPath="/polls/v1/";
var responseData;

//to run in production: export NODE_ENV=production
//to run  in dev: export NODE_ENV=production 
//then: node poll


app.use(bodyParser.json());

app.post(endPointPath+'getpoll/:id', function(req, res) {
    var id=req.params.id;
    var query = Poll.findOne({ 'pollId': pollId });
        query.exec(function (err, poll) {
            if (err) {
                responseData=err;
                res.json(responseData);
            }else{
                responseData=poll;
                res.json(responseData); 
            }
        })
});

app.post(endPointPath+'update/:id', function(req, res) {
   //updates a single question choice    
   //get post body so mulitple updates can be made. 
   console.log("req.body", req.body);
   var bodyData=req.body;
   var id=req.params.id;
   var secret, pollId, questionId, choiceId;
   pollId=id;
   console.log("pollId", pollId);
   secret=bodyData.secret;
   questionId=bodyData.questionId;
   choiceId=bodyData.choiceId;
   console.log("secret", secret);
  
   console.log("questionId", questionId);
   console.log("choiceId", choiceId);
    
    
    
    
    //first validate paramters, if not correct, respond with error
   if (!pollId || !secret || !questionId || !choiceId) {
      var err={"update":false, "RequestError":"Must provide PollId, Secret, QuestionId, and choiceId"};
      responseData=err;
      res.json(responseData);
   }else{
        //search for id in poll documents
        var query = Poll.findOne({ 'pollId': pollId });
        query.exec(function (err, poll) {
            if (err){
                 responseData=err;
                 res.json(responseData);
            }else{
                 console.log("poll", poll);
                 
                 if (!poll.questiions) {
                     poll.questiions=[];
                 }
                 
                 //loop through questions and look for questionId
                 var questionFound=false;
                 var currentQuestion; 
                 for (ctr=0;ctr<poll.questions.length;ctr++) {
                     if (poll.questions[ctr].id == questionId) {
                        console.log("question found");
                        questionFound=true;
                        currentQuestion=poll.questions[ctr];
                        break;
                     }
                     
                 }
                
                 if (!questionFound) {
                     console.log("question not found, creating");
                     poll.questions.push({"id":questionId, choices:[{id:choiceId,count:1}]});
                     currentQuestionId=poll.questions.length-1;
                    
                 }else{
                   var choiceFound=false;
                   console.log("currentQuestion", currentQuestion);
                   var choices=currentQuestion.choices;
                       for (ctr=0;ctr=choices.length;ctr++) {
                            if (choices[ctr]) {
                               
                                if (choices[ctr].id == choiceId) {
                                    console.log("choice found");
                                    choiceFound=true;
                                    choices[ctr].count+=1;
                                    break;
                                 }
                            }

                     }
                     if (!choiceFound) {
                        console.log("choice not found, creating");
                        poll.questions.push({"id":choiceId,count:1});
                    }
                     
                 }
                 
                  
                
                 poll.save();     
                
                responseData=poll;
                res.json(responseData);
            }
        }
    )}
    
    
});

app.get(endPointPath+'create/:id', function(req, res) {
   var secret, pollId, questionId, choiceId;
   var id=req.params.id
   secret=req.query.secret
   pollId=id;
   
   //first validate paramters, if not correct, respond with error
   if (!pollId || !secret) {
        var err={"created":false, "RequestError":"Must provide both a PollId and Secret"};
        responseData=(err);
        res.json(responseData);
   }else{
       //parameters are not null, try to insert. Error if already exists. Return created:true is created
       console.log("secret", secret);
       console.log("pollId", pollId);

        var newPoll=new Poll();
        newPoll.pollId=pollId;
        newPoll.secret=secret;
        newPoll.questions=[];
        newPoll.save( function( err, poll ){
        if(!err){
            console.log('Poll saved!');
            console.log("poll.createdOn", poll.createdOn);
            responseData=({"created":true});
            res.json(responseData);

          }else{
            console.log('error', err); 
            err.created=false;
            responseData=err;
            res.json(responseData);
          }
        }); 
   
   }
});


var server= app.listen(3000, function() {
    var host=server.address().address;
    var port=server.address().port;
    
    console.log('Example app listening at http://%s%s',host, port);
    console.log("EVN:%s",app.get('env'));
});