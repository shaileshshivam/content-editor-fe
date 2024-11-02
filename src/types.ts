export interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: string;
  createdBy?: string;
  lockedBy?: string;
  version?: number;
}

export interface EditorState {
  documents: Document[];
  selectedDocId: string | null;
  documentLocks: Record<string, string>;
  activeEditors: Record<string, Record<string, boolean>>;
  error: string | null;
  isLoading: boolean;
  socketConnected: boolean;
}

export type EditorAction =
  | { type: "SET_DOCUMENTS"; payload: Document[] }
  | { type: "SELECT_DOCUMENT"; payload: string }
  | { type: "UPDATE_DOCUMENT"; payload: Document }
  | { type: "SET_DOCUMENT_LOCKS"; payload: Record<string, string> }
  | {
      type: "SET_ACTIVE_EDITORS";
      payload: Record<string, Record<string, boolean>>;
    }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SOCKET_CONNECTED"; payload: boolean };
