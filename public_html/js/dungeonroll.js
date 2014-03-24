$(function(){

var whiteFaces = ["fighter", "mage", "cleric", "thief", "champion", "scroll"];
var whiteImages = {fighter: "images/fighter.png", mage: "images/mage.png", cleric: "images/cleric.png", thief: "images/thief.png", champion:"images/champion.png", scroll: "images/scroll.png"};

var WhiteDie = Backbone.Model.extend({
	defaults: function() {
		return {
			face: "unknown"
		};
	},
        
	initialize: function() {
		this.set({face: whiteFaces[Math.floor(Math.random() * whiteFaces.length)]});
                this.set({graphic: whiteImages[this.get("face")]});
	},
	
	reroll: function() {
		this.set({face: whiteFaces[Math.floor(Math.random() * whiteFaces.length)]});
                this.set({graphic: whiteImages[this.get("face")]});
	},
});

var WhiteDieList = Backbone.Collection.extend({
	model: WhiteDie
});

var Dice = new WhiteDieList;

var WhiteDieView = Backbone.View.extend({
	tagName: "span",
	className: "die",
	template: _.template($('#die-template').html()),
	events: {
	"click" : "dieClicked"
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},
	
	dieClicked: function() {
		this.model.reroll();
	}
});

var AppView = Backbone.View.extend({

	el: $("#playArea"),
	
	initialize: function() {
		this.listenTo(Dice, 'add', this.addOne);
		this.listenTo(Dice, 'remove', this.removeOne);
		this.listenTo(Dice, 'all', this.render); //necessary?
		
	},
	
	events: {
		"click #add-button": "addDie",
		"click #remove-button": "removeDie"
	},
	
	render: function() {
		//nothing special here
	},
	
	addDie: function() {
		Dice.create();
	},
	
	removeDie: function() {
		Dice.remove(Dice.at(Dice.length - 1));
	},
	
	addOne: function(die){
		var dieView = new WhiteDieView({model: die});
		this.$("#dice-area").append(dieView.render().el);
	},
	
	addAll: function() {
		Dice.each(this.addOne, this);
    },
	
	removeOne: function(){
		this.$("#dice-area").empty();
		this.addAll();
	},
	
});
var App = new AppView;

});