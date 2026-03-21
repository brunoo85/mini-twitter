import { expect, test } from "@playwright/test";

test.describe("Fluxo principal", () => {
  test("usuário loga e cria um post", async ({ page }) => {
    test.setTimeout(120000);
    const posts: Array<Record<string, unknown>> = [];

    await page.route("**://localhost:3000/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          token: "token-e2e",
          user: { id: 1, name: "Bruno", email: "bruno@mail.com" },
        }),
      });
    });

    await page.route("**://localhost:3000/posts**", async (route, request) => {
      if (request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            posts,
            total: posts.length,
            page: 1,
            limit: 10,
          }),
        });
        return;
      }

      if (request.method() === "POST") {
        const body = request.postDataJSON() as {
          title: string;
          content: string;
          image?: string;
        };

        const newPost = {
          id: posts.length + 1,
          title: body.title,
          content: body.content,
          image: body.image,
          authorId: 1,
          authorName: "Bruno",
          createdAt: Date.now(),
          likesCount: 0,
        };

        posts.unshift(newPost);
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(newPost),
        });
        return;
      }

      await route.continue();
    });

    const response = await page.goto("/login");
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByText("Mini Twitter")).toBeVisible({ timeout: 60000 });

    await page.getByPlaceholder("Insira o seu e-mail").fill("bruno@mail.com");
    await page.getByPlaceholder("Insira a sua senha").fill("123456");
    await page.getByRole("button", { name: "Continuar" }).click();

    await expect(page).toHaveURL("/");

    const editor = page.locator(".ProseMirror");
    await editor.click();
    await page.keyboard.type("Meu titulo de teste\nConteudo do post");

    await page.getByRole("button", { name: "Postar" }).click();
    await expect(page.getByText("Meu titulo de teste")).toBeVisible();
  });
});
