import { Test, TestingModule } from '@nestjs/testing';
import { BackupController } from '~/modules/backup/backup.controller';
import { beforeEach, describe, expect, it } from "vitest";
describe('BackupController', () => {
  let controller: BackupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackupController],
    }).compile();

    controller = module.get<BackupController>(BackupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
