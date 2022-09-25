import type { ReactNode } from "react";
import { Header } from "./Header";

export const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};
