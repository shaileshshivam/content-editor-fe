import { EditorAction, EditorState, Document } from "../types";

const initialState: EditorState = {
  documents: [],
  selectedDocId: null,
  documentLocks: {},
  activeEditors: {},
  error: null,
  isLoading: true,
  socketConnected: false,
};

const editorReducer = (
  state: EditorState = initialState,
  action: EditorAction
): EditorState => {
  switch (action.type) {
    case "SET_DOCUMENTS":
      return { ...state, documents: action.payload };
    case "SELECT_DOCUMENT":
      return { ...state, selectedDocId: action.payload };
    case "UPDATE_DOCUMENT":
      return {
        ...state,
        documents: state.documents.map((doc: Document) =>
          doc.id === action.payload.id ? action.payload : doc
        ),
      };
    case "SET_DOCUMENT_LOCKS":
      return { ...state, documentLocks: action.payload };
    case "SET_ACTIVE_EDITORS":
      return { ...state, activeEditors: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SOCKET_CONNECTED":
      return { ...state, socketConnected: action.payload };
    default:
      return state;
  }
};

export { editorReducer, initialState };
