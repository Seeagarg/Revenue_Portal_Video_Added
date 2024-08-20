import { Button } from "primereact/button";
import React from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import classes from "./ExportDailyRevenueAdmin.module.css";
import { TabMenu } from "primereact/tabmenu";

const ExportDailyRevenueAdmin = ({ data, handleTabChanged, tabIndex }) => {
  const items = [
    { label: "Overview" },
    { label: "Subscriptions" },
    { label: "Unsubscriptions" },
    { label: "Renewals" },
    { label: "Revenue" },
  ];

  const handleTabChange = (index) => {
    handleTabChanged(index);
  };

  const createDownloadData = () => {
    handleExport().then((url) => {
      const downloadAnchorElement = document.createElement("a");
      downloadAnchorElement.setAttribute("href", url);
      downloadAnchorElement.setAttribute("download", "revenue_report.xlsx");
      downloadAnchorElement.click();
      downloadAnchorElement.remove();
    });
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);

    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }

    return buf;
  };

  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: "xlsx",
      type: "binary",
    };
    const wbout = XLSX.write(workbook, wopts);

    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });
    return blob;
  };

  const handleExport = () => {
    let table = [
      {
        A: "Date",
        B: "Total Base",
        C: "Total Active Base",
        D: "Subscriptions",
        E: "Unsubscriptions",
        F: "Renewal Revenue",
        G: "Renewals Count",
        H: "Subscription Revenue",
        I: "Daily Revenue",
        J: "Total Revenue",
      },
    ];
    data.forEach((row) => {
      const misDate = row.misDate;
      const totalBase = row.totalBase;
      const totalActiveBase = row.totalActiveBase;
      const subscriptions = row.subscriptions;
      const unsubscriptions = row.unsubscriptions;
      const renewalsRevenue = row.renewalsRevenue;
      const renewals = row?.renewals;
      const subscriptionRevenue = row.subscriptionRevenue;
      const dailyRevenue = row?.totalRevenue;
      const totalRevenue = row?.totalRevenueAccumulated;

      table.push({
        A: misDate,
        B: totalBase,
        C: totalActiveBase,
        D: subscriptions,
        E: unsubscriptions,
        F: renewalsRevenue,
        G: renewals,
        H: subscriptionRevenue,
        I: dailyRevenue,
        J: totalRevenue,
      });
    });
    const finalData = [...table];

    //creating workbook
    const wb = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, sheet, "Revenue_Report");
    const workbookblob = workbook2blob(wb);

    const headerIndexes = [];
    finalData.forEach((data, index) =>
      data["A"] === "Date" ? headerIndexes.push(index) : null
    );
    const totalIndex = [];
    finalData.forEach((data, index) =>
      data["A"] === "Totals" ? totalIndex.push(index) : null
    );

    const dataInfo = {
      titleCell: "A2",
      titleRange: "A1:H2",
      tbodyRange: `A1:L${finalData.length}`,
      theadRange:
        headerIndexes.length >= 1
          ? `A${headerIndexes[0] + 1}:J${headerIndexes[0] + 1}`
          : null,
      ttotalRange:
        totalIndex.length >= 1
          ? `A${totalIndex[0] + 1}:J${totalIndex[0] + 1}`
          : null,
    };
    return addStyles(workbookblob, dataInfo);
  };

  const addStyles = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        sheet.column("A").width(15);
        sheet.column("B").width(15);
        sheet.column("C").width(15);
        sheet.column("D").width(15);
        sheet.column("E").width(15);
        sheet.column("F").width(15);
        sheet.column("G").width(15);
        sheet.column("H").width(15);
        sheet.column("I").width(15);
        sheet.column("J").width(15);

        sheet.range(dataInfo.tbodyRange).style({
          horizontalAlignment: "left",
          verticalAlignment: "middle",
        });
        sheet.range(dataInfo.theadRange).style({
          fill: "FFFD04",
          bold: true,
          wrapText: true,
        });
        sheet.range(dataInfo.ttotalRange).style({
          fill: "FFFD04",
          bold: true,
        });

      });
      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };

  return (
    <div className={classes.header}>
      <div className={classes.filter_button_container}>
        <TabMenu
          className={classes.tab}
          model={items}
          activeIndex={tabIndex}
          onTabChange={(e) => handleTabChange(e?.index)}
        />
      </div>
      <Button
        type="button"
        icon="pi pi-file-excel"
        severity="success"
        rounded
        onClick={createDownloadData}
        data-pr-tooltip="XLS"
      />
    </div>
  );
};

export default ExportDailyRevenueAdmin;
