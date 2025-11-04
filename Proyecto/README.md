# UBudget - Personal Financial Management Application

UBudget is a modern web application built with React and TypeScript that provides comprehensive tools for personal financial management, investment analysis, and financial education.

## ✨ Key Features

- **📊 Interactive Dashboard**: Overview of your finances with charts and key metrics
- **💰 Budget Calculator**: Tool to plan and manage income and expenses
- **📈 Investment Analysis**: Exploration of financial instruments and investment strategies  
- **📊 Stock Prices**: Real-time stock tracking with news analysis
- **📰 Financial News**: Financial market news feed with impact analysis
- **🤖 Educational Assistant**: Smart chatbot to explain financial terms and concepts
- **🎨 Modern Interface**: Responsive design with cutting-edge UI components

## 🛠️ Technologies Used

### Frontend
- **React 18** - User interface framework
- **TypeScript** - Static typing for JavaScript
- **Vite** - Build and development tool
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible and modern UI components

### APIs and Services
- **Finnhub API** - Financial market data and news
- **Google Gemini AI** - Intelligent analysis and educational assistant
- **Recharts** - Charts and data visualization

### State Management
- **React Context** - Global application state management
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Utilities
- **Axios** - HTTP client for API requests
- **Date-fns** - Date manipulation
- **Lucide React** - Modern iconography

## 🚀 Installation and Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone [REPOSITORY_URL]
cd ubudget
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the project root:
```env
VITE_FINNHUB_API_KEY=your_finnhub_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. **Start the development server**
```bash
npm run dev
```

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run linter to detect code issues
- `npm run preview` - Preview the built application

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── stock/           # Stock-specific components
│   └── ...              # Main components
├── contexts/            # Context providers
├── hooks/               # Custom hooks
├── lib/                 # Utilities and configuration
├── types/               # TypeScript type definitions
└── utils/               # Utility functions

public/
├── data/                # Static data (JSON)
└── ...
```

## 🔧 API Configuration

### Finnhub API
1. Register at [Finnhub.io](https://finnhub.io/)
2. Get your free API key
3. Add `VITE_FINNHUB_API_KEY` to the `.env` file

### Google Gemini AI
1. Access [Google AI Studio](https://aistudio.google.com/)
2. Create a project and get your API key
3. Add `VITE_GEMINI_API_KEY` to the `.env` file

## 🎯 Features by Module

### Dashboard
- Personalized financial summary
- Budget distribution charts
- Quick actions for different functions

### Budget Calculator
- Automatic categorization of income and expenses
- Financial balance visualization
- Overspending alerts

### Investment Analysis
- Financial instruments explorer
- Return on investment calculator
- Investment options comparison

### Stock Prices
- Real-time stock tracking
- AI-powered news analysis
- Informative modals with company details

### Financial News
- Categorized market news feed
- Automatic market impact analysis
- Category and relevance filters

### Educational Assistant
- AI-powered smart chatbot
- Financial terms explanations
- Automatic activation when selecting text

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## 🐛 Bug Reports

If you find a bug, please open an issue in the repository with:
- Problem description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

**Thank you for using UBudget! 💰✨**
