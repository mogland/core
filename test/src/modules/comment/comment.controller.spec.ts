import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, expect, describe, it } from "vitest";
import { CommentController } from "~/modules/comment/comment.controller";

describe("CommentController", () => {
  let controller: CommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
