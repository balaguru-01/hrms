const calculateSubscriptionEndDate = (startDate, duration, durationType) => {

    const endDate = new Date(startDate);

    switch (durationType) {

        case "Days":
            endDate.setDate(endDate.getDate() + duration);
            break;

        case "Months":
            endDate.setMonth(endDate.getMonth() + duration);
            break;

        case "Years":
            endDate.setFullYear(endDate.getFullYear() + duration);
            break;

        default:
            throw new Error("Invalid subscription duration type");

    }

    return endDate;
};

module.exports = {
    calculateSubscriptionEndDate
};