interface FilterSelectProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: readonly T[]
  getLabel: (value: T) => string
}

export const FilterSelect = <T extends string>({
  value,
  onChange,
  options,
  getLabel,
}: FilterSelectProps<T>): JSX.Element => {
  const label = getLabel(value)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          fontSize: '14px',
          visibility: 'hidden',
          whiteSpace: 'pre',
          paddingRight: '16px',
        }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          fontSize: '14px',
          color: '#6B7280',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
          appearance: 'none',
          WebkitAppearance: 'none',
          paddingRight: '16px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {getLabel(opt)}
          </option>
        ))}
      </select>
    </div>
  )
}
