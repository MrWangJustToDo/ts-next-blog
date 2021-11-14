import { Hover } from "components/Hover";
import { UserHoverItem } from "./hoverItem";
import { UserHoverType } from "types/components";

export const UserHover: UserHoverType = (props) => {
  const { userId, children = null } = props;
  if (userId && children) {
    return (
      <Hover
        hoverItem={
          <div className="bg-white small rounded" style={{ lineHeight: "1.25em", width: "220px" }}>
            <UserHoverItem {...props} />
          </div>
        }
      >
        {children}
      </Hover>
    );
  } else {
    return children;
  }
};
