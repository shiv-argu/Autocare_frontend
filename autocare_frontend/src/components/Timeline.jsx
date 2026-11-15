const dot = {
  created: 'bg-blue-500',
  status_changed: 'bg-purple-500',
  service_added: 'bg-green-500',
  service_removed: 'bg-red-400',
  spare_added: 'bg-green-500',
  spare_removed: 'bg-red-400',
  bill_generated: 'bg-amber-500',
};

export default function Timeline({ events }) {
  if (!events || events.length === 0) {
    return <p className="text-sm text-gray-500">No history recorded yet.</p>;
  }

  return (
    <ol className="relative ml-2 border-l border-gray-200">
      {events.map((e) => (
        <li key={e.history_id} className="mb-5 ml-4">
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
  );
}