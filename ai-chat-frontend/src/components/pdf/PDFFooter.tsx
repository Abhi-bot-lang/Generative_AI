import React from 'react';

export default function PDFFooter() {
  return (
    <div className="mt-12 pt-6 pb-8 mx-8 border-t border-slate-200 text-center text-sm text-slate-400 break-inside-avoid print:block font-medium">
      Generated securely by AI Assistant • {new Date().toLocaleDateString()}
    </div>
  );
}
