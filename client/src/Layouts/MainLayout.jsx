import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({
  children,
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  return (
    <>
      <Navbar
        cartCount={cartCount}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        user={user}
        setUser={setUser}
      />

      <main
        style={{
          minHeight: "80vh",
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {children}
      </main>

      <Footer />
    </>
  );
}

export default MainLayout;