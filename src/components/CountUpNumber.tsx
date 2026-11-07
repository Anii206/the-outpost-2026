import React from 'react';
import NumberFlow from '@number-flow/react';

interface CountUpNumberProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  end,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  return (
    <span className={`inline-flex items-baseline font-serif lining-nums ${className}`.trim()}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <NumberFlow
        value={end}
        locales="en-IN"
      />
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
};
