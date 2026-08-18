
const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;



const validateUserCreation = ({
    firstName,
    lastName,
    email,
    password,
    phone,
    location
}) =>{



    //Name Validations

     if (!firstName || firstName.trim() === ""  ||
         !lastName  || lastName.trim() === ""  ||
         !email || email.trim() === "" ||
         !phone || phone.trim() === ""||
         !password || password.trim() === ""
        )
    {
        const error = new Error("Invalid data");
        error.auditReason = "Missing any of email, firstName, lastName, phone or password";
        error.statusCode = 400;
        throw error;
    }

    if (!nameRegex.test(firstName.trim())) {
        const error = new Error("Invalid data");
        error.auditReason = "Invalid first name";
        error.statusCode = 400;
        throw error;
    }

    if (!nameRegex.test(lastName.trim())) {
        const error = new Error("Invalid data");
        error.auditReason = "Invalid last name";
        error.statusCode = 400;
        throw error;
    }


    // Email Validations

    if (!emailRegex.test(email.trim())) {
        const error = new Error("Invalid data");
        error.auditReason = "Invalid email format";
        error.statusCode = 400;
        throw error;
    }


    //Phone Validations
    
    if (!phoneRegex.test(phone.trim())) {
        const error = new Error("Invalid data");
        error.auditReason = "Invalid phone number"
        error.statusCode = 400;
        throw error;
    }

    // password validations
    if (!password || !passwordRegex.test(password)) {
        const error = new Error("Invalid data");
        error.auditReason =
            "Password is not valid, it must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
        error.statusCode = 400;
        throw error;
    }

    //location

    if (location !== undefined && location !== null) {

        if (typeof location !== "string") {
            const error = new Error("Invalid data");
            error.auditReason = "Location must be a string";
            error.statusCode = 400;
            throw error;
        }

        const normalizedLocation = location.trim();

        if (normalizedLocation.length < 2 || normalizedLocation.length > 50) {
            const error = new Error("Invalid data");
            error.auditReason =
                "Location must contain at least 2 characters and should not exceed 50 characters";
            error.statusCode = 400;
            throw error;
        }
    }

};

export default validateUserCreation;
