import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Header() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  // ----- ДЕСКТОПНОЕ МЕНЮ -----
  const navDesktop = (
    <>
      <Link to="/booking" className="hover:text-restaurant-dark transition">
        Bookings
      </Link>

      {user ? (
        <>
          <span className="text-xs text-gray-500">{user.email}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-red-500 border border-red-300 px-3 py-1 rounded-full hover:bg-red-50 transition"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="hover:text-restaurant-dark transition"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="border border-restaurant-gold px-3 py-1 rounded-full hover:bg-restaurant-gold/10 transition"
          >
            Sign up
          </Link>
        </>
      )}
    </>
  );

  // ----- МОБИЛЬНОЕ МЕНЮ -----
  const navMobile = (
    <>
      <Link
        to="/booking"
        onClick={closeMenu}
        className="cursor-pointer px-1 py-1 hover:text-restaurant-gold transition"
      >
        Bookings
      </Link>

      {user ? (
        <>
          <span className="text-xs text-gray-500 px-1 py-1">{user.email}</span>

          <button
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
            className="text-xs text-red-500 cursor-pointer px-1 py-1 hover:text-red-400 transition"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={closeMenu}
            className="cursor-pointer px-1 py-1 hover:text-restaurant-gold transition"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            onClick={closeMenu}
            className="cursor-pointer px-1 py-1 hover:text-restaurant-gold transition"
          >
            Sign up
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="bg-white/90 backdrop-blur shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        {/* Верхняя строка: логотип + бургер / десктопное меню */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={() => {
              closeMenu();
              scrollToTop();
            }}
            className="text-2xl sm:text-3xl font-serif cursor-pointer"
          >
            Seatify
          </Link>

          {/* ДЕСКТОПНОЕ МЕНЮ */}
          <nav className="hidden md:flex items-center gap-8 text-sm md:text-base">
            {navDesktop}
          </nav>

          {/* БУРГЕР-МЕНЮ */}
          <button
            type="button"
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-gray-300"
          >
            <div className="space-y-1">
              <span className="block w-5 h-0.5 bg-gray-800" />
              <span className="block w-5 h-0.5 bg-gray-800" />
              <span className="block w-5 h-0.5 bg-gray-800" />
            </div>
          </button>
        </div>

        {/* МОБИЛЬНОЕ МЕНЮ */}
        {open && (
          <nav className="mt-3 flex flex-col gap-3 text-sm md:hidden">
            {navMobile}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
