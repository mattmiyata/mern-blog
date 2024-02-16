import { Outlet } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";

export default function Layout() {
  return (
    <main>
      <Header />

      <Outlet />
      <Footer />
    </main>
  );
}

function Loading() {
  return <h2>Loading</h2>;
}
