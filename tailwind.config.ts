
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
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Material 3 Extended Purple/Blue Palette
				surface: {
					DEFAULT: 'hsl(var(--background))',
					container: 'hsl(var(--muted))',
					'container-high': 'hsl(var(--card))',
					variant: 'hsl(var(--accent))',
				},
				outline: {
					DEFAULT: 'hsl(var(--border))',
					variant: 'hsl(202 196 208)',
				},
				// Material 3 Color Roles
				'primary-container': 'hsl(234 248 255)',
				'on-primary-container': 'hsl(33 0 96)',
				'secondary-container': 'hsl(232 222 248)',
				'on-secondary-container': 'hsl(29 25 43)',
				'tertiary-container': 'hsl(246 229 255)',
				'on-tertiary-container': 'hsl(49 17 62)',
				// Legacy colors for backward compatibility
				navy: {
					50: '#f0f2f8',
					100: '#d9e0ee',
					200: '#b7c4df',
					300: '#8a9dcb',
					400: '#677fb3',
					500: '#4f649c',
					600: '#414f7e',
					700: '#354067',
					800: '#2e3654',
					900: '#262c42',
					950: '#141623',
				},
				gold: {
					50: '#fdf9ed',
					100: '#f8eac8',
					200: '#f2d68e',
					300: '#ecbe53',
					400: '#e7ad2d',
					500: '#d19418',
					600: '#ad7114',
					700: '#8a5316',
					800: '#724119',
					900: '#603618',
					950: '#351b0c',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '12px',
				'2xl': '16px',
				'3xl': '24px',
			},
			fontFamily: {
				sans: ['Roboto', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				// Material 3 Typography Scale
				'display-large': ['57px', { lineHeight: '64px', fontWeight: '400' }],
				'display-medium': ['45px', { lineHeight: '52px', fontWeight: '400' }],
				'display-small': ['36px', { lineHeight: '44px', fontWeight: '400' }],
				'headline-large': ['32px', { lineHeight: '40px', fontWeight: '400' }],
				'headline-medium': ['28px', { lineHeight: '36px', fontWeight: '400' }],
				'headline-small': ['24px', { lineHeight: '32px', fontWeight: '400' }],
				'title-large': ['22px', { lineHeight: '28px', fontWeight: '500' }],
				'title-medium': ['16px', { lineHeight: '24px', fontWeight: '500' }],
				'title-small': ['14px', { lineHeight: '20px', fontWeight: '500' }],
				'body-large': ['16px', { lineHeight: '24px', fontWeight: '400' }],
				'body-medium': ['14px', { lineHeight: '20px', fontWeight: '400' }],
				'body-small': ['12px', { lineHeight: '16px', fontWeight: '400' }],
				'label-large': ['14px', { lineHeight: '20px', fontWeight: '500' }],
				'label-medium': ['12px', { lineHeight: '16px', fontWeight: '500' }],
				'label-small': ['11px', { lineHeight: '16px', fontWeight: '500' }],
			},
			boxShadow: {
				// Material 3 Elevation System
				'elevation-1': '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
				'elevation-2': '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
				'elevation-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3)',
				'elevation-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.3)',
				'elevation-5': '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.3)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.95)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'material-ripple': {
					'0%': { transform: 'scale(0)', opacity: '0.5' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'scale-in': 'scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
				'material-ripple': 'material-ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
