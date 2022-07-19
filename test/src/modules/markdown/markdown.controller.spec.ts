import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { MarkdownController } from "~/modules/markdown/markdown.controller";
describe("MarkdownController", () => {
  let controller: MarkdownController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarkdownController],
    }).compile();

    controller = module.get<MarkdownController>(MarkdownController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
