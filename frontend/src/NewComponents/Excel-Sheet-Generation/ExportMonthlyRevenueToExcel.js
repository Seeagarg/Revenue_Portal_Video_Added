import { Button } from "primereact/button";
import React from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";

const ExportMonthlyRevenueToExcel = ({ data }) => {
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
        B: "Renewals Revenue",
        C: "Subscription Revenue",
        D: "Total Revenue",
      },
    ];
    data.forEach((row) => {
      const misDate = row.misDate;
      const renewalsRevenue = row.renewalsRevenue;
      const subscriptionRevenue = row.subscriptionRevenue;
      const totalRevenue = row.totalRevenue;

      table.push({
        A: misDate,
        B: renewalsRevenue,
        C: subscriptionRevenue,
        D: totalRevenue,
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
      tbodyRange: `A1:D${finalData.length}`,
      theadRange:
        headerIndexes.length >= 1
          ? `A${headerIndexes[0] + 1}:D${headerIndexes[0] + 1}`
          : null,
      ttotalRange:
        totalIndex.length >= 1
          ? `A${totalIndex[0] + 1}:D${totalIndex[0] + 1}`
          : null,
    };
    return addStyles(workbookblob, dataInfo);
  };

  const addStyles = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        sheet.column("A").width(20);
        sheet.column("B").width(20);
        sheet.column("C").width(20);
        sheet.column("D").width(20);

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

  const headerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "2rem",
  };

  return (
    <div style={headerStyles}>
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

export default ExportMonthlyRevenueToExcel;
