console.log("...LOADING usersloader");

// This module first loads a masterlist of all users (`users.allusers`), and then loads a json file for each user.
// The users' individual `actions` array are also baked together into a master actions array.
// Also we're given an array with all used icons
// This module is used in `data.js`.
define(["json!data/static/userlist","underscore"],function(users,_){
	return {
		load: function(resourceId,require,onLoad){
			require(_.map(users.allusers,function(userid){ return "json!../data/users/"+userid; }),function(){
				// capture the arguments object containing the individual data files into a closure variable, for access in the `reduce` iterator
				var jsonarr = _.map(arguments,_.identity);
				// make the module return the result of a `reduce` call that bakes all individual files together into a single database object
				console.log(".....serving up result from usersloader");
				onLoad(_.reduce(users.allusers,function(memo,userid,i){
					ret = {
						// add the user to the `users` object, using id as key. also add id to each user
						users: _.extend(_.object([userid],[_.extend(jsonarr[i],{id:userid})]),memo.users),
						// add the user´s actions to the `actions` array, augmenting each action with a `who` prop storing the userid
						actions: _.sortBy(memo.actions.concat(_.map(jsonarr[i].actions,function(o){return _.extend({who:userid},o);})),"when"),
						// add the icon to the `icons` object
						icons: memo.icons.concat(jsonarr[i].icon)
					};
					console.log(ret);
					return ret;
				},{users:{},actions:[],icons:[]}));
			});
		}
	};
});