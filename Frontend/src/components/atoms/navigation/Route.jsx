import useNavigation from "hooks/use-navigation";

export default function Route({ routePath, children }) {
  const { path } = useNavigation();

  if (routePath === path) {
    return children;
  }

  return null;
}
