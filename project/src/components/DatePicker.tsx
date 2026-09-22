import { motion } from 'framer-motion';
import { Calendar, Check, X } from 'lucide-react';
import { getUpcomingFridays, formatDate, toDateInputValue, isPastDate } from '@/utils/helpers';

interface DatePickerProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  allowCustom?: boolean;
}

export default function DatePicker({ selectedDate, onSelect, allowCustom = false }: DatePickerProps) {
  const fridays = getUpcomingFridays(6);
  const today = toDateInputValue(new Date());

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-forest-600" />
        <h4 className="font-serif text-lg font-semibold text-forest-900">Choose Your Training Date</h4>
      </div>

      <p className="mb-4 text-sm text-charcoal-600">
        Training sessions are held every Friday evening. Select an upcoming Friday below.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fridays.map((friday) => {
          const dateStr = toDateInputValue(friday);
          const isSelected = selectedDate === dateStr;
          return (
            <button
              key={dateStr}
              onClick={() => onSelect(dateStr)}
              className={`relative rounded-xl border-2 p-3 text-center transition-all ${
                isSelected
                  ? 'border-forest-600 bg-forest-50'
                  : 'border-beige-200 bg-white hover:border-forest-300'
              }`}
            >
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-forest-600 text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <div className={`text-xs font-medium ${isSelected ? 'text-forest-700' : 'text-charcoal-500'}`}>
                {friday.toLocaleDateString('en-IN', { weekday: 'short' })}
              </div>
              <div className={`mt-1 text-lg font-semibold ${isSelected ? 'text-forest-800' : 'text-charcoal-800'}`}>
                {friday.getDate()}
              </div>
              <div className={`text-xs ${isSelected ? 'text-forest-600' : 'text-charcoal-500'}`}>
                {friday.toLocaleDateString('en-IN', { month: 'short' })}
              </div>
            </button>
          );
        })}
      </div>

      {allowCustom && (
        <div className="mt-5 border-t border-beige-100 pt-5">
          <label className="mb-2 block text-sm font-medium text-charcoal-700">
            Or pick a custom date
          </label>
          <input
            type="date"
            min={today}
            value={selectedDate && isPastDate(selectedDate) ? '' : selectedDate}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full rounded-xl border border-beige-200 bg-white px-4 py-3 text-sm text-charcoal-800 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-200"
          />
          <p className="mt-2 text-xs text-charcoal-500">Past dates cannot be selected.</p>
        </div>
      )}

      {selectedDate && !isPastDate(selectedDate) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 rounded-xl bg-forest-50 px-4 py-3"
        >
          <Calendar className="h-4 w-4 text-forest-600" />
          <span className="text-sm font-medium text-forest-800">Selected: {formatDate(selectedDate)}</span>
        </motion.div>
      )}

      {selectedDate && isPastDate(selectedDate) && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3">
          <X className="h-4 w-4 text-red-600" />
          <span className="text-sm font-medium text-red-700">Please select a future date.</span>
        </div>
      )}
    </div>
  );
}
