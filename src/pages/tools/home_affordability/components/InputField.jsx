import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { formatCurrency, formatPercentage, formatCompactNumber, formatInputValue } from '../utils/formatCurrency';

const InputField = ({ 
  label, 
  value, 
  onChange, 
  type, 
  min, 
  max, 
  step, 
  options, 
  tooltip, 
  description,
  maxLength,
  displayOnly = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSliderChange = (newValue) => {
    if (!displayOnly) {
      onChange(Number(newValue));
    }
  };

  const handleInputChange = (newValue) => {
    if (!displayOnly) {
      onChange(newValue);
    }
  };

  const formatValue = (val, inputType = type) => {
    switch (inputType) {
      case 'currency':
        return formatCompactNumber(val);
      case 'percentage':
        return formatPercentage(val, 1);
      case 'text':
        return val;
      default:
        return val.toString();
    }
  };

  const getInputProps = () => {
    const commonProps = {
      className: `w-full h-12 px-4 bg-bg-page border border-border-subtle rounded-lg text-text-primary input-focus transition-all duration-200`,
      value: type === 'text' ? value : formatInputValue(value, type),
      onChange: (e) => {
        if (displayOnly) return; // No onChange for displayOnly fields
        if (type === 'text') {
          onChange(e.target.value);
        } else {
          const numericValue = parseFloat(e.target.value.replace(/[$,%\s]/g, '')) || 0;
          onChange(numericValue);
        }
      },
      onFocus: (e) => {
        if (displayOnly) {
          e.target.blur(); // Prevent focus for displayOnly fields
        } else if (type !== 'text') {
          e.target.select();
        }
      }
    };

    if (displayOnly) {
      commonProps.readOnly = true;
      commonProps.disabled = true;
      commonProps.className += ' opacity-75 cursor-default';
    }

    if (type === 'select' && !displayOnly) {
      return {
        ...commonProps,
        type: 'text',
        readOnly: true,
        style: { appearance: 'none' }
      };
    }

    if (type !== 'text' && !displayOnly) {
      commonProps.type = 'text';
      commonProps.inputMode = 'decimal';
    }

    if (maxLength && !displayOnly) {
      commonProps.maxLength = maxLength;
    }

    return commonProps;
  };

  return (
    <div className="space-y-3">
      {/* Label and tooltip */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2">
          <span className="text-sm font-medium text-text-primary">{label}</span>
          {tooltip && (
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="p-1 text-text-secondary hover:text-primary-500 transition-colors duration-200"
                aria-describedby={`tooltip-${label.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  id={`tooltip-${label.replace(/\s+/g, '-').toLowerCase()}`}
                  role="tooltip"
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-text-primary text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10"
                >
                  {tooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-text-primary"></div>
                </motion.div>
              )}
            </div>
          )}
        </label>
        {description && (
          <span className="text-xs text-text-secondary">{description}</span>
        )}
      </div>

      {/* Input and slider */}
      <div className="space-y-3">
        {/* Numeric or text input */}
        <div className="relative">
          <input {...getInputProps()} />
          {type === 'select' && !displayOnly && (
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
          )}
        </div>

        {/* Slider (for numeric types) */}
        {type !== 'text' && type !== 'select' && !displayOnly && (
          <div className="relative">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => handleSliderChange(e.target.value)}
              className="w-full h-2 bg-bg-page rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #0057B7 0%, #0057B7 ${((value - min) / (max - min)) * 100}%, #E2E8F0 ${((value - min) / (max - min)) * 100}%, #E2E8F0 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>{formatValue(min)}</span>
              <span className="font-medium text-primary-500">{formatValue(value)}</span>
              <span>{formatValue(max)}</span>
            </div>
          </div>
        )}

        {/* Select dropdown */}
        {type === 'select' && !displayOnly && (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-12 px-4 bg-bg-page border border-border-subtle rounded-lg text-text-primary input-focus transition-all duration-200 appearance-none cursor-pointer"
            >
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
};

// Custom slider styles
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #0057B7;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 87, 183, 0.3);
    transition: all 0.15s ease-in-out;
  }
  
  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 87, 183, 0.4);
  }
  
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #0057B7;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 87, 183, 0.3);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sliderStyles;
  document.head.appendChild(styleSheet);
}

export default InputField;
