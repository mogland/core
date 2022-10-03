import { Injectable } from '@nestjs/common';
import { InjectModel } from '~/libs/database/src/model.transformer';
import { CommentsBasicModel } from './comments.model.basic';

@Injectable()
export class CommentsBasicService {
  constructor(
    @InjectModel(CommentsBasicModel)
    private readonly commentsBasicModel: MongooseModel<CommentsBasicModel>,
  ) {}

  async getAllComments() {
    return this.commentsBasicModel.find();
  }
}
