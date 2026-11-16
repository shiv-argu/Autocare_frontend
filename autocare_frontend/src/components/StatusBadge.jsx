const styles = {
  pending: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 ring-blue-200',
  completed: 'bg-green-100 text-green-800 ring-green-200',
  paid: 'bg-green-100 text-green-800 ring-green-200',
  unpaid: 'bg-amber-100 text-amber-800 ring-amber-200',
};

export default function StatusBadge({ status }) {
  const s = status || '';
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        styles[s] || 'bg-gray-100 text-gray-700 ring-gray-200'
      }`}
    >
      {s.replace('_', ' ')}
    </span>
  );
}