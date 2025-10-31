# Home Affordability Calculator Integration Todo List

## Implementation Steps

### Phase 1: Directory Structure Setup
- [ ] Create `src/pages/tools/home_affordability/` directory structure

### Phase 2: Component Migration
- [ ] Copy standalone app components (maintaining original styling)
- [ ] Copy utility functions (calculations.js, formatCurrency.js)
- [ ] Copy main App.jsx component adapted for integration

### Phase 3: Routing & Navigation
- [ ] Add route in App.jsx for `/tools/home_affordability`
- [ ] Enable "Mortgage Affordability Calculator" tile in tools index
- [ ] Update navigation functionality

### Phase 4: Testing & Verification
- [ ] Test navigation from tools index
- [ ] Verify calculator functionality
- [ ] Check dark/light mode consistency
- [ ] Ensure responsive design works

## Key Requirements
- ✅ Maintain all original Tailwind CSS styling
- ✅ Keep standalone dark/light mode system
- ✅ Preserve all animations and interactions
- ✅ Maintain calculation accuracy
- ✅ Ensure seamless navigation integration

## Target Outcome
Users can click the "Mortgage Affordability Calculator" tile in the tools index and be taken to a fully functional home affordability calculator that works exactly like the standalone version.
