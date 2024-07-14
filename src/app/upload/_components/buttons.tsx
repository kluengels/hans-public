
export default function UploadButton({pending, gettingDuration}: {pending:boolean, gettingDuration: boolean}) {
  
  return (
    <button
      className={`border-[1px] p-1 rounded-md text-text border-action my-4 ${
        pending
          ? "bg-slate-400 border-slate-400"
          : "bg-actionlight  hover:bg-action hover:text-white"
      }`}
      disabled={pending || gettingDuration ? true : false}
    >
      {pending ? "Uploading" : gettingDuration ? "Calculating size" : "Upload"}
    </button>
  );
}

