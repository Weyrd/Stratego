export default class Piece{
  constructor(pieceType, power){
    this.pieceType = pieceType;
    // 0 = normal
    // 1 = espion
    // 2 = eclaireur
    // 3 = demineur
    // 4 = maréchal
    // 5 = bombe
    // 6 = drapeau
    this.power = power;
  }
  static engageCombat(attack, def){} //TODO
}
