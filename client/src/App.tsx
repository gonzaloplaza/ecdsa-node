import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Home from "@/pages/Home";
import { ThemeProvider } from "@/components/ThemeProvider";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
