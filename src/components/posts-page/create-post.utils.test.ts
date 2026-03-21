import { describe, expect, it } from "vitest";
import { getPostPayloadFromText } from "./create-post.utils";

describe("getPostPayloadFromText", () => {
  it("usa a primeira linha como título e o resto como conteúdo", () => {
    const result = getPostPayloadFromText("Titulo do post\nLinha 1\nLinha 2");

    expect(result).toEqual({
      title: "Titulo do post",
      content: "Linha 1\nLinha 2",
    });
  });

  it("repete o título como conteúdo quando só há uma linha", () => {
    const result = getPostPayloadFromText("Somente título");

    expect(result).toEqual({
      title: "Somente título",
      content: "Somente título",
    });
  });

  it("retorna fallback quando texto está vazio", () => {
    const result = getPostPayloadFromText("");

    expect(result).toEqual({
      title: "Sem título",
      content: "Sem título",
    });
  });
});
