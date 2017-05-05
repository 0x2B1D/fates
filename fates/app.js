/*** GLOBAL VARIABLES **/
var routes = [];

/**CLASSES **/
/**Route class **/
function Route(name){
  this.name = name;
  this.children = [];
  this.available = [];
}

Route.prototype.populateTable = function(){
  var path = '#' + this.name +" table";
  $(path).append('<th><td><h1>Mother</h1></td><td><h1>Father</h1></td><td><h1>Stats</h1></td></th>');

}

/**Child class **/
function Child(info){
  this.info = info;
}
Child.prototype.getGrowths = function(parent) {
  this.HP = (this.info.HP + parent.HP)/2;
  this.Str = (this.info.Str + parent.Str)/2;
  this.Mag = (this.info.Mag + parent.Mag)/2;
  this.Skl = (this.info.Skl + parent.Skl)/2;
  this.Spd = (this.info.Spd + parent.Spd)/2;
  this.Lck = (this.info.Lck + parent.Lck)/2;
  this.Def = (this.info.Def + parent.Def)/2;
  this.Res = (this.info.Res + parent.Res)/2;
};


$(document).ready(function(){
  init();
})
function changeView(route){
    //re-list the now switched out game as an option again
    var previous = $('#game').attr('value');
    $('#myDropDown img[value =' + previous + ']').show();
    $('.dropbtn').val(route);
    $('.dropbtn').attr("src",'images/' + route + '.png');
    $('.dropbtn').attr("value",route);
    //change the background image to the new selected game
    $('body').css("background-image","url(images/" + route + "BG.jpg)");
    //hide the previous game table
    $('#' + previous).hide()
    //display new game table
    $('#' + route).show();
    removeCurrent(); //removes the current game from the list of options
    //load current game
}
//removes the current game from the list of options
function removeCurrent(){
  var current = $('.dropbtn').val();
  $('#myDropDown img[value =' + current + ']').hide();
}
function createRoutes(){
  var fs=require('fs');
  var data=fs.readFileSync('model/children.json');
  var children = JSON.parse(data);
  ['birthright','conquest','revelations'].forEach(function(route){
    var r = new Route(route);
    routes.push(r);
    if(route != 'revelations'){
      children[route].forEach(function(info){
        r.children.push(new Child(info));
      })
    }else{
      r.children = routes[0].children.concat(route[1].children);
      var shared = [];
      children['shared'].forEach(function(info){
            shared.push(new Child(info))
      })
      routes.forEach(function(route){
          route.children.concat(shared);
          route.populateTable();
      })
    }
  })
}
//drop down menu prep
function prepareMenu(){
  //****DROPDOWN LIST
  ['birthright','conquest','revelations'].forEach(function(x){
    $('#myDropDown img[value =' + x + ']').click(function(){
      changeView(x);
    })
  })
  window.onclick = function(event) {
    if(!event.target.matches('#myDropdown') &&
       $('#myDropdown').css('display') !='none'){
        $('#myDropdown').toggle();
    }
    else if (event.target.matches('#game')){
      $('#myDropdown').toggle();
    }
  }
}
//loading screen
function  loadingScreen(){
  $('#main').show();
  $('#loader').hide();
}

function init(){
  prepareMenu();
  loadingScreen();
  createRoutes();
}
