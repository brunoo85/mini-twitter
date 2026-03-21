import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Providers } from "./providers";

export function renderWithProviders(ui: ReactElement) {
  return render(ui, { wrapper: Providers });
}
