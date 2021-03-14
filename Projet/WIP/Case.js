import Piece from './Piece.js'

export default class Case{
  constructor(){
    this.water = false;
    this.hasPiece = false;
    this.Piece;
  }
  addPiece(pieceType, power, player){
      this.Piece = new Piece(pieceType, power, player);
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
          if (start.Piece.player != dest.Piece.player){
            Piece.engageCombat(start.Piece, dest.Piece);
            //TO FINISH DEPENDING ON COMBAT
          }
          else {
            console.log("error friendly piece on destination");
            return(-1);
          }
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
