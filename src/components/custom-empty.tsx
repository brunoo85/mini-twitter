import type { ReactNode } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

interface CustomEmptyProps {
  icon: ReactNode; // Permite passar o componente <MessageSquare />
  title: string;
  description: string;
}

export const CustomEmpty = ({ icon, title, description }: CustomEmptyProps) => {
  return (
    <Empty className="flex flex-col items-center justify-center p-8 text-center">
      <EmptyHeader className="mb-4 text-muted-foreground">
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
      </EmptyHeader>
      <EmptyTitle className="text-lg font-semibold">{title}</EmptyTitle>
      <EmptyDescription className="text-sm text-muted-foreground">
        {description}
      </EmptyDescription>
    </Empty>
  );
};
