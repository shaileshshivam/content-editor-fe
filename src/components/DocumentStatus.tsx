import { Box, styled, Tooltip } from "@mui/material";
import {
  LockOutlined as LockIcon,
  LockOpenOutlined as UnlockIcon,
  EditOutlined as EditIcon,
} from "@mui/icons-material";

const StatusIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginLeft: theme.spacing(1),
}));

const DocumentStatus: React.FC<{
  docId: string;
  locks: Record<string, string>;
  currentUserId: string;
}> = ({ docId, locks, currentUserId }) => {
  const isLocked = !!locks[docId];
  const isLockedByMe = locks[docId] === currentUserId;

  return (
    <Tooltip
      title={
        isLocked
          ? isLockedByMe
            ? "You are currently editing"
            : "Locked by another user"
          : "Available for editing"
      }
    >
      <StatusIcon>
        {isLocked ? (
          isLockedByMe ? (
            <EditIcon sx={{ color: "success.main" }} />
          ) : (
            <LockIcon sx={{ color: "warning.main" }} />
          )
        ) : (
          <UnlockIcon sx={{ color: "success.light" }} />
        )}
      </StatusIcon>
    </Tooltip>
  );
};

export { DocumentStatus };
