import { Box, Typography } from "@mui/material";
import type { CSSProperties, ReactNode } from "react";

interface NavbarProps {
  children: ReactNode;
  justifyContent: CSSProperties["justifyContent"];
}

export const navbarHeight = 55;

export const Navbar = ({ children, justifyContent }: NavbarProps) => {
  return (
    <Box sx={{ boxShadow: 3 }}>
      <Box
        sx={{
          display: "flex",
          height: `${navbarHeight}px`,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", paddingLeft: 4 }}>
          <Typography variant="h6">Calendar</Typography>
        </Box>
        <Box sx={{ paddingX: { xs: 1, sm: 4 }, width: "100%", alignItems: "center", display: "flex", justifyContent }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
