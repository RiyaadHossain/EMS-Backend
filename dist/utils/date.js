"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeAgo = exports.calculateDateDifference = exports.twoDigitDay = exports.formatDate = exports.getTotalDaysInMonth = void 0;
const getTotalDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};
exports.getTotalDaysInMonth = getTotalDaysInMonth;
const formatDate = (date) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
    return formattedDate;
};
exports.formatDate = formatDate;
const twoDigitDay = (day) => {
    return `day${day.toString().padStart(2, '0')}`;
};
exports.twoDigitDay = twoDigitDay;
const calculateDateDifference = (startDate, endDate) => {
    // Ensure the start and end dates are Date objects
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    // Calculate the difference in years
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();
    // If the difference in months is negative, adjust the year and months
    if (months < 0) {
        years--;
        months += 12;
    }
    // If the difference in days is negative, adjust the months and days
    if (days < 0) {
        months--;
        // Get the last day of the previous month
        const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += lastMonth.getDate();
    }
    // Return the result as a string in a readable format
    const result = [];
    if (years > 0)
        result.push(`${years} years`);
    if (months > 0)
        result.push(`${months} months`);
    if (days > 0)
        result.push(`${days} days`);
    return result.join(', ');
};
exports.calculateDateDifference = calculateDateDifference;
const timeAgo = (inputDate) => {
    const now = new Date();
    const diffInMs = now.getTime() - inputDate.getTime(); // Difference in milliseconds
    const diffInSeconds = Math.floor(diffInMs / 1000);
    if (diffInSeconds < 60) {
        return `${diffInSeconds} sec ago`;
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} min ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    }
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};
exports.timeAgo = timeAgo;
