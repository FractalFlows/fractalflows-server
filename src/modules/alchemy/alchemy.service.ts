import { Injectable } from '@nestjs/common';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

import { ClaimsService } from '../claims/claims.service';
import { UsersService } from '../users/users.service';
import { SourcesService } from '../sources/sources.service';
import { TagsService } from '../tags/tags.service';
import { IPFSService } from '../ipfs/ipfs.service';
import claimABI from '../../common/abi/Claim.json';
import { AttributionsService } from '../attributions/attributions.service';
import { ClaimMetadataInput } from '../claims/dto/claim-metadata.input';
import { UsernameSource } from '../users/entities/user.entity';
import { ClaimNFTStatuses } from '../claims/entities/claim.entity';

@Injectable()
export class AlchemyService {
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly sourcesService: SourcesService,
    private readonly attributionsService: AttributionsService,
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
    private readonly ipfsService: IPFSService,
  ) {}

  private readonly web3 = createAlchemyWeb3(process.env.ALCHEMY_API_URL);

  async startNFTMintsStream() {
    // const claimContract = new this.web3.eth.Contract(
    //   claimABI as any,
    //   process.env.CLAIM_CONTRACT_ADDRESS,
    // );

    const handleData = async (data) => {
      const claim = await this.claimsService.findOne({
        nftTxId: data.transactionHash,
      });
      const nftFractionalizationContractAddress = `0x${data.topics[2].slice(
        -40,
      )}`;
      const nftTokenId = String(parseInt(data.topics[3]));

      try {
        // const tokenURI = await claimContract.methods.tokenURI(tokenId).call();
        // const tokenCID = tokenURI.replace(/^ipfs:\/\//, '');
        // const recipientAddress = `0x${data.topics[2].slice(26)}`;

        // console.log(data);
        // console.log(tokenId);
        // console.log(tokenURI);
        // console.log(tokenCID);

        // const metadata = (await this.ipfsService.cat(
        //   tokenCID,
        // )) as ClaimMetadataInput;

        // console.log(metadata);

        if (data.removed) {
          await this.claimsService.update(claim.id, {
            nftTokenId: '',
            nftFractionalizationContractAddress: '',
            nftStatus: ClaimNFTStatuses.NOTMINTED,
          });
        } else {
          await this.claimsService.update(claim.id, {
            nftTokenId,
            nftFractionalizationContractAddress,
            nftStatus: ClaimNFTStatuses.MINTED,
          });

          // const sources = await this.sourcesService.save(
          //   metadata.properties.sources,
          // );
          // const attributions = await this.attributionsService.upsert(
          //   metadata.properties.attributions,²³
          // );
          // const tags = await this.tagsService.save(metadata.properties.tags);
          // const getUser = async (ethAddress) => {
          //   const user = await this.usersService.findOne({ ethAddress });
          //   if (user) {
          //     return user;
          //   } else {
          //     return await this.usersService.save({
          //       ethAddress,
          //       username: ethAddress,
          //       usernameSource: UsernameSource.CUSTOM,
          //     });
          //   }
          // };
          // const user = await getUser(recipientAddress);
          // const claim = await this.claimsService.create({
          //   title: metadata.name,
          //   summary: metadata.description,
          //   attributions: attributions.identifiers as any,
          //   sources,
          //   tags: tags.identifiers,
          //   tokenId,
          //   user,
          // });
          // this.claimsService.notifyNewlyAddedAttributions({
          //   attributions: claim.attributions,
          //   slug: claim.slug,
          //   title: claim.title,
          // });
        }
      } catch (e) {
        console.log(e);
      }
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
