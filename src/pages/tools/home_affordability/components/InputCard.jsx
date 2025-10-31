import React from 'react';
import { DollarSign, CreditCard, Percent, Calendar, MapPin, Shield } from 'lucide-react';
import InputField from './InputField';

const InputCard = ({ inputs, setInputs }) => {
  const updateInput = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const inputSections = [
    {
      title: 'Income & Debt',
      icon: DollarSign,
      fields: [
        {
          key: 'annualIncome',
          label: 'Annual Income',
          type: 'currency',
          min: 0,
          max: 1000000,
          step: 1000,
          value: inputs.annualIncome,
          tooltip: 'Your gross annual income before taxes. Include all sources of income.',
          description: 'Total household gross income'
        },
        {
          key: 'monthlyDebts',
          label: 'Monthly Debts',
          type: 'currency',
          min: 0,
          max: 10000,
          step: 50,
          value: inputs.monthlyDebts,
          tooltip: 'Total monthly payments for credit cards, car loans, student loans, and other debts.',
          description: 'Credit cards, loans, etc.'
        }
      ]
    },
    {
      title: 'Loan Details',
      icon: CreditCard,
      fields: [
        {
          key: 'downPayment',
          label: 'Down Payment',
          type: 'currency',
          min: 0,
          max: 500000,
          step: 1000,
          value: inputs.downPayment,
          tooltip: 'The amount you can pay upfront for the home. Typically 3-20% of the purchase price.',
          description: 'Cash you can put down'
        },
        {
          key: 'interestRate',
          label: 'Interest Rate',
          type: 'percentage',
          min: 2.0,
          max: 15.0,
          step: 0.1,
          value: inputs.interestRate,
          tooltip: 'Current mortgage interest rate. Check with lenders for current rates.',
          description: 'Annual percentage rate'
        },
        {
          key: 'loanTerm',
          label: 'Loan Term',
          type: 'select',
          options: [
            { value: 15, label: '15 Years' },
            { value: 30, label: '30 Years' }
          ],
          value: inputs.loanTerm,
          tooltip: 'Length of your mortgage loan. 30-year loans have lower monthly payments but more total interest.',
          description: 'Duration of loan'
        }
      ]
    },
    {
      title: 'Additional Costs',
      icon: Shield,
      fields: [
        {
          key: 'propertyTaxRate',
          label: 'Property Tax Rate',
          type: 'percentage',
          min: 0.5,
          max: 3.0,
          step: 0.1,
          value: inputs.propertyTaxRate,
          tooltip: 'Annual property tax as a percentage of home value. Varies by location.',
          description: 'Annual tax rate'
        },
        {
          key: 'insuranceAmount',
          label: 'Homeowners Insurance',
          type: 'currency',
          min: 500,
          max: 5000,
          step: 50,
          value: inputs.insuranceAmount,
          tooltip: 'Annual homeowners insurance premium. Protects against damage and liability.',
          description: 'Annual premium cost'
        },
        {
          key: 'hoaFees',
          label: 'HOA Fees',
          type: 'currency',
          min: 0,
          max: 1000,
          step: 25,
          value: inputs.hoaFees,
          tooltip: 'Monthly homeowners association fees for community amenities and maintenance.',
          description: 'Monthly HOA dues'
        },
        {
          key: 'zipCode',
          label: 'ZIP Code',
          type: 'text',
          maxLength: 5,
          value: inputs.zipCode,
          tooltip: 'Your location helps estimate property taxes and insurance costs.',
          description: 'For tax estimation'
        }
      ]
    },
    {
      title: 'Lending Ratios',
      icon: Percent,
      fields: [
        {
          key: 'mortgageToIncomeRatio',
          label: 'Mortgage-to-Income Ratio',
          type: 'percentage',
          min: 20,
          max: 40,
          step: 1,
          value: inputs.mortgageToIncomeRatio,
          tooltip: 'Recommended maximum percentage of income for mortgage payment. Most lenders use 28%.',
          description: 'Recommended: 28%'
        },
        {
          key: 'debtToIncomeRatio',
          label: 'Debt-to-Income Ratio',
          type: 'percentage',
          min: 30,
          max: 50,
          step: 1,
          value: inputs.debtToIncomeRatio,
          tooltip: 'Total monthly debt payments as percentage of income. Conventional loans max at 43%.',
          description: 'Recommended: 36%'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {inputSections.map((section, index) => {
        const IconComponent = section.icon;
        return (
          <div key={section.title} className="bg-surface rounded-xl p-6 shadow-card card-hover">
            <div className="flex items-center space-x-3 mb-6">
              <IconComponent className="w-6 h-6 text-primary-500" />
              <h3 className="text-xl font-heading font-semibold text-text-primary">
                {section.title}
              </h3>
            </div>
            
            <div className="space-y-6">
              {section.fields.map((field) => (
                <InputField
                  key={field.key}
                  label={field.label}
                  value={field.value}
                  onChange={(value) => updateInput(field.key, value)}
                  type={field.type}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  options={field.options}
                  tooltip={field.tooltip}
                  description={field.description}
                  maxLength={field.maxLength}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InputCard;
