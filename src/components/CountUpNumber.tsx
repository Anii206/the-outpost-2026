import React, { useState, useEffect, useRef } from 'react';
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
  const [hasAnimated, setHasAnimated] = useState(false);
  const initialValueRef = useRef(end);

  useEffect(() => {
    // Only animate the count-up on initial page load
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className={`inline-flex items-baseline font-serif lining-nums ${className}`.trim()}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      {!hasAnimated ? (
        <NumberFlow
          value={initialValueRef.current}
          locales="en-IN"
        />
      ) : (
        <span>{end.toLocaleString('en-IN')}</span>
      )}
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
};
