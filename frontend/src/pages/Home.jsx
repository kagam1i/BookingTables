import React from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { authService } from "../services/authService";
import Container from "../components/layout/Container";

const tableTypes = [
    {
        id: 1,
        seats: 1,
        title: "Cozy Table for One",
        description:
            "Perfect for solo dining, a quick lunch or enjoying a glass of wine with a book.",
        image: "/tables/table_1.jpg",
    },
    {
        id: 2,
        seats: 2,
        title: "Table for Two",
        description:
            "Ideal for date nights and intimate conversations in a calm atmosphere.",
        image: "/tables/table_2.jpg",
    },
    {
        id: 4,
        seats: 4,
        title: "Family Table",
        description:
            "Comfortable seating for small families or a group of close friends.",
        image: "/tables/table_4.jpg",
    },
    {
        id: 6,
        seats: 6,
        title: "Group Table",
        description:
            "Great for celebrations, birthdays and relaxed gatherings.",
        image: "/tables/table_6.jpg",
    },
    {
        id: 8,
        seats: 8,
        title: "Party Table",
        description:
            "Spacious table for larger groups and special events.",
        image: "/tables/table_8.jpg",
    },
    {
        id: 10,
        seats: 10,
        title: "Grand Celebration Table",
        description:
            "Perfect for big family gatherings, corporate dinners or milestone celebrations.",
        image: "/tables/table_10.jpg",
    },
];


function Home() {
    const navigate = useNavigate();

    const handleBookingClick = () => {
        if (authService.isAuthenticated()) {
            navigate("/booking");
        } else {
            navigate("/login");
        }
    };


    const handleTableTypeClick = () => {
        if (authService.isAuthenticated()) {
            navigate("/booking");
        } else {
            navigate("/login");
        }
    };

    const tableSectionRef = useRef(null);


    return (
        <main className="pb-0">
            {/* HERO*/}
            <section
                className="relative h-[80vh] min-h-[480px] flex items-center justify-center text-center text-white"
                style={{
                    backgroundImage: "url('/restaurant.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/55" />

                <div className="relative z-10 px-4">
                    <h2 className="text-xl md:text-4xl font-serif mb-2">
                        This is a table reservation system for smart restaurants.
                    </h2>
                    <p className="max-w-xl mx-auto text-sm md:text-base text-gray-100 mb-6">
                        Click the button below to book your desired table.
                    </p>
                    <button
                        onClick={() => {
                            tableSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="btn-primary text-base md:text-lg px-8 py-3 rounded-lg border border-yellow-300/70 bg-restaurant-gold/90 text-[#3d2520] hover:bg-yellow-500"
                    >
                        Reserve a Table
                    </button>
                </div>
            </section>

            {/* WELCOME */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <Container>
                    <div className="px-4 sm:px-6">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-center text-restaurant-dark mb-6 sm:mb-8">
                            Welcome to Seatify
                        </h2>

                        <div className="max-w-xl sm:max-w-2xl mx-auto space-y-3 sm:space-y-1">
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                                A table reservation system for smart restaurants — quick and easy online booking without calling.
                            </p>
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                                Guests enter their name, select the date, start and end time of their reservation, and then their table.
                            </p>
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                                Everything happens in a couple of clicks, any time of day or night, from their phone or computer.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>


            {/* TABLE TYPES */}
            <section ref={tableSectionRef} className="py-16 bg-restaurant-cream/60">
                <Container>
                    <h2 className="text-3xl md:text-4xl font-serif text-center text-restaurant-dark mb-10">
                        Choose your table
                    </h2>

                    <div className="grid gap-8 md:grid-cols-3">
                        {tableTypes.map((table) => (
                            <div
                                key={table.id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
                            >
                                <div className="h-40 md:h-48 w-full overflow-hidden">
                                    <img
                                        src={table.image}
                                        alt={table.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-lg font-semibold text-restaurant-dark mb-1">
                                        {table.title}
                                    </h3>
                                    <p className="text-sm italic text-gray-700 mb-1">
                                        Seats up to{" "}
                                        <span className="font-semibold">{table.seats}</span>{" "}
                                        {table.seats === 1 ? "guest" : "guests"}
                                    </p>
                                    <p className="text-sm text-gray-600 flex-1">
                                        {table.description}
                                    </p>

                                    <button
                                        onClick={handleTableTypeClick}
                                        className="mt-4 self-start btn-primary px-5 py-2 text-sm"
                                    >
                                        Reserve this table →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* FOOTER */}
            <section className="bg-[#3d2520] text-white pt-12 pb-8 sm:pt-16 sm:pb-10">
                <Container>
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-3 sm:mb-4 leading-snug">
                            Ready to make your restaurant smarter?
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-gray-200 mb-5 sm:mb-6 max-w-xl mx-auto leading-relaxed">
                            Seatify automates table reservations, reduces no-shows and helps
                            guests book the perfect table in seconds.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3 text-xs sm:text-sm text-gray-300">
                        {/* About Seatify */}
                        <div className="space-y-2 sm:space-y-3 text-center md:text-left">
                            <h3 className="font-semibold text-white text-base sm:text-lg">
                                About Seatify
                            </h3>
                            <p className="leading-relaxed">
                                Seatify is a smart table reservation system for modern restaurants.
                                Real-time availability, intuitive booking and a smooth experience
                                for both guests and staff.
                            </p>
                        </div>

                        {/* For Restaurants */}
                        <div className="space-y-2 sm:space-y-3 text-center">
                            <h3 className="font-semibold text-white text-base sm:text-lg">
                                For Restaurants
                            </h3>
                            <p>24/7 online reservations</p>
                            <p>Smart table allocation</p>
                            <p>Guest history &amp; insights</p>
                            <p>Fewer phone calls and no-shows</p>
                        </div>

                        {/* For Guests */}
                        <div className="space-y-2 sm:space-y-3 text-center md:text-right">
                            <h3 className="font-semibold text-white text-base sm:text-lg">
                                For Guests &amp; Support
                            </h3>
                            <p>Instant confirmation</p>
                            <p>Mobile-friendly booking</p>
                            <p>Modify or cancel in a few taps</p>
                            <p>Contact: support@seatify.app</p>
                        </div>
                    </div>

                    {/* COPYRIGHT */}
                    <div className="text-center text-[11px] sm:text-xs md:text-sm text-gray-400 mt-8 sm:mt-10">
                        © 2025 Seatify. Smart Table Reservation System. All rights reserved.
                    </div>
                </Container>
            </section>
        </main>
    );
}

export default Home;
