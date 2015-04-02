PlayerList = new Mongo.Collection("players");

if(Meteor.isClient){
    // this code only runs on the client
    Template.leaderboard.helpers({
      'player': function(){
          return PlayerList.find();
      }
    });
}

if(Meteor.isServer){
    // this code only runs on the server
    console.log("Hello server");
}