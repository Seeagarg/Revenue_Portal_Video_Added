const { poolPromotion, pool } = require("./database");
module.exports = {
  truncatenInsert: () => {
    const previousDayYear = getYearOfPreviousDay();
    console.log(`Year of the previous day is: ${previousDayYear}`);

    const previousDayMonth = getPreviousDayMonth();
    console.log(`Month of the previous day is: ${previousDayMonth}`);
    // INSERT INTO tbl_promotion_logs_summary SELECT  MONTH(DATE),YEAR(DATE),partner,COUNT(1) AS CNT, SUM(deducted_amount) AS deducted_amount,SUM(deducted_amount)/20 AS USD,1  FROM tbl_promotion_logs WHERE MONTH(DATE)=7  AND YEAR(DATE)=2023 AND partnercallbackUrl='null' GROUP BY  1,2,3

    // INSERT INTO tbl_promotion_logs_summary SELECT  MONTH(DATE),YEAR(DATE),partner,COUNT(1) AS CNT, SUM(deducted_amount) AS deducted_amount,SUM(deducted_amount)/20 AS USD,2  FROM tbl_promotion_logs WHERE MONTH(DATE)=7  AND YEAR(DATE)=2023 AND partnercallbackUrl!='null' GROUP BY  1,2,3
    const updateNullData = `INSERT INTO tbl_promotion_logs_summary SELECT  MONTH(DATE),YEAR(DATE),partner,COUNT(1) AS CNT, SUM(deducted_amount) AS deducted_amount,SUM(deducted_amount)/20 AS USD,1,now(),'ndoto'  FROM tbl_promotion_logs WHERE MONTH(DATE)=${previousDayMonth}  AND YEAR(DATE)=${previousDayYear} AND partnercallbackUrl='null' GROUP BY  1,2,3`;
    const updateNotNullData = `INSERT INTO tbl_promotion_logs_summary SELECT  MONTH(DATE),YEAR(DATE),partner,COUNT(1) AS CNT, SUM(deducted_amount) AS deducted_amount,SUM(deducted_amount)/20 AS USD,2,now(),'ndoto'  FROM tbl_promotion_logs WHERE MONTH(DATE)=${previousDayMonth}  AND YEAR(DATE)=${previousDayYear} AND partnercallbackUrl!='null' GROUP BY  1,2,3`;

    const deleteCurrentMonthLogs = `DELETE FROM tbl_promotion_logs_summary WHERE MONTH=${previousDayMonth} AND YEAR=${previousDayYear}`;

    poolPromotion.query(`${deleteCurrentMonthLogs}`, [], (err, results) => {
      if (err) throw err;

      console.log("Success ");
      poolPromotion.query(`${updateNullData}`, [], (errNull, successNull) => {
        if (errNull) throw errNull;
        console.log("Success Null ");
        poolPromotion.query(
          `${updateNotNullData}`,
          [],
          (errNotNull, successNull) => {
            if (errNull) throw errNotNull;
            console.log("Success Not Null ");
          }
        );
      });
    });

    console.log("deleteCurrentMonthLogs ", deleteCurrentMonthLogs);

    delete from;
  },
};

function getYearOfPreviousDay() {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date of the previous day
  const previousDay = new Date(currentDate);
  previousDay.setDate(previousDay.getDate() - 1);

  // Get the year of the previous day
  const yearOfPreviousDay = previousDay.getFullYear();

  return yearOfPreviousDay;
}

function getPreviousDayMonth() {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date of the previous day
  const previousDay = new Date(currentDate);
  previousDay.setDate(previousDay.getDate() - 1);

  // Get the month of the previous day (months are zero-indexed in JavaScript)
  const previousDayMonth = previousDay.getMonth() + 1;

  return previousDayMonth;
}
