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

const listStatusTebakGambar = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function MasterTebakGambarEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    tbg_id: "",
    judulTebakGambar: "",
    gambar1: "",
    gambar2: "",
    jawaban1: "",
    jawaban2: "",
    jawaban3: "",
    jawaban4: "",
    statusTebakGambar: "",
  });

  const fileGambar1Ref = useRef(null);
  const fileGambar2Ref = useRef(null);

  const userSchema = object({
    tbg_id: string(),
    judulTebakGambar: string()
      .max(100, "Maksimum 100 karakter")
      .required("Harus diisi"),
    gambar1: string(),
    gambar2: string(),
    jawaban1: string().required("Harus diisi"),
    jawaban2: string().required("Harus diisi"),
    jawaban3: string().required("Harus diisi"),
    jawaban4: string().required("Harus diisi"),
    statusTebakGambar: string().required("Harus dipilih"),
  });

  const [, forceUpdate] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!withID) {
        setIsLoading(false);
        setIsError({ error: true, message: "ID Tebak Gambar tidak ditemukan" });
        return;
      }

      setIsError({ error: false, message: "" });
      try {
        const requestBody = {
          tbg_id: parseInt(withID),
        };

        const response = await fetch(
          API_LINK + "MasterTebakGambar/GetDataTebakGambarById",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data) {
          throw new Error("Data tidak ditemukan");
        }

        const tebakGambarData = Array.isArray(data) ? data[0] : data;

        if (!tebakGambarData) {
          throw new Error("Format data tidak valid");
        }

        formDataRef.current = {
          tbg_id: parseInt(withID),
          judulTebakGambar: tebakGambarData.judulTebakGambar || "",
          gambar1: tebakGambarData.gambar1 || "",
          gambar2: tebakGambarData.gambar2 || "",
          jawaban1: tebakGambarData.jawaban1 || "",
          jawaban2: tebakGambarData.jawaban2 || "",
          jawaban3: tebakGambarData.jawaban3 || "",
          jawaban4: tebakGambarData.jawaban4 || "",
          statusTebakGambar: tebakGambarData.statusTebakGambar || "",
        };

        setIsLoading(false);
      } catch (error) {
        setIsError({
          error: true,
          message: error.message || "Gagal mengambil data Tebak Gambar",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [withID]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
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
      setIsError({ error: false, message: "" });

      const uploadPromises = [];
      if (fileGambar1Ref.current?.files.length > 0) {
        uploadPromises.push(
          UploadFile(fileGambar1Ref.current).then((data) => {
            formDataRef.current.gambar1 = data.Hasil;
          })
        );
      }

      if (fileGambar2Ref.current?.files.length > 0) {
        uploadPromises.push(
          UploadFile(fileGambar2Ref.current).then((data) => {
            formDataRef.current.gambar2 = data.Hasil;
          })
        );
      }

      await Promise.all(uploadPromises);

      const response = await UseFetch(
        API_LINK + "MasterTebakGambar/EditTebakGambar",
        formDataRef.current
      );

      if (response[0]?.status === "success") {
        SweetAlert("Sukses", response[0]?.message, "success");
        onChangePage("index");
      } else {
        throw new Error(response[0]?.message || "Terjadi kesalahan tidak terduga");
      }
    } catch (error) {
      setIsError({
        error: true,
        message: error.message || "Terjadi kesalahan yang tidak diketahui",
      });
      SweetAlert("Error", error.message || "Terjadi kesalahan yang tidak diketahui", "error");
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
            Ubah Data Tebak Gambar
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="judulTebakGambar"
                  label="Judul Tebak Gambar"
                  isRequired
                  value={formDataRef.current.judulTebakGambar}
                  onChange={handleInputChange}
                  errorMessage={errors.judulTebakGambar}
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
              <div className="col-lg-12">
                <Input
                  type="text"
                  forInput="jawaban1"
                  label="Jawaban 1"
                  isRequired
                  value={formDataRef.current.jawaban1}
                  onChange={handleInputChange}
                  errorMessage={errors.jawaban1}
                />
                <Input
                  type="text"
                  forInput="jawaban2"
                  label="Jawaban 2"
                  isRequired
                  value={formDataRef.current.jawaban2}
                  onChange={handleInputChange}
                  errorMessage={errors.jawaban2}
                />
                <Input
                  type="text"
                  forInput="jawaban3"
                  label="Jawaban 3"
                  isRequired
                  value={formDataRef.current.jawaban3}
                  onChange={handleInputChange}
                  errorMessage={errors.jawaban3}
                />
                <Input
                  type="text"
                  forInput="jawaban4"
                  label="Jawaban 4"
                  isRequired
                  value={formDataRef.current.jawaban4}
                  onChange={handleInputChange}
                  errorMessage={errors.jawaban4}
                />
              </div>
              <div className="col-lg-4">
                <DropDown
                  forInput="statusTebakGambar"
                  label="Status"
                  arrData={listStatusTebakGambar}
                  isRequired
                  value={formDataRef.current.statusTebakGambar}
                  onChange={handleInputChange}
                  errorMessage={errors.statusTebakGambar}
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
