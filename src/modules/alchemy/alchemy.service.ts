import { Injectable } from '@nestjs/common';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

import { ClaimsService } from '../claims/claims.service';
import { UsersService } from '../users/users.service';
import { SourcesService } from '../sources/sources.service';
import { TagsService } from '../tags/tags.service';
import { IPFSService } from '../ipfs/ipfs.service';
import claimABI from '../../common/abi/Claim.json';

@Injectable()
export class AlchemyService {
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly sourcesService: SourcesService,
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
    private readonly ipfsService: IPFSService,
  ) {}

  private readonly web3 = createAlchemyWeb3(process.env.ALCHEMY_API_URL);

  async startNFTMintsStream() {
    const claimContract = new this.web3.eth.Contract(
      claimABI as any,
      process.env.CLAIM_CONTRACT_ADDRESS,
    );

    const handleData = async (data) => {
      const tokenID = parseInt(data.topics[3]);

      try {
        const tokenURI = await claimContract.methods.tokenURI(tokenID).call();
        const tokenCID = tokenURI.replace(/^ipfs:\/\//, '');

        console.log(data);
        console.log(tokenID);
        console.log(tokenURI);
        console.log(tokenCID);

        const metadata = await this.ipfsService.cat(tokenCID);
        console.log(metadata);
      } catch (e) {
        console.log(e);
      }
      // const tweetId = tweet.in_reply_to_status_id_str;

      // // If the reply is dedicated to a user and not a status,
      // // go to next item of the loop
      // if (!tweetId) return;

      // const existingClaimForTweet = await this.claimsService.findOne({
      //   where: { tweetId },
      // });

      // if (existingClaimForTweet) return;

      // // Create claim template and post link to tweet
      // this.twit.get(`statuses/show/${tweetId}`, async (error, tweet) => {
      //   if (error) {
      //     console.error(error);
      //     return;
      //   }

      //   const tweetOwner = tweet.user.screen_name;

      //   const user = await this.usersService.findOne({
      //     where: { username: 'fractalflowsbot' },
      //   });
      //   const sources = await this.sourcesService.save([
      //     {
      //       origin: 'twitter',
      //       url: `https://twitter.com/${tweetOwner}/status/${tweetId}`,
      //     },
      //     ...(tweet.entities.urls.map(({ expanded_url }) => ({
      //       origin: 'other',
      //       url: expanded_url,
      //     })) || []),
      //   ]);
      //   const tags = await this.tagsService.save(
      //     tweet.entities.hashtags
      //       .slice(0, 4)
      //       .map(({ text }) => ({ label: text })),
      //   );
      //   const claim = await this.claimsService.create({
      //     title: tweet.text || 'No title in this tweet',
      //     summary: `This claim was originally posted on Twitter by @${tweetOwner}. No further details are available as of yet.`,
      //     user,
      //     sources,
      //     tags: tags.identifiers,
      //     tweetId,
      //     tweetOwner,
      //     origin: ClaimOrigins.TWITTER,
      //   });

      //   const claimLink = `${process.env.FRONTEND_HOST}/claim/${claim.slug}`;
      //   const hashtags = tweet.entities.hashtags
      //     .map(({ text }) => `#${text}`)
      //     .join(' ');
      //   const status = `A new claim was just added: ${claimLink} ${hashtags}`;

      //   if (process.env.APP_ENV === 'development') return;

      //   // Reply back the claim link to the tweet
      //   this.twit.post('statuses/update', {
      //     status: `@${tweetOwner} ${claimLink}`,
      //     in_reply_to_status_id: tweetId,
      //   });

      //   // Post the claim link to the app page
      //   this.twit.post('statuses/update', {
      //     status,
      //   });
      // });
    };

    const zeroTopic =
      '0x0000000000000000000000000000000000000000000000000000000000000000';
    const mintEvents = {
      address: process.env.CLAIM_CONTRACT_ADDRESS,
      topics: [process.env.CLAIM_TRANSFER_TOPIC, zeroTopic],
    };

    const web3ws = createAlchemyWeb3(process.env.ALCHEMY_WS_API_URL);

    web3ws.eth.subscribe('logs', mintEvents).on('data', handleData);
  }
}
