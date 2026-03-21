import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginTab } from "./login-tab";
import { renderWithProviders } from "@/test/render-with-providers";

const navigateMock = vi.fn();
const loginMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/services/auth.service", () => ({
  authService: {
    login: (...args: unknown[]) => loginMock(...args),
  },
}));

describe("LoginTab", () => {
  it("mostra erro de validação quando senha é curta", async () => {
    renderWithProviders(
      <LoginTab showPassword={false} setShowPassword={() => {}} />,
    );

    await userEvent.type(
      screen.getByPlaceholderText("Insira o seu e-mail"),
      "user@mail.com",
    );
    await userEvent.type(screen.getByPlaceholderText("Insira a sua senha"), "123");
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(
      await screen.findByText("A senha deve conter no mínimo 6 caracteres"),
    ).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("salva token e navega no login com sucesso", async () => {
    loginMock.mockResolvedValueOnce({
      data: {
        token: "token-fake",
        user: { id: 1, name: "Bruno", email: "user@mail.com" },
      },
    });

    renderWithProviders(
      <LoginTab showPassword={false} setShowPassword={() => {}} />,
    );

    await userEvent.type(
      screen.getByPlaceholderText("Insira o seu e-mail"),
      "user@mail.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Insira a sua senha"),
      "123456",
    );
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));

    await waitFor(() => {
      expect(localStorage.getItem("token-user")).toBe("token-fake");
      expect(localStorage.getItem("auth-user")).toContain("Bruno");
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });
});
