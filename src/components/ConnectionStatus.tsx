import { Box, styled } from "@mui/material";
import {
  CheckCircleOutline as ConnectedIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";

const ConnectionStatus = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
}));

const ConnectionIndicator: React.FC<{ isConnected: boolean }> = ({
  isConnected,
}) => {
  return (
    <ConnectionStatus>
      {isConnected ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "success.main",
          }}
        >
          <ConnectedIcon sx={{ mr: 1 }} />
          Connected
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "error.main",
          }}
        >
          <ErrorIcon sx={{ mr: 1 }} />
          Disconnected
        </Box>
      )}
    </ConnectionStatus>
  );
};

export { ConnectionIndicator };
