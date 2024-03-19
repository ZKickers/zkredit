import { createContext, useEffect, useState } from "react";

const NavigationContext = createContext();

export default function NavigationProvider({ children }) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener("popstate", handler);
    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPath(to);
  };

  return (
    <NavigationContext.Provider value={{ path, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export { NavigationProvider };
