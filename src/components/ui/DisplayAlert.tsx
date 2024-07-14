import { useEffect, Dispatch, SetStateAction } from "react";

type DisplayAlertProps = {
  alert: string;
  setAlert: Dispatch<SetStateAction<string>>;
  success?: boolean;
};

const DisplayAlert = ({ alert, setAlert, success }: DisplayAlertProps) => {
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(""), 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [alert, setAlert]);

  if (alert) {
    return (
      <div
        className={` ${success ? "bg-green-800" : "bg-orange-500"} p-2 text-white`}
      >
        {alert}
      </div>
    );
  }
};

export default DisplayAlert;
