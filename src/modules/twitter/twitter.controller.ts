// import { Controller, Get, Query, Res, Session } from '@nestjs/common';
// import { Response } from 'express';
// import { TwitterService } from './twitter.service';

// @Controller('twitter')
// export class TwitterController {
//   constructor(private twitterService: TwitterService) {}

//   @Get('connect')
//   connect(
//     @Res() response: Response,
//     @Query('oauth_token') oauth_token: string,
//     @Query('oauth_verifier') oauth_verifier: string,
//     @Query('callbackUrl') callbackUrl: string,
//     @Session()
//     session,
//   ) {
//     console.log(session);
//     console.log(session.twitter.oauth_token_secret);
//     const { oauth_token_secret } = session.twitter;
//     console.log(callbackUrl);
//     if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
//       return response
//         .status(400)
//         .send('You denied the app or your session expired!');
//     }

//     this.twitterService.validateOAuth({
//       oauth_token,
//       oauth_verifier,
//       oauth_token_secret,
//     });

//     // response.redirect('')
//     return 'This action returns all cats';
//   }
// }
