export default function Loader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-forest-200 border-t-forest-600" />
      <p className="mt-4 text-sm text-charcoal-600">{label}</p>
    </div>
  );
}
