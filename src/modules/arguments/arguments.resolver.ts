import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ArgumentsService } from './arguments.service';
import { Argument } from './entities/argument.entity';
import { CreateArgumentInput } from './dto/create-argument.input';
import { UpdateArgumentInput } from './dto/update-argument.input';
import { UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ClaimsService } from '../claims/claims.service';
import { IPFS } from 'src/common/services/ipfs';
import { ArgumentInput } from './dto/argument.input';

@Resolver(() => Argument)
export class ArgumentsResolver {
  constructor(
    private readonly argumentsService: ArgumentsService,
    private readonly claimsService: ClaimsService,
  ) {}

  @Mutation(() => String)
  @UseGuards(SessionGuard)
  async saveArgumentOnIPFS(
    @Args('saveArgumentOnIPFSInput') argument: ArgumentInput,
  ) {
    const metadataURI = await IPFS.uploadArgumentMetadata(argument);
    return metadataURI;
  }

  @Mutation(() => Argument)
  @UseGuards(SessionGuard)
  async createArgument(
    @Args('claimSlug') claimSlug: string,
    @Args('createArgumentInput', { type: () => CreateArgumentInput })
    createArgumentInput: CreateArgumentInput,
    @CurrentUser() user: User,
  ) {
    const claim = await this.claimsService.findOne({
      where: { slug: claimSlug },
    });
    return await this.argumentsService.create({
      ...createArgumentInput,
      user,
      claim,
    });
  }

  @Query(() => Argument, { name: 'argument' })
  async findOne(@Args('id') id: string) {
    const argument = await this.argumentsService.findOne({
      where: { id },
      relations: [
        'user',
        'evidences',
        'comments',
        'comments.user',
        'comments.argument',
      ],
    });
    return argument;
  }

  @Query(() => [Argument], { name: 'arguments' })
  async findAll(@Args('claimSlug') claimSlug: string) {
    const claim = await this.claimsService.findOne({
      where: { slug: claimSlug },
      relations: ['arguments', 'arguments.opinions'],
    });
    return claim.arguments;
  }

  @Mutation(() => Argument)
  updateArgument(
    @Args('updateArgumentInput') updateArgumentInput: UpdateArgumentInput,
  ) {
    return this.argumentsService.update(
      updateArgumentInput.id,
      updateArgumentInput,
    );
  }

  @Mutation(() => Argument)
  removeArgument(@Args('id', { type: () => Int }) id: number) {
    return this.argumentsService.remove(id);
  }
}
