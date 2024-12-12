import Attendance from '@/app/modules/attendance/model';
import Employee from '@/app/modules/employee/model';
import cron from 'node-cron';

const initiailzeAttdSheet = async () => {
  // Cron expression for the last day of the month at midnight
  const lastDayCron = '59 23 28-31 * *'; // test = "*/1 * * * *" (every minute)
  cron.schedule(lastDayCron, async () => {
    const today = new Date();
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Check if today is the last day of the month
    if (tomorrow.getDate() === 1) {
      const employees = await Employee.find();
      employees.forEach(async employee => {
        const sheetData = {
          month: tomorrow.getMonth(),
          year: tomorrow.getFullYear(),
          user: employee.user,
        };

        const attendance = await Attendance.find(sheetData);
        if (!attendance) await Attendance.create(sheetData);
      });
    }
  });
};

export default initiailzeAttdSheet;
