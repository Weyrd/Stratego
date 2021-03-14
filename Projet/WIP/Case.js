import Piece from './Piece.js'

export default class Case{
  constructor(){
    this.water = false;
    this.hasPiece = false;
    this.Piece;
  }
  addPiece(pieceType, power){
      this.Piece = new Piece(pieceType, power);
      this.hasPiece = true;
  }
  transformToWater(){
    this.water = true;
    this.hasPiece = false;
    this.Piece = null;
  }

  static MovePieceTo(start, dest){
    if (start.hasPiece) {
      if (!dest.water) {
        if (dest.hasPiece) {
          Piece.engageCombat(start.Piece, dest.Piece);
        }
        else {
          dest.Piece = start.Piece;
          start.Piece = null;
        }
      }
      else {
        console.log("error water on destination");
        return(-1);
      }
    }
    else {
      console.log("error no piece on start");
      return(-1);
    }
  }
}
