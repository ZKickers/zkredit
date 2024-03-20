import classNames from "classnames";
import useNavigation from "hooks/use-navigation";

export default function Link({ to, children, className, activeClassName }) {
  const { navigate, path } = useNavigation();

  const classes = classNames(className, path === to && activeClassName);

  const handleClick = (event) => {
    if (event.metaKey || event.ctrlKey) {
      return;
    }

    event.preventDefault();
    navigate(to);
  };

  return (
    <a
      className={classes}
      href={to}
      onClick={handleClick}
      style={{ textDecoration: "none", cursor: "pointer" }}
    >
      {" "}
      {children}{" "}
    </a>
  );
}
