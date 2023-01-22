import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AddressDto, SignatureDto } from './app.dto';
import { AppService } from './app.service';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get('/')
  getHello(): string {
    return 'Hello World!';
  }

  @Get('/get-nonce')
  async getUser(@Query() addressDto: AddressDto) {
    console.log('addressDto', addressDto);
    const { address } = addressDto;
    let user = await this.userRepository.findOne({
      where: {
        address,
      },
    });
    if (!user) {
      const newUser = new User();
      newUser.address = address;
      user = await this.userRepository.save(newUser);
    }
    return { nonce: user.nonce };
  }

  @Post('/login')
  async signInWeb3(@Body() signatureDto: SignatureDto) {
    console.log('addressDto', signatureDto);
    const { address, signature } = signatureDto;
    const user = await this.userRepository.findOne({
      where: {
        address,
      },
    });

    const message = `Welcome! Click to sign in

Nonce: ${user.nonce}`;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    console.log('recoveredAddress', recoveredAddress);

    if (recoveredAddress === address) {
      user.nonce = uuidv4(); //reset nonce
      this.userRepository.save(user);

      const payload = { id: user.id, address };
      return payload;
    } else {
      return { error: true, message: 'invalid' };
    }
  }
}
