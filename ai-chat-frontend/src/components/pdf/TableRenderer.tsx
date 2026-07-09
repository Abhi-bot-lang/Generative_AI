export default function TableRenderer({ children }: any) {
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-200 shadow-sm page-break-avoid w-full">
      <table className="w-full text-sm text-left m-0">
        {children}
      </table>
    </div>
  );
}
