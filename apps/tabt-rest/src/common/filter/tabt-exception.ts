import { HttpException } from '@nestjs/common';

export class TabtException extends HttpException {
  constructor(faultCodeString: string, faultString: string) {
    const code = Number(faultCodeString);
    switch (code) {
      case 8:
      case 5:
        super(faultString, 500);
        break;
      case 27:
      case 47:
      case 53:
      case 54:
      case 55:
        super(faultString, 403);
        break;
      case 34:
        super(faultString, 429);
        break;
      case 52:
      default:
        super(faultString, 400);
    }
    // 8, 5 -> 500
    //27, 47 -> 403
  }
}
