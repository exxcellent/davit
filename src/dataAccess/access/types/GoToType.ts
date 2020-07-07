export type GoTo = Intermediate | Terminal;
export type Intermediate = { type: GoToTypes.STEP | GoToTypes.COND; id: number };
export type Terminal = { type: GoToTypes.FIN | GoToTypes.ERROR };

export enum GoToTypes {
  FIN = "FIN",
  ERROR = "ERROR",
  STEP = "STEP",
  COND = "COND",
}
