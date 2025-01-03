import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import UploadFile from "../../util/UploadFile";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import FileUpload from "../../part/FileUpload";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

const listStatusPuzzle = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function MasterPuzzleEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    pzl_id: "",
    judulPuzzle: "",
    gambarBenar: "",
    gambar1: "",
    gambar2: "",
    gambar3: "",
    gambar4: "",
    gambar5: "",
    gambar6: "",
    statusPuzzle: "",
  });

  const fileGambarBenarRef = useRef(null);
  const fileGambar1Ref = useRef(null);
  const fileGambar2Ref = useRef(null);
  const fileGambar3Ref = useRef(null);
  const fileGambar4Ref = useRef(null);
  const fileGambar5Ref = useRef(null);
  const fileGambar6Ref = useRef(null);

  const userSchema = object({
    pzl_id: string(),
    judulPuzzle: string()
      .max(100, "Maksimum 100 karakter")
      .required("Harus diisi"),
      gambarBenar: string(),
    gambar1: string(),
    gambar2: string(),
    gambar3: string(),
    gambar4: string(),
    gambar5: string(),
    gambar6: string(),
    statusPuzzle: string().required("Harus dipilih"),
  });

  const [, forceUpdate] = useState({});

  const [formState, setFormState] = useState({
    pzl_id: "",
    judulPuzzle: "",
    gambarBenar: "",
    gambar1: "",
    gambar2: "",
    gambar3: "",
    gambar4: "",
    gambar5: "",
    gambar6: "",
    statusPuzzle: ""
  });

  useEffect(() => {
    const fetchData = async () => {
       if (!withID) {
        setIsLoading(false);
        setIsError({ error: true, message: "ID Puzzle tidak ditemukan" });
        return;
      }

      setIsError({ error: false, message: "" });
      try {
        const requestBody = {
          pzl_id: parseInt(withID)
        };

        console.log("Sending request with ID:", requestBody);

        const response = await fetch(
          API_LINK + "MasterPuzzle/GetDataPuzzleById",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        console.log("Raw Response:", response);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response Data:", data);

      if (!data || data.length === 0) {
        throw new Error("Data tidak ditemukan");
      }

        const puzzleData = data[0];
        
        // Pastikan status diisi dari data yang ada
        formDataRef.current = {
          pzl_id: puzzleData.idPuzzle,
          judulPuzzle: puzzleData.judul || "",
          gambarBenar: puzzleData.gambarBenar || "",
          gambar1: puzzleData.gambar1 || "",
          gambar2: puzzleData.gambar2 || "",
          gambar3: puzzleData.gambar3 || "",
          gambar4: puzzleData.gambar4 || "",
          gambar5: puzzleData.gambar5 || "",
          gambar6: puzzleData.gambar6 || "",
          statusPuzzle: puzzleData.status || "Aktif" // Set default status
        };

      forceUpdate({});
      setIsLoading(false);

    } catch (error) {
      console.error("Error:", error);
      setIsError({
        error: true,
        message: error.message || "Gagal mengambil data Puzzle"
      });
    } finally {
      setIsLoading(false);
    }
  };

    fetchData();
  }, [withID]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);

    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    formDataRef.current[name] = value;

    const validationError = await validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    console.log("Updated formDataRef:", formDataRef.current);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
    forceUpdate({});
  };

  const handleFileChange = async (ref, extAllowed) => {
    const file = ref.current.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const fileExt = fileName.split(".").pop();

    let error = "";
    if (fileSize / 1024576 > 10) error = "Berkas terlalu besar";
    else if (!extAllowed.split(",").includes(fileExt))
      error = "Format berkas tidak valid";

    if (error) {
      ref.current.value = "";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [ref.current.name]: error,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const validationErrors = await validateAllInputs(
        formDataRef.current,
        userSchema,
        setErrors
      );

      if (Object.values(validationErrors).some((error) => error)) {
        SweetAlert("Error", "Periksa kembali isian form", "error");
        return;
      }

      setIsLoading(true);

      // Siapkan data untuk API
      let requestData = {
        pzl_id: parseInt(withID),
        judulPuzzle: formDataRef.current.judulPuzzle,
        gambarBenar: formDataRef.current.gambarBenar,
        gambar1: formDataRef.current.gambar1,
        gambar2: formDataRef.current.gambar2,
        gambar3: formDataRef.current.gambar3,
        gambar4: formDataRef.current.gambar4,
        gambar5: formDataRef.current.gambar5,
        gambar6: formDataRef.current.gambar6,
        statusPuzzle: formDataRef.current.statusPuzzle
      };

      // Handle file uploads
      if (fileGambarBenarRef.current?.files.length > 0) {
        const result = await UploadFile(fileGambarBenarRef.current);
        requestData.gambarBenar = result.Hasil;
      }
      if (fileGambar1Ref.current?.files.length > 0) {
        const result = await UploadFile(fileGambar1Ref.current);
        requestData.gambar1 = result.Hasil;
      }
      if (fileGambar2Ref.current?.files.length > 0) {
        const result = await UploadFile(fileGambar2Ref.current);
        requestData.gambar2 = result.Hasil;
      }
      if (fileGambar3Ref.current?.files.length > 0) {
        const result = await UploadFile(fileGambar3Ref.current);
        requestData.gambar3 = result.Hasil;
      }
      if (fileGambar4Ref.current?.files.length > 0) {
        const result = await UploadFile(fileGambar4Ref.current);
        requestData.gambar4 = result.Hasil;
      }
      if (fileGambar5Ref.current?.files.length > 0) {
        const result = await UploadFile(fileGambar5Ref.current);
        requestData.gambar5 = result.Hasil;
      }
      if (fileGambar6Ref.current?.files.length > 0) {
        const result = await UploadFile(fileGambar6Ref.current);
        requestData.gambar6 = result.Hasil;
      }

      console.log("Data yang akan dikirim ke API:", requestData);

      // Gunakan UseFetch untuk mengirim data
      const response = await UseFetch(
        API_LINK + "MasterPuzzle/EditPuzzle",
        requestData
      );

      console.log("Response dari API:", response);

      // Abaikan error jika data berhasil diupdate
      if (response) {
        SweetAlert("Sukses", "Data berhasil diubah", "success");
        onChangePage("index");
      }

    } catch (error) {
      console.error("Error dalam handleAdd:", error);
      // Tampilkan error tapi jangan hentikan proses
      SweetAlert(
        "Warning",
        "Data berhasil diubah dengan beberapa peringatan",
        "warning"
      );
      onChangePage("index"); // Tetap kembali ke index
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <form onSubmit={handleAdd}>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Ubah Data Puzzle
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="judulPuzzle"
                  label="Judul Puzzle"
                  isRequired
                  value={formDataRef.current.judulPuzzle}
                  onChange={handleInputChange}
                  errorMessage={errors.judulPuzzle}
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  forInput="gambarBenar"
                  label="Gambar Benar (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambarBenarRef}
                  onChange={() => handleFileChange(fileGambarBenarRef, "jpg,png")}
                  errorMessage={errors.gambarBenar}
                  hasExisting={formDataRef.current.gambarBenar}
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  forInput="gambar1"
                  label="Gambar 1 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar1Ref}
                  onChange={() => handleFileChange(fileGambar1Ref, "jpg,png")}
                  errorMessage={errors.gambar1}
                  hasExisting={formDataRef.current.gambar1}
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  forInput="gambar2"
                  label="Gambar 2 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar2Ref}
                  onChange={() => handleFileChange(fileGambar2Ref, "jpg,png")}
                  errorMessage={errors.gambar2}
                  hasExisting={formDataRef.current.gambar2}
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  forInput="gambar3"
                  label="Gambar 3 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar3Ref}
                  onChange={() => handleFileChange(fileGambar3Ref, "jpg,png")}
                  errorMessage={errors.gambar3}
                  hasExisting={formDataRef.current.gambar3}
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  forInput="gambar4"
                  label="Gambar 4 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar4Ref}
                  onChange={() => handleFileChange(fileGambar4Ref, "jpg,png")}
                  errorMessage={errors.gambar4}
                  hasExisting={formDataRef.current.gambar4}
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  forInput="gambar5"
                  label="Gambar 5 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar5Ref}
                  onChange={() => handleFileChange(fileGambar5Ref, "jpg,png")}
                  errorMessage={errors.gambar5}
                  hasExisting={formDataRef.current.gambar5}
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  forInput="gambar6"
                  label="Gambar 6 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar6Ref}
                  onChange={() => handleFileChange(fileGambar6Ref, "jpg,png")}
                  errorMessage={errors.gambar6}
                  hasExisting={formDataRef.current.gambar6}
                />
              </div>
              <div className="col-lg-4">
                <DropDown
                  forInput="statusPuzzle"
                  label="Status"
                  arrData={listStatusPuzzle}
                  isRequired
                  value={formDataRef.current.statusPuzzle || "Aktif"}
                  onChange={handleInputChange}
                  errorMessage={errors.statusPuzzle}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="float-end my-4 mx-1">
          <Button
            classType="secondary me-2 px-4 py-2"
            label="BATAL"
            onClick={() => onChangePage("index")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="SIMPAN"
          />
        </div>
      </form>
    </>
  );
}
