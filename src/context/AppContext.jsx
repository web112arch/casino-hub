// AppContext.js
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";

const AppContext = createContext(null);

// --------------------
// Search reducer
// --------------------
const initialSearchState = {
  searchQuery: "",
  selectedProvider: "All",
  selectedSort: "All",
  selectedCollection: "All",
  selectedTrait: "All",
};

const searchReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "UPDATE_PROVIDER":
      return { ...state, selectedProvider: action.payload };
    case "UPDATE_SORT":
      return { ...state, selectedSort: action.payload };
    case "UPDATE_COLLECTION":
      return { ...state, selectedCollection: action.payload };
    case "UPDATE_TRAIT":
      return { ...state, selectedTrait: action.payload };
    case "RESET_SEARCH":
      return initialSearchState;
    default:
      return state;
  }
};

// Hook opcional (recomendado)
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider />");
  return ctx;
};

const AppProvider = ({ children }) => {
  // UI state
  const [selectedOption, setSelectedOption] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prevSidebarOpen, setPrevSidebarOpen] = useState(false);

  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [isChatBoxCollapsed, setIsChatBoxCollapsed] = useState(false);
  const [prevChatBoxOpen, setPrevChatBoxOpen] = useState(false);

  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [isTabletScreen, setIsTabletScreen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [onClickFunctionNext, setOnClickFunctionNext] = useState(null);
  const [onClickFunctionPrev, setOnClickFunctionPrev] = useState(null);

  // Feature state
  const [sportsSelectedOption, setSportsSelectedOption] = useState("/home");
  const [selectedOptionCashier, setSelectedOptionCashier] = useState("Deposit");
  const [selectedSport, setSelectedSport] = useState("/soccer");

  // Search state via reducer
  const [searchState, dispatchSearch] = useReducer(
    searchReducer,
    initialSearchState
  );

  // --------------------
  // Stable update fns
  // --------------------
  const updateSelectedOption = useCallback((v) => setSelectedOption(v), []);
  const updateSidebar = useCallback((v) => setIsSidebarOpen(v), []);
  const updatePrevSidebar = useCallback((v) => setPrevSidebarOpen(v), []);

  const updateChatBox = useCallback((v) => setIsChatBoxOpen(v), []);
  const updateChatBoxCollapsed = useCallback(
    (v) => setIsChatBoxCollapsed(v),
    []
  );
  const updatePrevChatBox = useCallback((v) => setPrevChatBoxOpen(v), []);

  const updateMobileScreen = useCallback((v) => setIsMobileScreen(v), []);
  const updateTabletScreen = useCallback((v) => setIsTabletScreen(v), []);

  const toggleDropdown = useCallback((v) => setOpenDropdown(v), []);
  const updateLoggedIn = useCallback((v) => setIsLoggedIn(v), []);

  const updateOnClickFunctionNext = useCallback(
    (fn) => setOnClickFunctionNext(() => fn),
    []
  );
  const updateOnClickFunctionPrev = useCallback(
    (fn) => setOnClickFunctionPrev(() => fn),
    []
  );

  const updateSportsSelectedOption = useCallback(
    (v) => setSportsSelectedOption(v),
    []
  );
  const updateCashierOption = useCallback(
    (v) => setSelectedOptionCashier(v),
    []
  );
  const updateSelectedSport = useCallback((v) => setSelectedSport(v), []);

  // Search actions
  const updateSearch = useCallback(
    (query) => dispatchSearch({ type: "UPDATE_SEARCH", payload: query }),
    []
  );
  const updateProvider = useCallback(
    (provider) => dispatchSearch({ type: "UPDATE_PROVIDER", payload: provider }),
    []
  );
  const updateSort = useCallback(
    (sort) => dispatchSearch({ type: "UPDATE_SORT", payload: sort }),
    []
  );
  const updateCollection = useCallback(
    (collection) =>
      dispatchSearch({ type: "UPDATE_COLLECTION", payload: collection }),
    []
  );
  const updateTrait = useCallback(
    (trait) => dispatchSearch({ type: "UPDATE_TRAIT", payload: trait }),
    []
  );
  const resetSearch = useCallback(
    () => dispatchSearch({ type: "RESET_SEARCH" }),
    []
  );

  // --------------------
  // Memoized context value
  // --------------------
  const value = useMemo(
    () => ({
      // state
      selectedOption,
      isSidebarOpen,
      prevSidebarOpen,
      isChatBoxOpen,
      isChatBoxCollapsed,
      prevChatBoxOpen,
      isMobileScreen,
      isTabletScreen,
      openDropdown,
      isLoggedIn,
      onClickFunctionNext,
      onClickFunctionPrev,
      searchState,
      sportsSelectedOption,
      selectedOptionCashier,
      selectedSport,

      // actions
      updateSelectedOption,
      updateSidebar,
      updatePrevSidebar,
      updateChatBox,
      updateChatBoxCollapsed,
      updatePrevChatBox,
      updateMobileScreen,
      updateTabletScreen,
      toggleDropdown,
      updateLoggedIn,
      updateOnClickFunctionNext,
      updateOnClickFunctionPrev,
      updateSportsSelectedOption,
      updateCashierOption,
      updateSelectedSport,

      // search actions
      updateSearch,
      updateProvider,
      updateSort,
      updateCollection,
      updateTrait,
      resetSearch,

      // advanced (se precisar)
      dispatchSearch,
    }),
    [
      selectedOption,
      isSidebarOpen,
      prevSidebarOpen,
      isChatBoxOpen,
      isChatBoxCollapsed,
      prevChatBoxOpen,
      isMobileScreen,
      isTabletScreen,
      openDropdown,
      isLoggedIn,
      onClickFunctionNext,
      onClickFunctionPrev,
      searchState,
      sportsSelectedOption,
      selectedOptionCashier,
      selectedSport,

      updateSelectedOption,
      updateSidebar,
      updatePrevSidebar,
      updateChatBox,
      updateChatBoxCollapsed,
      updatePrevChatBox,
      updateMobileScreen,
      updateTabletScreen,
      toggleDropdown,
      updateLoggedIn,
      updateOnClickFunctionNext,
      updateOnClickFunctionPrev,
      updateSportsSelectedOption,
      updateCashierOption,
      updateSelectedSport,

      updateSearch,
      updateProvider,
      updateSort,
      updateCollection,
      updateTrait,
      resetSearch,

      dispatchSearch,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
