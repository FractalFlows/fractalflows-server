import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class IPFSService {
  constructor(private httpService: HttpService) {}

  async cat(cid: string) {
    return new Promise(async (resolve, reject) => {
      this.httpService
        .get(`${process.env.IPFS_NODE_URL}/ipfs/${cid}`)
        .subscribe((response) => {
          if (response.status !== 200) {
            reject('Error fetching from IPFS');
          }

          const { data } = response;
          resolve(data);
        });
    });
  }
}
