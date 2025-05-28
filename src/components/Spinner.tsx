import { Loader } from "lucide-react";
import React, { ComponentPropsWithRef } from "react";
type Props = ComponentPropsWithRef<"div">;
const Spinner: React.FC<Props> = (props) => {
  return (
    <div className="flex justify-center" {...props}>
      <Loader className="text-pop-green/75 animate-spin" />
    </div>
  );
};

export default Spinner;
