import NumberFlow from "@number-flow/react";
import React, { ComponentPropsWithoutRef } from "react";
import humaneMinimalIcon from "@/assets/humaneMinimalLogo.ico";
type Props = {
  score: number;
  showIcon?: boolean;
} & ComponentPropsWithoutRef<"div">;

const HumaneScoreNumberFlow: React.FC<Props> = ({
  score,
  showIcon = true,
  className,
  ...props
}) => {
  return (
    <div className={`flex w-fit items-center justify-center ${className} h-5`} {...props}>
      {showIcon && (
        <img
          className="-ms-1 -me-1 aspect-square h-full w-fit object-scale-down"
          src={humaneMinimalIcon}
          alt="icon"
        />
      )}
      <NumberFlow className="text-pop-green" value={score} />
    </div>
  );
};

export default HumaneScoreNumberFlow;
