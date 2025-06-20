import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
				'3xl': '1600px',
				'4xl': '1920px'
			}
		},
		screens: {
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
			'3xl': '1600px',
			'4xl': '1920px',
		},
		extend: {
			colors: {
				// Cores corporativas PMO - versão clara
				'pmo-primary': '#5A7FB8',
				'pmo-secondary': '#7DD3C0',
				'pmo-gray': '#8B92A6',
				'pmo-success': '#86C7B0',
				'pmo-warning': '#F5C842',
				'pmo-danger': '#F87171',
				'pmo-background': '#FEFEFE',
				
				// Cores originais do shadcn - versão clara
				border: 'hsl(0 0% 90%)',
				input: 'hsl(0 0% 96%)',
				ring: 'hsl(217 50% 70%)',
				background: 'hsl(0 0% 100%)',
				foreground: 'hsl(0 0% 20%)',
				primary: {
					DEFAULT: '#5A7FB8',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#F8FAFC',
					foreground: '#5A7FB8'
				},
				destructive: {
					DEFAULT: '#F87171',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F8FAFC',
					foreground: '#8B92A6'
				},
				accent: {
					DEFAULT: '#E0F2FE',
					foreground: '#5A7FB8'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#374151'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#374151'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
