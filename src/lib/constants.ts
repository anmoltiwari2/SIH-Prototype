export const CATEGORIES = [
  'All Categories',
  'Study/Tutoring',
  'Cleaning',
  'Mechanical',
  'Cook',
  'Skilled Home Trades'
];

export const SUBCATEGORIES: Record<string, string[]> = {
  'Skilled Home Trades': ['Plumbing', 'Electrical', 'Carpentry', 'Painting'],
  'Study/Tutoring': ['Mathematics', 'Science', 'Language Learning', 'Music'],
  'Cleaning': ['Deep Cleaning', 'Standard Cleaning', 'Vehicle Washing'],
  'Mechanical': ['Appliance Repair', 'Vehicle Repair'],
  'Cook': ['North Indian', 'South Indian', 'Baking', 'Meal Prep'],
}
