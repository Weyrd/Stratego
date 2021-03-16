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
    if(def.pieceType == 6){
      return(3); // Win, flag is down !
    }
    else{
      if((attack.power == def.power) || (def.pieceType == 5 && attack.pieceType != 3)){
        return(0); // 2 pieces destroyed
      }
      else if(attack.power >= def.power){
        return(1); // def piece destroyed
      }
      else if(attack.power <= def.power){
        if(attack.pieceType == 1 && def.pieceType == 4){
          return(1); //special rule, def piece destroyed
        }
        else{
          return(2);// attack piece destroyed
        }
      }
    }
  }
}
