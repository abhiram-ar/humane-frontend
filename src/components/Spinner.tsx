import { Loader } from "lucide-react";
import React, { ComponentPropsWithRef } from "react";
type Props = ComponentPropsWithRef<"div"> & { spinnerColor?: "black" | "pop-green/75" };

const Spinner: React.FC<Props> = ({ spinnerColor = "pop-green/75", ...props }) => {
  return (
    <div className="flex justify-center" {...props}>
      <Loader className={`text-${spinnerColor} animate-spin`} />
    </div>
  );
};

export default Spinner;
