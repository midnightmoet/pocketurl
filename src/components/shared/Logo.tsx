import { Title, TitleProps } from "@mantine/core";
import { useRouter } from "next/router";

export const Logo: React.FC<TitleProps & { link?: boolean }> = ({
  order = 3,
  link = false,
  sx,
}) => {
  const router = useRouter();
  return (
    <Title
      style={{
        userSelect: "none",
        cursor: "pointer",
      }}
      onClick={() => link && router.push("/")}
      order={order}
      sx={sx}
    >
      Shorty
    </Title>
  );
};
