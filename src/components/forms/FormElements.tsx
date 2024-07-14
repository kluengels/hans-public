import { passwordValidation } from "@/lib/types";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

export function EmailField({
  name = "email",
  fixedValue,
}: {
  name?: string;
  fixedValue?: string | undefined;
}) {
  if (!fixedValue) {
    return (
      <label htmlFor={name} className=" mt-4 flex flex-col">
        <span className="mb-1 text-sm">Your email-address</span>
        <input
          required
          type="email"
          placeholder="email"
          name={name}
          id={name}
          className="peer bg-gray-50 p-1 invalid:border-solid focus:border-action focus:outline-none focus:ring invalid:[&:not(:placeholder-shown):not(:focus)]:border-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-warning"
          autoComplete="email"
        ></input>
        <span className="mt-2 hidden text-sm text-warning peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
          Please enter a valid email address
        </span>
      </label>
    );
  } else {
    return (
      <label htmlFor={name} className="mt-4 flex flex-col">
        <span className="mb-1 text-sm">Your email-address</span>
        <input
          required
          type="email"
          placeholder="email"
          name={name}
          id={name}
          className=" bg-gray-50 p-1 invalid:border-solid focus:border-action focus:outline-none focus:ring invalid:[&:not(:placeholder-shown):not(:focus)]:border-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-warning"
          autoComplete="email"
          value={fixedValue}
          readOnly
        ></input>
      </label>
    );
  }
}

export function CurrentPasswordField() {
  return (
    <label htmlFor="password" className="mt-4 flex flex-col">
      <span className="mb-1 text-sm">Your password</span>
      <input
        required
        type="password"
        placeholder="password"
        name="password"
        id="password"
        autoComplete="current-password"
        minLength={6}
        className="peer bg-gray-50 p-1 invalid:border-solid focus:border-action focus:outline-none focus:ring invalid:[&:not(:placeholder-shown):not(:focus)]:border-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-warning"
      ></input>
      <span className="mt-2 hidden text-sm text-warning peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
        Your password is at least six characters long.
      </span>{" "}
    </label>
  );
}

export function NewPasswordField({
  name = "password",
  autocompleteValue = "new-password",
  valueState,
  valueSetter,
}: {
  name?: string;
  autocompleteValue?: string;
  valueState: string;
  valueSetter: Dispatch<SetStateAction<string>>;
}) {
  const [pwWarning, setPWwarning] = useState<boolean>(false);
  return (
    <label htmlFor={name} className="mt-4 flex flex-col">
      <span className="mb-1 text-sm">Your password </span>
      <input
        required
        type="password"
        placeholder="password (with uppercase and special char)"
        name={name}
        id={name}
        autoComplete={autocompleteValue}
        minLength={6}
        maxLength={20}
        value={valueState}
        onChange={(e) => {
          valueSetter(e.target.value);
          // regexCheck for special chars etc..
          if (!passwordValidation.test(e.target.value)) {
            setPWwarning(true);
          } else {
            setPWwarning(false);
          }
        }}
        className={`peer bg-gray-50 p-1 focus:border-action focus:outline-none focus:ring ${
          pwWarning &&
          "border-solid [&:not(:placeholder-shown):not(:focus)]:border-2 [&:not(:placeholder-shown):not(:focus)]:border-warning"
        } `}
      ></input>
      {pwWarning && (
        <span
          className={`mt-2 hidden text-sm text-warning peer-[&:not(:placeholder-shown):not(:focus)]:block`}
        >
          Your password should be at least six characters long and needs at
          least one uppercase letter, on lowercase letter and a special
          character.
        </span>
      )}
    </label>
  );
}

export function PasswordAndRepeatPasswordFields() {
  //check password matching
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // warning
  const [pwRepeatWarning, setPwRepeatWarning] = useState(false);

  return (
    <>
      <NewPasswordField valueState={password} valueSetter={setPassword} />

      <label htmlFor="repeatpassword" className="mt-4 flex flex-col">
        <span className="mb-1 text-sm">Repeat your password</span>
        <input
          required
          type="password"
          placeholder="repeat password"
          name="repeatpassword"
          id="repeatpassword"
          autoComplete="new-password"
          onChange={(e) => {
            setPasswordConfirm(e.target.value);
            if (password !== e.target.value) {
              return setPwRepeatWarning(true);
            }
            return setPwRepeatWarning(false);
          }}
          minLength={6}
          maxLength={20}
          className={`peer bg-gray-50 p-1 focus:border-action focus:outline-none focus:ring ${
            pwRepeatWarning &&
            "border-solid border-warning  [&:not(:placeholder-shown):not(:focus)]:border-2 "
          }`}
        ></input>

        {pwRepeatWarning && password !== "" && passwordConfirm !== "" && (
          <span className="mt-2 text-sm text-warning peer-[&:not(:placeholder-shown):not(:focus):invalid]:block ">
            Passwords do not match
          </span>
        )}
      </label>
    </>
  );
}

export function Checkbox({ children }: { children: ReactNode }): JSX.Element {
  return (
    <label
      htmlFor="checkbox"
      className="gp-2 mt-4 flex flex-wrap items-baseline space-x-1"
    >
      <input
        required
        type="checkbox"
        name="checkbox"
        id="checkbox"
        value=""
        className="peer bg-gray-50"
      />

      {children}
      <span className="visible mt-2 w-full text-sm text-warning peer-checked:invisible  ">
        You need to agree before you can continue.
      </span>
    </label>
  );
}

export function UserNameField({
  type = "username",
}: {
  type?: "username" | "name";
}) {
  return (
    <label htmlFor={type} className="mt-4 flex flex-col">
      <span className="mb-1 text-sm">
        {type === "username" ? "Choose a username" : "Your name"}
      </span>
      <input
        required
        type="string"
        placeholder={type}
        name={type}
        id={type}
        autoComplete={type}
        minLength={3}
        maxLength={type === "username" ? 20 : 30}
        className="peer bg-gray-50 p-1 invalid:border-solid focus:border-action focus:outline-none focus:ring invalid:[&:not(:placeholder-shown):not(:focus)]:border-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-warning"
      ></input>
      <span className="mt-2 hidden text-sm text-warning peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
        Can be between 3 and {type === "username" ? "20" : "30"} characters, no
        special characters.
      </span>
    </label>
  );
}
