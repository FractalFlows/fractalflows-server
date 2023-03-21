import { Injectable } from '@nestjs/common';
import TwitterApi from 'twitter-api-v2';
import { HttpService } from '@nestjs/axios';

import { ClaimsService } from '../claims/claims.service';
import { UsersService } from '../users/users.service';
import { SourcesService } from '../sources/sources.service';
import { TagsService } from '../tags/tags.service';
import { ClaimOrigins } from '../claims/entities/claim.entity';

@Injectable()
export class TwitterService {
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly sourcesService: SourcesService,
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
    private httpService: HttpService
  ) {}

  private readonly twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

  // private readonly twit = new Twit({
  //   consumer_key: process.env.TWITTER_API_KEY,
  //   consumer_secret: process.env.TWITTER_API_SECRET,
  //   access_token: process.env.TWITTER_ACCESS_TOKEN,
  //   access_token_secret: process.env.TWITTER_ACCESS_SECRET,
  // });

  // async startStreamV1() {
  //   const handleData = async (tweet) => {
  //     const tweetId = tweet.in_reply_to_status_id_str;

  //     // If the reply is dedicated to a user and not a status,
  //     // go to next item of the loop
  //     if (!tweetId) return;

  //     const existingClaimForTweet = await this.claimsService.findOne({
  //       where: { tweetId },
  //     });

  //     if (existingClaimForTweet) return;

  //     // Create claim template and post link to tweet
  //     this.twit.get(`statuses/show/${tweetId}`, async (error, tweet) => {
  //       if (error) {
  //         console.error(error);
  //         return;
  //       }

  //       const tweetOwner = tweet.user.screen_name;

  //       const user = await this.usersService.findOne({
  //         where: { username: 'fractalflowsbot' },
  //       });
  //       const sources = await this.sourcesService.save([
  //         {
  //           origin: 'twitter',
  //           url: `https://twitter.com/${tweetOwner}/status/${tweetId}`,
  //         },
  //         ...(tweet.entities.urls.map(({ expanded_url }) => ({
  //           origin: 'other',
  //           url: expanded_url,
  //         })) || []),
  //       ]);
  //       const tags = await this.tagsService.save(
  //         tweet.entities.hashtags
  //           .slice(0, 4)
  //           .map(({ text }) => ({ label: text })),
  //       );
  //       const claim = await this.claimsService.create({
  //         title: tweet.text || 'No title in this tweet',
  //         summary: `This claim was originally posted on Twitter by @${tweetOwner}. No further details are available as of yet.`,
  //         user,
  //         sources,
  //         tags: tags.identifiers,
  //         tweetId,
  //         tweetOwner,
  //         origin: ClaimOrigins.TWITTER,
  //       });

  //       const claimLink = `${process.env.FRONTEND_HOST}/claim/${claim.slug}`;
  //       const hashtags = tweet.entities.hashtags
  //         .map(({ text }) => `#${text}`)
  //         .join(' ');
  //       const status = `A new claim was just added: ${claimLink} ${hashtags}`;

  //       if (process.env.APP_ENV === 'development') return;

  //       // Reply back the claim link to the tweet
  //       this.twit.post('statuses/update', {
  //         status: `@${tweetOwner} ${claimLink}`,
  //         in_reply_to_status_id: tweetId,
  //       });

  //       // Post the claim link to the app page
  //       this.twit.post('statuses/update', {
  //         status,
  //       });
  //     });
  //   };

  //   const stream = this.twit.stream('statuses/filter', { track: '#ffclaimit' });
  //   stream.on('tweet', handleData);
  // }

  async requestOAuthUrl({ callbackUrl }: { callbackUrl: string }) {
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
    });
    const authLink = await twitterClient.generateAuthLink(callbackUrl);

    return authLink;
  }

  async validateOAuth({ oauthToken, oauthVerifier, oauthTokenSecret }) {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: oauthToken,
      accessSecret: oauthTokenSecret,
    });

    const { client: loggedClient } = await client.login(oauthVerifier);

    return loggedClient.currentUser();
  }

  async startStream(retryAttempt = 0) {
    this.httpService.get('https://api.twitter.com/2/tweets/search/stream', {
      headers: {Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
      responseType: 'stream',
      timeout: 20000
    }).subscribe(response => {
      const stream = response.data;
      
      console.log('connecting stream', retryAttempt)

      stream.on('data', data => {
        console.log(data)
          try {
            const json = JSON.parse(data);
            
            console.log(json.data);
            
            const replied_to = json.data?.referenced_tweets?.findIndex(r_tweet => r_tweet.type === 'replied_to')
            
            console.log({ replied_to });

            if (!replied_to) return
            
            this.httpService.get(`https://api.twitter.com/2/tweets/${replied_to.id}?tweet.fields=author_id&expansions=referenced_tweets.id`, {
              headers: {Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
            }).subscribe(response => {
              console.log(response.data)
              const replied_to = response.data?.referenced_tweets.findIndex(r_tweet => r_tweet.type === 'replied_to')
              console.log(replied_to)
            })

            // A successful connection resets retry count.
            retryAttempt = 0;
        } catch (e) {
            console.log('e', e, Object.getOwnPropertyNames(e))
            if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                console.log(data.detail)
            } else {
              console.log("keep alive")
                // Keep alive signal received. Do nothing.
            }
        }
      });

      stream.on('error', (error) => {
          console.log('error', Object.getOwnPropertyNames(error))
          console.log(error)
          console.log(error.stack)
          console.log(error.message)
          console.log(error.code)

          if (error.code !== 'ECONNRESET') {
            console.log(error.code);
            // process.exit(1);
        } else {
            // This reconnection logic will attempt to reconnect when a disconnection is detected.
            // To avoid rate limits, this logic implements exponential backoff, so the wait time
            // will increase if the client cannot reconnect to the stream. 
            setTimeout(() => {
                console.warn("A connection error occurred. Reconnecting...")
                this.startStream(++retryAttempt);
            }, 2 ** retryAttempt)
        }
      });

       stream.on('close', (error) => {
        console.log('CLOSE', error)
      });

      stream.on('finish', (error) => {
        console.log('FINISH', error)
      });

    });
  }
}
