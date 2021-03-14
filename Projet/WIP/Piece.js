export default class Piece{
  constructor(pieceType, power, player){
    this.pieceType = pieceType;
    // 0 = normal
    // 1 = espion
    // 2 = eclaireur
    // 3 = demineur
    // 4 = maréchal
    // 5 = bombe
    // 6 = drapeau
    this.power = power;
    this.player = player;
  }
  static engageCombat(attack, def){ //attack = start piece, def = dest piece
    if(def.power == 6){
      return(4); // Win, flag is down !
    }
    else{
      if(attack.power == def.power){
        return(0); // 2 pieces destroyed
      }
      else if(attack.power >= def.power){
        return(1); // def piece destroyed
      }
      else if(attack.power <= def.power){
        if(attack.power == 2 && def.power == 4 || attack.power == 3 && def.power == 5){
          return(2); //special rule, def piece destroyed
        }
        else{
          return(3);// attack piece destroyed
        }
      }
    }
<<<<<<< HEAD
=======

>>>>>>> 06429023a9a611c926a18989c70ba2d6f7699a50
  }
}
