import React, {
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Alert,
  Container,
  styled,
  Snackbar,
} from "@mui/material";
import { Document } from "./types";
import { DescriptionOutlined as DocumentIcon } from "@mui/icons-material";
import { throttle } from "lodash";

import { UserBadgeList } from "./components/UserBadgeList";
import { useSocketConnection } from "./hooks/useSocketConnection";
import { API_HOST, INTERVAL } from "./constants";
import { DocumentList } from "./components/DocumentList";
import { editorReducer, initialState } from "./reducers/editorReducer";

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  height: "100vh",
}));

const EditorContainer = styled(Paper)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const Editor = styled(TextField)(() => ({
  flex: 1,
  "& .MuiInputBase-root": {
    height: "100%",
  },
  "& .MuiInputBase-input": {
    height: "100% !important",
    overflow: "auto !important",
  },
}));

const DocumentEditor: React.FC = () => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const { socket, userId } = useSocketConnection(dispatch);
  const throttledUpdateRef = useRef<any>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const response = await fetch(`${API_HOST}/documents`);
        if (!response.ok) throw new Error("Failed to fetch documents");
        const data = await response.json();
        dispatch({ type: "SET_DOCUMENTS", payload: data });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load documents" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    throttledUpdateRef.current = throttle(
      (updatedDoc: Document) => {
        socket.emit("document:content-change", {
          userId,
          docId: updatedDoc.id,
          doc: updatedDoc,
        });
      },
      INTERVAL,
      { leading: true, trailing: true }
    );

    return () => {
      throttledUpdateRef.current?.cancel();
    };
  }, [socket, userId]);

  const handleDocumentSelect = useCallback(
    (docId: string) => {
      if (state.selectedDocId && state.selectedDocId !== docId) {
        socket.emit("document:close", { userId, docId: state.selectedDocId });
        socket.emit("editor:lock-release", {
          userId,
          docId: state.selectedDocId,
        });
      }
      socket.emit("document:open", { userId, docId });
      dispatch({ type: "SELECT_DOCUMENT", payload: docId });
    },
    [socket, userId, state.selectedDocId]
  );

  const handleEditorFocus = useCallback(async () => {
    if (
      userId &&
      state.selectedDocId &&
      !state.documentLocks[state.selectedDocId]
    ) {
      try {
        await socket.emitWithAck("editor:lock-request", {
          userId,
          docId: state.selectedDocId,
        });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to lock document" });
      }
    }
  }, [socket, userId, state.selectedDocId, state.documentLocks]);

  const handleEditorBlur = useCallback(() => {
    if (!userId || !state.selectedDocId) return;
    if (state.documentLocks[state.selectedDocId] === userId) {
      throttledUpdateRef.current?.flush();
      socket.emit("editor:lock-release", {
        docId: state.selectedDocId,
        userId,
      });
    }
  }, [socket, userId, state.selectedDocId, state.documentLocks]);

  const handleContentChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { selectedDocId, documentLocks, documents } = state;
      if (!selectedDocId || documentLocks[selectedDocId] !== userId) return;

      const selectedDoc = documents.find((doc) => doc.id === selectedDocId);
      if (!selectedDoc) return;

      const updatedDoc = {
        ...selectedDoc,
        content: event.target.value,
        lastModified: new Date().toISOString(),
      };
      dispatch({ type: "UPDATE_DOCUMENT", payload: updatedDoc });
      throttledUpdateRef.current?.(updatedDoc);
    },
    [state, userId]
  );

  const selectedDoc = useMemo(
    () => state.documents.find((doc) => doc.id === state.selectedDocId),
    [state.documents, state.selectedDocId]
  );

  return (
    <StyledContainer maxWidth="xl">
      <DocumentList
        isConnected={state.socketConnected}
        documents={state.documents}
        documentLocks={state.documentLocks}
        isLoading={state.isLoading}
        onDocumentSelect={handleDocumentSelect}
        selectedDocId={selectedDoc?.id}
        userId={userId}
      />
      <EditorContainer elevation={2}>
        {selectedDoc ? (
          <>
            <Container
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h5">{selectedDoc.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Last modified:{" "}
                  {new Date(selectedDoc.lastModified).toLocaleString()}
                </Typography>
              </Box>
              <UserBadgeList
                users={Object.keys(state.activeEditors[selectedDoc.id] || {})}
                maxVisible={3}
              />
            </Container>

            {!!state.documentLocks[selectedDoc.id] &&
              state.documentLocks[selectedDoc.id] !== userId && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  This document is currently being edited by another user
                </Alert>
              )}
            <Editor
              fullWidth
              multiline
              variant="outlined"
              value={selectedDoc.content}
              onChange={handleContentChange}
              onFocus={handleEditorFocus}
              onBlur={handleEditorBlur}
              disabled={
                !!state.documentLocks[selectedDoc.id] &&
                state.documentLocks[selectedDoc.id] !== userId
              }
              placeholder="Start typing to lock the document..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor:
                    state.documentLocks[selectedDoc.id] === userId
                      ? "rgba(76, 175, 80, 0.05)"
                      : "inherit",
                },
              }}
            />
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <DocumentIcon sx={{ fontSize: 48, color: "text.secondary" }} />
            <Typography variant="subtitle1" color="text.secondary">
              Select a document to start editing
            </Typography>
          </Box>
        )}
      </EditorContainer>

      <Snackbar
        open={!!state.error}
        autoHideDuration={6000}
        onClose={() => dispatch({ type: "CLEAR_ERROR" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => dispatch({ type: "CLEAR_ERROR" })}
          severity="error"
          sx={{ width: "100%" }}
        >
          {state.error}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default DocumentEditor;
