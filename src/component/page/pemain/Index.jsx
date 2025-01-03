import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Nama Pemain": null,
    "No Telepon": null,
    Grade: null,
    Sekolah: null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Nama Pemain] asc", Text: "Nama Pemain [↑]" },
  { Value: "[Nama Pemain] desc", Text: "Nama Pemain [↓]" },
];


export default function MasterPemainIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Nama Pemain] asc",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: newCurrentPage,
    }));
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: 1,
      query: searchQuery.current.value,
      sort: searchFilterSort.current.value,
    }));
  }

function handleExportExcel() {
  if (!currentData || currentData.length === 0 || !currentData[0].Key) {
    SweetAlert("Peringatan", "Tidak ada data untuk diexport.", "warning");
    return;
  }

  // Buat workbook dan worksheet baru
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data Pemain");

  // Tambahkan header dengan kolom
  worksheet.columns = [
    { header: "No", key: "No", width: 10 },
    { header: "Nama Pemain", key: "Nama Pemain", width: 20 },
    { header: "No Telepon", key: "No Telepon", width: 15 },
    { header: "Grade", key: "Grade", width: 10 },
    { header: "Sekolah", key: "Sekolah", width: 20 },
  ];

  currentData.forEach((item) => {
    worksheet.addRow({
      No: item.No,
      "Nama Pemain": item["Nama Pemain"],
      "No Telepon": item["No Telepon"],
      Grade: item.Grade,
      Sekolah: item.Sekolah,
    });
  });

  // Tambahkan styling untuk header (baris pertama)
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } }; // Font putih
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4F81BD" }, // Background biru
    };
    cell.alignment = { horizontal: "center", vertical: "middle" }; // Rata tengah
    cell.border = {
      top: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
  });

  // Tambahkan border untuk setiap data
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });
  });

  // Simpan file Excel
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "DataPemain.xlsx");
  });
}

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const data = await UseFetch(
          API_LINK + "MasterPemain/GetDataPemain",
          currentFilter
        );

        let ada = "true";
        if(data === null){
          ada = "false";
        }
        console.log(ada);

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value) => ({
            ...value,
            Alignment: ["center", "center", "center", "center", "center", "center"],
          }));
          setCurrentData(formattedData);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentFilter]);

  return (
  <>
    <div className="d-flex flex-column">
      {isError && (
        <div className="flex-fill">
          <Alert
            type="warning"
            message="Terjadi kesalahan: Gagal mengambil data pemain."
          />
        </div>
      )}
      <div className="flex-fill">
        <div className="input-group">
          <Input
            ref={searchQuery}
            forInput="pencarianPemain"
            placeholder="Cari"
          />
          <Button
            iconName="search"
            classType="primary px-4"
            title="Cari"
            onClick={handleSearch}
          />
          <Button
            iconName="download"
            classType="success px-4"
            title="Export Excel"
            onClick={handleExportExcel} 
          />
          <Filter>
            <DropDown
              ref={searchFilterSort}
              forInput="ddUrut"
              label="Urut Berdasarkan"
              type="none"
              arrData={dataFilterSort}
              defaultValue="[Nama Pemain] asc"
            />
          </Filter>
        </div>
      </div>
      <div className="mt-3">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="d-flex flex-column">
            <Table
              data={currentData}
            />
            <Paging
              pageSize={PAGE_SIZE}
              pageCurrent={currentFilter.page}
              totalData={currentData[0]["Count"]}
              navigation={handleSetCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  </>
);
}
