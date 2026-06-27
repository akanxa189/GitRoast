interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function UsernameInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: UsernameInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) onSubmit();
  };

  return (
    <div className="w-full">
      <label
        htmlFor="username"
        className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider"
      >
        GitHub Username
      </label>
      <div className="flex items-center bg-[#0a0a0a] border border-gray-800 rounded-lg focus-within:border-orange-500/50 transition-colors">
        <span className="pl-4 text-orange-500 font-mono text-lg">@</span>
        <input
          id="username"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/^@/, ''))}
          onKeyDown={handleKeyDown}
          placeholder="octocat"
          disabled={disabled}
          className="flex-1 bg-transparent py-3 px-2 font-mono text-white placeholder:text-gray-600 outline-none disabled:opacity-50"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
