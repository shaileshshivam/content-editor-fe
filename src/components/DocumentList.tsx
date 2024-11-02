import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import { ConnectionIndicator } from "./ConnectionStatus";
import { DescriptionOutlined as DocumentIcon } from "@mui/icons-material";
import { DocumentStatus } from "./DocumentStatus";
import { EditorState, Document } from "../types";

const Documents = styled(Paper)(({ theme }) => ({
  width: "350px",
  height: "100%",
  overflow: "auto",
  padding: theme.spacing(2),
}));

const DocumentList: React.FC<{
  isConnected: boolean;
  isLoading: boolean;
  documents: Document[];
  userId: string;
  selectedDocId?: string;
  onDocumentSelect: (docId: string) => unknown;
  documentLocks: EditorState["documentLocks"];
}> = ({
  isConnected,
  isLoading,
  documents,
  userId,
  selectedDocId,
  onDocumentSelect,
  documentLocks,
}) => {
  return (
    <Documents elevation={2}>
      <ConnectionIndicator isConnected={isConnected} />
      <Typography variant="h6" gutterBottom>
        Documents {isLoading && "(Loading...)"}
      </Typography>

      <List>
        {documents.map((doc) => (
          <ListItem
            key={doc.id}
            disablePadding
            sx={{
              mb: 1,
              backgroundColor:
                documentLocks[doc.id] === userId
                  ? "rgba(76, 175, 80, 0.1)"
                  : "inherit",
            }}
          >
            <ListItemButton
              selected={!!selectedDocId && selectedDocId === doc.id}
              onClick={() => onDocumentSelect(doc.id)}
              disabled={isLoading}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                "&:hover": {
                  backgroundColor:
                    documentLocks[doc.id] === userId
                      ? "rgba(76, 175, 80, 0.2)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DocumentIcon sx={{ mr: 2, color: "primary.main" }} />
                <ListItemText
                  primary={doc.title}
                  secondary={new Date(doc.lastModified).toLocaleString()}
                  primaryTypographyProps={{
                    variant: "body1",
                    fontWeight: selectedDocId === doc.id ? "bold" : "normal",
                  }}
                />
              </Box>
              <DocumentStatus
                docId={doc.id}
                locks={documentLocks}
                currentUserId={userId}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Documents>
  );
};

export { DocumentList };
