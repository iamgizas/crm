// Paleta de cores do CRM — roxo como cor principal
const roxo = {
  50:  '#f5f3ff',
  100: '#ede9fe',
  400: '#a78bfa',
  500: '#8b5cf6',  // cor principal
  600: '#7c3aed',
  700: '#6d28d9',
  900: '#4c1d95',
}

export const Colors = {
  light: {
    primary:    roxo[600],
    background: '#ffffff',
    card:       '#f5f3ff',
    text:       '#1a1a2e',
    textMuted:  '#6b7280',
    border:     '#e5e7eb',
    tabBar:     '#ffffff',
    tabIcon:    '#6b7280',
    tabIconActive: roxo[600],
  },
  dark: {
    primary:    roxo[500],
    background: '#0f0f1a',
    card:       '#1a1a2e',
    text:       '#f9fafb',
    textMuted:  '#9ca3af',
    border:     '#2d2d44',
    tabBar:     '#12121f',
    tabIcon:    '#6b7280',
    tabIconActive: roxo[400],
  },
}
