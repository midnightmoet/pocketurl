import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => {
  return {
    header: {
      width: "95%",
      borderRadius: theme.radius.md,
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
      marginLeft: "auto",
      marginRight: "auto",
      background: theme.primaryColor,
      padding: `${theme.spacing.sm}px ${theme.spacing.sm}px`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minWidth: 400,
    },
  };
});
