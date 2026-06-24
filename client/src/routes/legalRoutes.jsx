import LegalLayout from "../pages/public/legal/LegalLayout";
import AboutUs from "../pages/public/legal/AboutUs";
import Terms from "../pages/public/legal/Terms";
import Privacy from "../pages/public/legal/Privacy";
import Support from "../pages/public/legal/Support";

export const legalRoutes = {
  path: "/legal",
  element: <LegalLayout />,
  children: [
    {
      path: "aboutus",
      element: <AboutUs />,
    },
    {
      path: "terms",
      element: <Terms />,
    },
    {
      path: "privacy",
      element: <Privacy />,
    },
    {
      path: "support",
      element: <Support />,
    },
  ],
};
