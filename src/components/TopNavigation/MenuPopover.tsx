import { useState, useRef, useEffect } from "react";

export const MenuPopover: React.FC<{
  children: React.ReactNode;
  pathname: string;
}> = ({ children, pathname }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setOpenMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (openMenu) {
      setOpenMenu(false);
    }
  }, [pathname]);

  return (
    <div className="menu-popover-trigger-container">
      <img
        alt="More Options Icon"
        onClick={() => setOpenMenu(!openMenu)}
        src="/menu.png"
      />
      <div
        className={`menu-popover-children-container ${openMenu ? "open" : "closed"}`}
        ref={popoverRef}
      >
        {children}
      </div>
    </div>
  );
};
