/* eslint-disable prettier/prettier */
export interface IPayload {
  sub: string;
  iat: number;
  exp: number;
  [key: string]: any;
}
