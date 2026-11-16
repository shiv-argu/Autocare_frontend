import { useState } from 'react';
import StatusBadge from './StatusBadge';

const dot = {
  created: 'bg-blue-500',
  status_changed: 'bg-purple-500',
  service_added: 'bg-green-500',
  service_removed: 'bg-red-400',
  spare_added: 'bg-green-500',
  spare_removed: 'bg-red-400',
  bill_generated: 'bg-amber-500',
};

export default function Timeline({ events, status, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const list = events || [];
  const latest = list[list.length - 1];

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left hover:bg-gray-50"
      >
        <div className="flex min-w-0 items-center gap-3">
          {status && <StatusBadge status={status} />}
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-800">
              {latest ? latest.description : 'No history recorded yet'}
            </p>
            {latest && (
              <p className="text-xs text-gray-500">
                {new Date(latest.created_at).toLocaleString()} · {list.length} event{list.length === 1 ? '' : 's'}
              </p>
            )}
          </div>
        </div>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          />
        </svg>
      </button>

      {open && list.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-4">
          <ol className="relative ml-2 border-l border-gray-200">
            {list.map((e) => (
              <li key={e.history_id} className="mb-5 ml-4 last:mb-0">
                <span className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full ${dot[e.event_type] || 'bg-gray-400'}`} />
                <p className="text-xs text-gray-500">
                  {new Date(e.created_at).toLocaleString()}
                  {e.changed_by_role && (
                    <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5">{e.changed_by_role}</span>
                  )}
                </p>
                <p className="text-sm text-gray-800">{e.description}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}