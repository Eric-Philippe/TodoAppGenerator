import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { PremiumProvider } from "./contexts/PremiumContext";
import Header from "./components/Header";
import "./App.css";
import UpgradePage from "./pages/UpgradePage";
import PaymentPage from "./pages/PaymentPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Créer un thème MUI personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
    },
    secondary: {
      main: "#764ba2",
    },
    background: {
      default: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PremiumProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/generator" element={<HomePage />} />
              <Route path="/upgrade" element={<UpgradePage />} />
              <Route path="/payment/:planId" element={<PaymentPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </PremiumProvider>
    </ThemeProvider>
  );
}

export default App;
