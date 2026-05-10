import { useState } from "react";

export function HelpButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="fixed bottom-6 left-6 z-50 bg-[#ef4f90] text-white rounded-full p-3 shadow-lg hover:bg-[#b95e86] focus:outline-none"
        aria-label="Help"
        onClick={() => setOpen((v) => !v)}
      >
        ?
      </button>
      {open && (
        <div className="fixed bottom-20 left-6 z-50 w-80 rounded-2xl bg-white border border-pink-200 shadow-xl p-4">
          <h2 className="font-bold text-lg mb-2 text-pink-500">Need Help?</h2>
          <ul className="text-sm text-[#62314a] list-disc pl-5 space-y-1">
            <li>Check the <a href="/onboarding" className="underline text-pink-500">onboarding guide</a>.</li>
            <li>Hover over form fields for tips (coming soon).</li>
            <li>Visit <a href="mailto:support@autobot.com" className="underline text-pink-500">support@autobot.com</a> for help.</li>
            <li>See the <a href="/faq" className="underline text-pink-500">FAQ</a> (coming soon).</li>
          </ul>
          <button className="mt-4 text-xs text-pink-400 underline" onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
}
