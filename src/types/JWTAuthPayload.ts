import { JwtPayload } from "jwt-decode";

export interface JWTAuthPayload extends JwtPayload {
  type: "user" | "admin";
}
