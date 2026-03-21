export interface PostPayload {
  title: string;
  content: string;
}

export function getPostPayloadFromText(rawText: string): PostPayload {
  const lines = rawText.split("\n").filter((line) => line.trim() !== "");
  const title = lines[0]?.trim() || "Sem título";
  const content = lines.slice(1).join("\n").trim() || title;

  return { title, content };
}
