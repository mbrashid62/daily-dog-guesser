import "./SideBar.css";

type SideBarProps = {
  isSideBarOpen: boolean;
};

export const SideBar = ({ isSideBarOpen }: SideBarProps) => {
  return (
    <aside className={`sidebar-container ${isSideBarOpen ? "open" : "closed"}`}>
      <ul>
        <li>How does it work?</li>
        <li>See an issue?</li>
        <li>Have an idea?</li>
      </ul>
    </aside>
  );
};
