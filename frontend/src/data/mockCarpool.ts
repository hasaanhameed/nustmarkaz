
export interface Ride {
    id: string;
    driver: {
        name: string;
        avatar?: string; // URL or null
    };
    from: string;
    to: string;
    date: string;
    time: string;
    availableSeats: number;
    totalSeats: number;
    vehicle: {
        type: "Car" | "Bike";
        model: string;
        color: string;
    };
    price: number;
    contact: string;
}

export const CAMPUS_LOCATIONS = [
    "NUST H-12 Main Gate",
    "NUST Gate 1",
    "NUST Gate 2",
    "SEECS",
    "NBS",
    "SADA",
    "SMME",
    "C1",
    "C2",
    "Concordia 1",
    "Concordia 2",
];

export const CITY_LOCATIONS = [
    "Saddar",
    "Blue Area",
    "F-10 Markaz",
    "G-11 Markaz",
    "I-8 Markaz",
    "Peshawar Road",
    "DHA 2",
    "Bahria Town",
    "Pwd",
];

export const mockRides: Ride[] = [
    {
        id: "ride-1",
        driver: { name: "Bilal Ahmed" },
        from: "DHA 2",
        to: "SEECS",
        date: "2024-03-20",
        time: "08:15 AM",
        availableSeats: 2,
        totalSeats: 4,
        vehicle: { type: "Car", model: "Honda City", color: "White" },
        price: 300,
        contact: "0321-9876543",
    },
    {
        id: "ride-2",
        driver: { name: "Hamza Ali" },
        from: "G-11 Markaz",
        to: "NBS",
        date: "2024-03-20",
        time: "08:30 AM",
        availableSeats: 1,
        totalSeats: 1,
        vehicle: { type: "Bike", model: "Yamaha YBR", color: "Red" },
        price: 150,
        contact: "0300-5555555",
    },
    {
        id: "ride-3",
        driver: { name: "Ayesha Khan" },
        from: "SEECS",
        to: "F-10 Markaz",
        date: "2024-03-20",
        time: "05:15 PM",
        availableSeats: 3,
        totalSeats: 4,
        vehicle: { type: "Car", model: "Suzuki Alto", color: "Grey" },
        price: 200,
        contact: "0333-1122334",
    },
];
