
export interface LostFoundItem {
    id: string;
    title: string;
    category: "Books" | "Electronics" | "ID Cards" | "Clothing" | "Other";
    description: string;
    location: string;
    date: string;
    image?: string;
    type: "lost" | "found";
    status: "LOST" | "FOUND" | "CLAIMED";
    contact: {
        type: "Email" | "Phone" | "Chat";
        value: string;
    };
}

export const CAMPUS_LOCATIONS = [
    "SEECS",
    "NBS",
    "SADA",
    "SMME",
    "IGIS",
    "IESE",
    "IAEC",
    "RIMMS",
    "CIPS",
    "H-12 Main Office",
    "Library",
    "C1",
    "C2",
    "C3",
    "Added in Description"
    
];

export const mockLostFoundItems: LostFoundItem[] = [
    {
        id: "lf-1",
        title: "Blue Water Bottle",
        category: "Other",
        description: "Lost my blue Nike water bottle in SEECS Lab 3.",
        location: "SEECS",
        date: "2024-03-10",
        image: "https://images.unsplash.com/photo-1724992609118-551ad0b79421?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        type: "lost",
        status: "LOST",
        contact: { type: "Phone", value: "0300-1234567" },
    },
    {
        id: "lf-2",
        title: "Calculus Book (Thomas)",
        category: "Books",
        description: "Found a Calculus book on a bench near C1.",
        location: "C1",
        date: "2024-03-12",
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D",
        type: "found",
        status: "FOUND",
        contact: { type: "Email", value: "student@nust.edu.pk" },
    },
    {
        id: "lf-3",
        title: "Student ID Card",
        category: "ID Cards",
        description: "Found an ID card belonging to 'Ahmed Khan'.",
        location: "Library",
        date: "2024-03-14",
        type: "found",
        status: "CLAIMED",
        contact: { type: "Chat", value: "ahmed_k" },
    },
];
