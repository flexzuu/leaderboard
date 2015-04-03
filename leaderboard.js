PlayerList = new Mongo.Collection("players");

if(Meteor.isClient){

    Meteor.subscribe('thePlayers');

    // this code only runs on the client
    Template.leaderboard.helpers({
      'player': function(){
        var currentUserId = Meteor.userId();
        return PlayerList.find({createdBy: currentUserId}, {sort: {score: -1,name: 1}});
      },
      'selectedClass': function(){
        var playerId = this._id;
        var selectedPlayer = Session.get('selectedPlayer');
        if (playerId==selectedPlayer){
          return "selected";
        }
      },
      'showSelectedPlayer': function(){
        return PlayerList.findOne(Session.get('selectedPlayer'));
      }
    });

    Template.leaderboard.events({
      // events go here
      'click .player': function(){
        var playerId = this._id;
        Session.set('selectedPlayer', playerId);
      },
      'click .increment': function(){
          var selectedPlayer = Session.get('selectedPlayer');
          PlayerList.update(selectedPlayer,{$inc:{score: 5}});

      },
      'click .decrement': function(){
          var selectedPlayer = Session.get('selectedPlayer');
          PlayerList.update(selectedPlayer,{$inc:{score: -5}});

      },
      'click .remove': function(){
        var selectedPlayer = Session.get('selectedPlayer');
        PlayerList.remove(selectedPlayer);
      }
    });

    Template.addPlayerForm.events({
    'submit form': function(evt){

        evt.preventDefault();

        var playerNameVar = event.target.playerName.value;
        var currentUserId = Meteor.userId();

        PlayerList.insert({
          name: playerNameVar,
          score: 0,
          createdBy: currentUserId
        });

    }
});
}

if(Meteor.isServer){
    // this code only runs on the server
    Meteor.publish('thePlayers', function(){
      return PlayerList.find()
    });
}