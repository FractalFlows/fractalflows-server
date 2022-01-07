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

@Resolver(() => Argument)
export class ArgumentsResolver {
  constructor(
    private readonly argumentsService: ArgumentsService,
    private readonly claimsService: ClaimsService,
  ) {}

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

  @Query(() => [Argument], { name: 'arguments' })
  findAll() {
    return this.argumentsService.findAll();
  }

  @Query(() => Argument, { name: 'argument' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.argumentsService.findOne(id);
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
