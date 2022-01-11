import { Injectable } from '@nestjs/common';
import TwitterApi, { ETwitterStreamEvent } from 'twitter-api-v2';
import Twit from 'twit';
import crypto from 'crypto';

import { ClaimsService } from '../claims/claims.service';
import { UsersService } from '../users/users.service';
import { SourcesService } from '../sources/sources.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class TwitterService {
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly sourcesService: SourcesService,
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
  ) {}

  private readonly twitterClient = new TwitterApi(
    process.env.TWITTER_BEARER_TOKEN,
  );
  private readonly twit = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET,
  });

  async startStreamV1() {
    const handleData = async (tweet) => {
      const tweetId = tweet.in_reply_to_status_id_str;
      const tweetReplyId = tweet.id;
      // If the reply is dedicated to a user and not a status,
      // go to next item of the loop
      if (!tweetId) return;

      const existingClaimForTweet = await this.claimsService.findOne({
        where: { tweet: tweetId },
      });

      if (existingClaimForTweet) return;

      // Create claim template and post link to tweet
      this.twit.get(`statuses/show/${tweetId}`, async (error, tweet) => {
        if (error) {
          console.error(error);
          return;
        }

        const userScreenName = tweet.user.screen_name;
        const ownershipToken = crypto.randomBytes(24).toString('hex');

        const user = await this.usersService.findOne({
          where: { username: 'fractalflowsbot' },
        });
        const sources = await this.sourcesService.save([
          {
            origin: 'twitter',
            url: `https://twitter.com/${userScreenName}/status/${tweetId}`,
          },
          ...(tweet.entities.urls.map(({ expanded_url }) => ({
            origin: 'other',
            url: expanded_url,
          })) || []),
        ]);
        const claim = await this.claimsService.create({
          title:
            tweet.text.substring(0, tweet.text.lastIndexOf(' ')) ||
            'No title in this tweet',
          summary: `This claim was originally posted on Twitter by @${userScreenName}. No further details are available as of yet.`,
          user,
          sources,
          tweet: tweetId,
          tweetReply: tweetReplyId,
          ownershipToken,
        });

        const claimLink = `${process.env.FRONTEND_HOST}/claim/${claim.slug}`;
        const hashtags = tweet.entities.hashtags
          .map(({ text }) => `#${text}`)
          .join(' ');
        const status = `A new claim was just added: ${claimLink} ${hashtags}`;

        // Reply back the claim link to the tweet
        this.twit.post('statuses/update', {
          status: `@${userScreenName} ${claimLink}`,
          in_reply_to_status_id: tweetId,
        });

        // Post the claim link to the app page
        this.twit.post('statuses/update', {
          status,
        });

        // Send the tweet owner a direct message containing the link
        // they will use to become owner of the claim just created
        // this.twit.post('direct_messages/events/new', {
        //   event: {
        //     type: 'message_create',
        //     message_create: {
        //       target: { recipient_id: tweet.user.id_str },
        //       message_data: {
        //         text: `Fractal Flows is now hosting a claim that was was originally posted on Twitter by you. Please click on the link to become owner of the claim, with editing rights: ${claimLink}/own?token=${ownershipToken}`,
        //       },
        //     },
        //   },
        // });
      });
    };

    const stream = this.twit.stream('statuses/filter', { track: '#ffclaimit' });
    stream.on('tweet', handleData);
  }

  // async startStream() {
  //   // is: reply;
  //   const streamRule = { value: '#ffclaimit' };
  //   const streamRules = await this.twitterClient.v2.streamRules();

  //   await this.twitterClient.v2.updateStreamRules({
  //     delete: {
  //       ids: ['1480631016544997377'],
  //     },
  //   });
  //   await this.twitterClient.v2.updateStreamRules({
  //     add: [{ value: 'euphoria' }],
  //   });
  //   // console.log(x);
  //   // if (
  //   //   streamRules.data.find(({ value }) => value === streamRule.value) ===
  //   //   undefined
  //   // ) {
  //   //   await this.twitterClient.v2.updateStreamRules({
  //   //     add: [streamRule],
  //   //   });
  //   // }

  //   const stream = this.twitterClient.v2.searchStream({
  //     autoConnect: false,
  //   });

  //   stream.on(ETwitterStreamEvent.Data, (d, a, b) => {
  //     console.log('new tweet');
  //     console.log(d, a, b);
  //   });

  //   stream.on(ETwitterStreamEvent.Error, (d, a, b) => {
  //     console.log('ERROR', d, a, b);
  //   });

  //   stream.on(ETwitterStreamEvent.Connected, (d, a, b) => {
  //     console.log('connected');
  //   });

  //   stream.on(
  //     // Emitted when a Twitter sent a signal to maintain connection active
  //     ETwitterStreamEvent.DataKeepAlive,
  //     () => console.log('Twitter has a keep-alive packet.'),
  //   );

  //   console.log(stream);
  //   console.log(streamRules);

  //   // await stream.connect({
  //   //   autoReconnect: true,
  //   //   autoReconnectRetries: Infinity,
  //   // });
  // }
}
