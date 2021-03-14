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

}
