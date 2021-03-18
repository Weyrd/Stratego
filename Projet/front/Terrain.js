import Case from './Case.js'

export default class Terrain{
  constructor(size_x, size_y) {
    //this.matrix = new Array(size_x).fill(new Array(size_y).fill(new Case()));
    this.matrix = new Array(size_x);
    for (var x = 0; x < size_x; x++) {
      this.matrix[x] = new Array(size_y);
      for (var y = 0; y < size_y; y++) {
        this.matrix[x][y] = new Case();
      }
    }
  }
  generateVanillaLake(){
    //first lake
    this.matrix[2][4].transformToWater();
    this.matrix[2][5].transformToWater();

    this.matrix[3][4].transformToWater();
    this.matrix[3][5].transformToWater();

    //second lake
    this.matrix[6][4].transformToWater();
    this.matrix[6][5].transformToWater();

    this.matrix[7][4].transformToWater();
    this.matrix[7][5].transformToWater();
  }
  generateRamdomLake(){} //TODO MAYBE


  static MovePieceTo(terr, AX, AY, BX, BY){
    socket.emit("sendPieceMove", {"terrain" : terr, "AX" : AX, "AY": AY, "BX": BX, "BY": BY});

    if (terr.matrix[AX][AY].hasPiece) {
      //Type of Pieces movement restriction check___________________________________________________________
      //Bomb & Flag
      if(terr.matrix[AX][AY].Piece.pieceType == 5 || terr.matrix[AX][AY].Piece.pieceType == 6){
        console.log("error not mouvable piece");
        return(-1);
      }
      //scout or not scout
      if(terr.matrix[AX][AY].Piece.pieceType == 1){
        if (AX == BX) {
          dist = AY-BY
          if (dist <= 3 && dist >= -3 && dist) {
            if (dist <= 3) {
              for (var i = 1; i < dist; i++) {
                if (terr.matrix[AX][AY+i].hasPiece) {
                  console.log("Piece in the way");
                  return(-1);
                }
              }
            }
            if (dist >= -3) {
              for (var i = -1; i < dist; i--) {
                if (terr.matrix[AX][AY+i].hasPiece) {
                  console.log("Piece in the way");
                  return(-1);
                }
              }
            }
          }
          else {
            console.log("error select a valid movement");
            return(-1);
          }
        }
        else if (AY == BY) {
          dist = AX-BX
          if (dist <= 3 && dist >= -3 && dist) {
            if (dist <= 3) {
              for (var i = 1; i < dist; i++) {
                if (terr.matrix[AX+i][AY].hasPiece) {
                  console.log("Piece in the way");
                  return(-1);
                }
              }
            }
            if (dist >= -3) {
              for (var i = -1; i < dist; i--) {
                if (terr.matrix[AX+i][AY].hasPiece) {
                  console.log("Piece in the way");
                  return(-1);
                }
              }
            }
          }
          else {
            console.log("error select a valid movement");
            return(-1);
          }
        }
        else {
          console.log("error select a valid movement");
          return(-1);
        }
      }
      else {
        if (!((AX == BX && Math.abs(AY-BY) == 1)||(AY == BY && Math.abs(AX-BX) == 1))) {
          console.log("error select a valid movement");
          return(-1);
        }
      }
      //Other check_________________________________________________________________________________________
      if (!terr.matrix[BX][BY].water) {
        if (terr.matrix[BX][BY].hasPiece) {
          if (terr.matrix[AX][AY].Piece.player != terr.matrix[BX][BY].Piece.player){
            let ComRe = Piece.engageCombat(terr.matrix[AX][AY].Piece, terr.matrix[BX][BY].Piece);
            if (ComRe == 3) {
              terr.matrix[BX][BY].Piece = terr.matrix[AX][AY].Piece;
              terr.matrix[AX][AY].Piece = null;
              terr.matrix[AX][AY].hasPiece = false;
              terr.matrix[BX][BY].hasPiece = true;
              //game win flag captured
            }
            else if (ComRe == 0) {
              terr.matrix[AX][AY].Piece = null;
              terr.matrix[AX][AY].hasPiece = false;
              terr.matrix[BX][BY].Piece = null;
              terr.matrix[BX][BY].hasPiece = false;
              //both dead
            }
            else if (ComRe == 1) {
              terr.matrix[BX][BY].Piece = terr.matrix[AX][AY].Piece;
              terr.matrix[AX][AY].Piece = null;
              terr.matrix[AX][AY].hasPiece = false;
              terr.matrix[BX][BY].hasPiece = true;
              //attack win
            }
            else if (ComRe == 2){
              terr.matrix[AX][AY].Piece = null;
              terr.matrix[AX][AY].hasPiece = false;
              //def win
            }
            else {
              return(-1);
              //what ?????
            }
            return(ComRe);
          }
          else {
            console.log("error friendly piece on destination");
            return(-1);
          }
        }
        else {
          terr.matrix[BX][BY].Piece = terr.matrix[AX][AY].Piece;
          terr.matrix[AX][AY].Piece = null;
          terr.matrix[AX][AY].hasPiece = false;
          terr.matrix[BX][BY].hasPiece = true;
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
