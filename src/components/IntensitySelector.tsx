import type { RoastIntensity } from '../types';

interface IntensitySelectorProps {
  value: RoastIntensity;
  onChange: (value: RoastIntensity) => void;
  disabled?: boolean;
}

const OPTIONS: { value: RoastIntensity; label: string; emoji: string }[] = [
  { value: 1, label: 'Mild', emoji: '🌶️' },
  { value: 2, label: 'Medium', emoji: '🔥' },
  { value: 3, label: 'Nuclear', emoji: '☢️' },
];

export function IntensitySelector({
  value,
  onChange,
  disabled,
}: IntensitySelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
        Roast Intensity
      </label>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={`
              py-3 px-2 sm:px-4 rounded-lg font-mono text-sm transition-all border
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                value === opt.value
                  ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500 text-orange-400'
                  : 'bg-[#0a0a0a] border-gray-800 text-gray-400 hover:border-gray-600'
              }
            `}
          >
            <span className="block text-lg mb-0.5">{opt.emoji}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
