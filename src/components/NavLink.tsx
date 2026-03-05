import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ClassNameProp = string | ((props: { isActive: boolean; isPending: boolean }) => string);
type ChildrenProp = ReactNode | ((props: { isActive: boolean; isPending: boolean }) => ReactNode);

interface NavLinkCompatProps extends Omit<NavLinkProps, "className" | "children"> {
  className?: ClassNameProp;
  activeClassName?: string;
  pendingClassName?: string;
  children?: ChildrenProp;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, children, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) => {
          const base = typeof className === "function"
            ? className({ isActive, isPending })
            : cn(className, isActive && activeClassName, isPending && pendingClassName);
          return base;
        }}
        {...props}
      >
        {typeof children === "function"
          ? ({ isActive, isPending }) => children({ isActive, isPending })
          : children}
      </RouterNavLink>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
