import React from "react";
import { AvatarGroup, Avatar, Box, Typography, styled } from "@mui/material";

const StyledAvatarGroup = styled(AvatarGroup)(({ theme }) => ({
  "& .MuiAvatar-root": {
    width: 32,
    height: 32,
    fontSize: "0.875rem",
    border: `2px solid ${theme.palette.background.paper}`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const UserCount = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(1),
  display: "flex",
  alignItems: "center",
}));

interface UserBadgeListProps {
  users: string[];
  maxVisible?: number;
}

const UserBadgeList: React.FC<UserBadgeListProps> = ({
  users,
  maxVisible = 3,
}) => {
  const uniqueUsers = Array.from(new Set(users));

  const generateInitials = (userId: string) => {
    return userId.slice(0, 2).toUpperCase();
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}
    >
      {uniqueUsers.length > 0 ? (
        <>
          <StyledAvatarGroup
            max={maxVisible}
            total={uniqueUsers.length}
            spacing="medium"
          >
            {uniqueUsers.map((userId) => (
              <Avatar key={userId}>{generateInitials(userId)}</Avatar>
            ))}
          </StyledAvatarGroup>
          {uniqueUsers.length > 0 && (
            <UserCount variant="body1">
              {uniqueUsers.length} active collaborator
              {uniqueUsers.length !== 1 ? "s" : ""}
            </UserCount>
          )}
        </>
      ) : null}
    </Box>
  );
};

export { UserBadgeList };
