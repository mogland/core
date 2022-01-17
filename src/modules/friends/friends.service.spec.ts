import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friends } from "./friends.entity";
import { FriendsService } from "./friends.service";

describe("FriendsService", () => {
  let service: FriendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendsService],
      imports: [TypeOrmModule.forFeature([Friends])],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
