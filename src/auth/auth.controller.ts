import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post("signUp")
  signUp(@Body() body: any): Promise<void> {
    return this.authService.signUp(body.userName, body.password);
  }

  @Post("signIn")
  signIn(@Body() body: any): Promise<{ accessToken: string }> {
    return this.authService.signIn(body.userName, body.password);
  }
}
