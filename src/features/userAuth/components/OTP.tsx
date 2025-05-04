import React, { useState } from "react";
import AuthBlock from "./AuthBlock";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import CountdownTimer from "@/components/CountdownTime";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type Props = {
  email: string | undefined;
  handleOTPVerification: (enteredOTP: string) => void;
  isVerifyDisabled?: boolean;
  handleOTPResent: () => void;
};

const OTP: React.FC<Props> = ({
  email,
  handleOTPVerification,
  isVerifyDisabled,
  handleOTPResent,
}) => {
  const [otp, setOtp] = useState("");
  const [isResendDisabled, setResendDisabled] = useState(false);

  const OTPResendExpiryInSeconds = 60;

  return (
    <AuthBlock>
      <p className="text-offwhite mb-2 text-center font-medium">
        Enter OTP sent to {email || "temp@email.com"}
      </p>
      <div className="text-offwhite mx-auto w-fit">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={(value) => setOtp(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="bg-green-subtle text-black" />
            <InputOTPSlot index={1} className="bg-green-subtle text-black" />
            <InputOTPSlot index={2} className="bg-green-subtle text-black" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="bg-green-subtle text-black" />
            <InputOTPSlot index={4} className="bg-green-subtle text-black" />
            <InputOTPSlot index={5} className="bg-green-subtle text-black" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* resent opt button */}
      <div className="mt-3">
        <button
          disabled={isResendDisabled}
          onClick={() => {
            handleOTPResent();
            setResendDisabled(true);
            setTimeout(() => setResendDisabled(false), OTPResendExpiryInSeconds * 1000);
          }}
          className={`underline ${isResendDisabled ? "text-zinc-400" : "text-offwhite font-semibold"}`}
        >
          Resend?
        </button>

        <span className="text-offwhite">
          {isResendDisabled && <CountdownTimer durationInSeconds={OTPResendExpiryInSeconds} />}
        </span>
      </div>

      {/* verify otp button */}
      <button
        className={`${
          isVerifyDisabled || otp.length < 4
            ? "hover: bg-zinc-400"
            : "bg-pop-green hover:bg-black hover:text-white"
        } " rounded-base active:bg-zinc-700" mt-5 w-full min-w-96 border-2 border-black px-3 py-2`}
        onClick={() => handleOTPVerification(otp)}
        disabled={isVerifyDisabled || otp.length < 4}
      >
        verify
      </button>
    </AuthBlock>
  );
};

export default OTP;
