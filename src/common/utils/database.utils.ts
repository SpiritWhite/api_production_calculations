/* eslint-disable prettier/prettier */
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { type DataSource } from 'typeorm';

export class DataBaseUtils {

  private readonly logger = new Logger('DataBaseUtils');

  constructor(
    private readonly connection: DataSource, 
    ) {}

  public async executeSP<T>(name: string, parameters?: object): Promise<T> {
    try {
      let query = `EXECUTE ${name}`;
      if (parameters != undefined && parameters != null) {
        const values: any[] = Object.values(parameters);
        query += await this.createSp(parameters);
        return await this.connection.query<T>(query, values);
      } else {
        return await this.connection.query<T>(query);
      }
    } catch (error) {
      this.logger.error(`Error while call SP ${error.message}`);
      throw new InternalServerErrorException(`Contact Technical Support`);
    }
  }

  private async createSp(parameters: object) {
    try {
      const keys: string[] = Object.keys(parameters);
      let additionalQuery: string = "";
      for (let i = 0; i < keys.length; i++) {
        additionalQuery += ` @${keys[i]}=@${i},`;
      }
      additionalQuery = additionalQuery.substring(0, additionalQuery.length - 1);
      return additionalQuery;
    } catch (error) {
      this.logger.error(`Error while call SP ${error.message}`);
      throw new InternalServerErrorException(`Contact Technical Support`);
    }
  }
}
