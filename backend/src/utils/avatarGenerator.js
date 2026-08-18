const generateAvatarUrl = (firstName, lastName) => {

    if (!firstName?.trim() || !lastName?.trim()) {
        const error = new Error("Invalid data");
        error.auditReason = "First name and last name are required to generate avatar"
        error.statusCode = 400;
        throw error;
    }

    const firstInitial = firstName.trim().charAt(0).toUpperCase();
    const lastInitial = lastName.trim().charAt(0).toUpperCase();

    const initials = `${firstInitial}${lastInitial}`;

    return `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(initials)}`;
};

export default generateAvatarUrl;