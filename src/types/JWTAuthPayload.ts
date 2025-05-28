import { JwtPayload } from "jwt-decode";
import { JWTTokenPaylodTypeField } from "humane-common";

export interface JWTAuthPayload extends JwtPayload {
  type: JWTTokenPaylodTypeField;
}
