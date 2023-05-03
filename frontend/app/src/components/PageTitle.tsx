import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  title: string;
}

const Title = ({ title }: Props) => {
  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', color: 'darkgray' }}>
        {title}
      </Typography>
    </Box>
  );
};

export default Title;
