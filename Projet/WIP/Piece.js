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
  static engageCombat(attack, def){} //TODO
}
