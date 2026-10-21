import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

// Context lets us share the wishlist with any component
// without passing props down every level.
const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  // The wishlist is just a list of product ids.
  // useLocalStorage keeps it saved even after a page reload.
  const [ids, setIds] = useLocalStorage("wishflow:ids", []);

  // Add the id if it's not there, remove it if it is.
  function toggle(id) {
    if (ids.includes(id)) {
      setIds(ids.filter((item) => item !== id));
    } else {
      setIds([...ids, id]);
    }
  }

  function remove(id) {
    setIds(ids.filter((item) => item !== id));
  }

  function clear() {
    setIds([]);
  }

  // Check if a product is already in the wishlist.
  function has(id) {
    return ids.includes(id);
  }

  const value = {
    ids,
    count: ids.length,
    has,
    toggle,
    remove,
    clear,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// A small helper so components can read the wishlist easily.
export function useWishlist() {
  return useContext(WishlistContext);
}
