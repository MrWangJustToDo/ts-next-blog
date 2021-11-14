import { ManageLeft } from "./manageLeft";
import { ManageRight } from "./manageRight";

export const Manage = ({ userId }: { userId: string }) => {
  return (
    <div className="row px-lg-4 px-sm-2">
      <ManageLeft userId={userId} />
      <ManageRight />
    </div>
  );
};
