import { Test, TestingModule } from '@nestjs/testing';
import { BackupService } from '~/modules/backup/backup.service';
import { beforeEach, describe, expect, it } from "vitest";
describe('BackupService', () => {
  let service: BackupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackupService],
    }).compile();

    service = module.get<BackupService>(BackupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
