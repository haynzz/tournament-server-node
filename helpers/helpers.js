/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */

exports.shuffleArray = function shuffle(toBeShuffled){
  var tmp, rand;
  for(var i =0; i < toBeShuffled.length; i++){
    rand = Math.floor(Math.random() * toBeShuffled.length);
    tmp = toBeShuffled[i]; 
    toBeShuffled[i] = toBeShuffled[rand]; 
    toBeShuffled[rand] =tmp;
  }
}