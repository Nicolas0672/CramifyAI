import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { StudyProvider } from "./StudyContext";
import Provider from "./provider";
import SideBar from "./dashboard/_components/SideBar";
import { SidebarProvider } from "./SidebarContext";
import FloatingStudyElements from "./FloatingStudyElemens";
import { headers } from "next/headers";
import { LearningModeProvider } from "./LearningModeContext";
import { CourseProvider } from "./CourseIdProvider";

export const metadata = {
  title: "CramSmart",
  description: "Generated by create next app",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  // Get the current URL path from the header set by middleware
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "/";
  
  // List of authentication routes where sidebar should be hidden
  const authRoutes = ["/sign-in", "/sign-up", "/home", "/privacy-policy", "/terms-service", "/about-us"];
  
  // Check if the current path is an auth page
  const isAuthPage = authRoutes.some(route => pathname.startsWith(route));
  
  // Force sidebar visible for dashboard pages
  const isDashboardPage = pathname.includes('/dashboard');
  const showSidebar = isDashboardPage || !isAuthPage;
  
  return (
    <ClerkProvider>
      <StudyProvider>
        <CourseProvider>
          <html lang="en">
            <body className={outfit.className}>
              <LearningModeProvider>
                <FloatingStudyElements />
                <Toaster position="bottom-right" reverseOrder={false} />
                <Provider>
                  <SidebarProvider>
                    {/* Flex container for sidebar and main content */}
                    <div className="relative flex">
                      {/* Sidebar with proper handling - adding the dashboard condition */}
                      {showSidebar && (
                        <div className="w-auto md:w-30 fixed h-auto md:h-screen top-0 left-0 z-40">
                          {/* Only the actual sidebar content */}
                          <SideBar />
                        </div>
                      )}
                      
                      {/* Main content with appropriate margins to avoid overlap */}
                      <div className={`mt-0 flex-1 ${showSidebar ? "md:ml-30" : ""} relative z-10`}>
                        {children}
                      </div>
                    </div>
                  </SidebarProvider>
                </Provider>
              </LearningModeProvider>
            </body>
          </html>
        </CourseProvider>
      </StudyProvider>
    </ClerkProvider>
  );
}