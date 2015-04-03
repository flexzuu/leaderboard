PlayerList = new Mongo.Collection("players");

if(Meteor.isClient){

    Meteor.subscribe('thePlayers');

    // this code only runs on the client
    Template.leaderboard.helpers({
      'player': function(){
        return PlayerList.find({}, {sort: {score: -1,name: 1}});
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
        Meteor.call('modifyPlayerScore', selectedPlayer, 5);

      },
      'click .decrement': function(){
        var selectedPlayer = Session.get('selectedPlayer');
        Meteor.call('modifyPlayerScore', selectedPlayer, -5);

      },
      'click .remove': function(){
        var selectedPlayer = Session.get('selectedPlayer');
        var selectedPlayer = Session.get('selectedPlayer');
        Meteor.call('removePlayerData',selectedPlayer);
      }
    });

    Template.addPlayerForm.events({
      'submit form': function(event){
        event.preventDefault();
        var playerNameVar = event.target.playerName.value;
        Meteor.call('insertPlayerData', playerNameVar);
      }
    });
}

if(Meteor.isServer){
    // this code only runs on the server
    Meteor.publish('thePlayers', function(){
      var currentUserId = this.userId;
      return PlayerList.find({createdBy: currentUserId});
    });

    Meteor.methods({
      'insertPlayerData': function(playerNameVar){
        var currentUserId = Meteor.userId();
        PlayerList.insert({
            name: playerNameVar,
            score: 0,
            createdBy: currentUserId
        });
      },
      'removePlayerData': function(selectedPlayer){
        PlayerList.remove(selectedPlayer);
      },
      'modifyPlayerScore': function(selectedPlayer, scoreValue){
        PlayerList.update(selectedPlayer, {$inc: {score: scoreValue} });
      }
    });
}