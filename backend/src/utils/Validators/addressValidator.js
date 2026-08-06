const validateAddress = (address) => {

    if (!address || typeof address !== "object") {
        const error = new Error("Address is required");
        error.statusCode = 400;
        throw error;
    }

    if (!address.city || address.city.trim() === "") {
        const error = new Error("City is required");
        error.statusCode = 400;
        throw error;
    }

    if (address.city.trim().length < 2 || address.city.trim().length > 50) {
        const error = new Error("City must be between 2 and 50 characters");
        error.statusCode = 400;
        throw error;
    }

    if (!address.state || address.state.trim() === "") {
        const error = new Error("State is required");
        error.statusCode = 400;
        throw error;
    }

    if (address.state.trim().length < 2 || address.state.trim().length > 50) {
        const error = new Error("State must be between 2 and 50 characters");
        error.statusCode = 400;
        throw error;
    }

    if (!address.postalCode || address.postalCode.trim() === "") {
        const error = new Error("Postal code is required");
        error.statusCode = 400;
        throw error;
    }

    if (!/^[1-9][0-9]{5}$/.test(address.postalCode.trim())) {
        const error = new Error("Enter a valid postal code");
        error.statusCode = 400;
        throw error;
    }

    if (address.doorNumber && address.doorNumber.trim().length > 20) {
        const error = new Error("Door number cannot exceed 20 characters");
        error.statusCode = 400;
        throw error;
    }

    if (address.street && address.street.trim().length > 100) {
        const error = new Error("Street cannot exceed 100 characters");
        error.statusCode = 400;
        throw error;
    }

    if (address.country && address.country.trim().length > 50) {
        const error = new Error("Country cannot exceed 50 characters");
        error.statusCode = 400;
        throw error;
    }

    return {
        doorNumber: address.doorNumber?.trim() || "",
        street: address.street?.trim() || "",
        city: address.city.trim(),
        state: address.state.trim(),
        country: address.country?.trim() || "India",
        postalCode: address.postalCode.trim()
    };
};

module.exports = {validateAddress};