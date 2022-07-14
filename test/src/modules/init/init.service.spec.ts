import { Test, TestingModule } from "@nestjs/testing";
import { InitService } from "~/modules/init/init.service";
import { beforeEach, describe, expect, it } from "vitest";
describe("InitService", () => {
  let service: InitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitService],
    }).compile();

    service = module.get<InitService>(InitService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
