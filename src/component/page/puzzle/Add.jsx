import { useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import UploadFile from "../../util/UploadFile";
import Button from "../../part/Button";
import Input from "../../part/Input";
import FileUpload from "../../part/FileUpload";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterTebakGambarAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const formDataRef = useRef({
    judul: "",
    gambarBenar: "",
    gambar1: "",
    gambar2: "",
    gambar3: "",
    gambar4: "",
    gambar5: "",
    gambar6: "",
  });

  const fileGambarBenarRef = useRef(null);
  const fileGambar1Ref = useRef(null);
  const fileGambar2Ref = useRef(null);
  const fileGambar3Ref = useRef(null);
  const fileGambar4Ref = useRef(null);
  const fileGambar5Ref = useRef(null);
  const fileGambar6Ref = useRef(null);

  const userSchema = object({
    judul: string().max(100, "Maksimum 100 karakter").required("Harus diisi"),
    gambarBenar: string().required("Gambar Benar harus diunggah"),
    gambar1: string().required("Gambar 1 harus diunggah"),
    gambar2: string().required("Gambar 2 harus diunggah"),
    gambar3: string().required("Gambar 3 harus diunggah"),
    gambar4: string().required("Gambar 4 harus diunggah"),
    gambar5: string().required("Gambar 5 harus diunggah"),
    gambar6: string().required("Gambar 6 harus diunggah"),
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  const handleFileChange = async (ref, key) => {
    const file = ref.current.files[0];
    if (!file) return;

    const fileName = file.name;
    const fileSize = file.size;
    const fileExt = fileName.split(".").pop().toLowerCase();
    let error = "";

    if (fileSize / 1024576 > 10) error = "Berkas terlalu besar";
    else if (!["jpg", "png"].includes(fileExt))
      error = "Format berkas tidak valid";

    if (error) {
      ref.current.value = "";
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: error,
      }));
      return;
    }

    const uploadResult = await UploadFile(ref.current);
    if (uploadResult) {
      formDataRef.current[key] = uploadResult.Hasil;
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: "",
      }));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError({ error: false, message: "" });
      setErrors({});

      try {
        const data = await UseFetch(
          API_LINK + "MasterPuzzle/CreatePuzzle",
          formDataRef.current
        );

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal menyimpan data Puzzle.");
        } else {
          SweetAlert("Sukses", "Data Puzzle berhasil disimpan", "success");
          onChangePage("index");
        }
      } catch (error) {
        setIsError({ error: true, message: error.message });
      } finally {
        setIsLoading(false);
      }
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
            Tambah Data PUzzle Baru
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-12">
                <Input
                  type="text"
                  forInput="judul"
                  label="Judul"
                  isRequired
                  value={formDataRef.current.judul}
                  onChange={handleInputChange}
                  errorMessage={errors.judul}
                />
              </div>
              <div className="col-lg-6">
                <FileUpload
                  forInput="gambarBenar"
                  label="Gambar benar (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambarBenarRef}
                  onChange={() => handleFileChange(fileGambarBenarRef, "gambarBenar")}
                  errorMessage={errors.gambarbenar}
                />
              </div>
              <div className="col-lg-6">
                <FileUpload
                  forInput="gambar1"
                  label="Gambar 1 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar1Ref}
                  onChange={() => handleFileChange(fileGambar1Ref, "gambar1")}
                  errorMessage={errors.gambar1}
                />
              </div>
              <div className="col-lg-6">
                <FileUpload
                  forInput="gambar2"
                  label="Gambar 2 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar2Ref}
                  onChange={() => handleFileChange(fileGambar2Ref, "gambar2")}
                  errorMessage={errors.gambar2}
                />
              </div>
              <div className="col-lg-6">
                <FileUpload
                  forInput="gambar3"
                  label="Gambar 3 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar3Ref}
                  onChange={() => handleFileChange(fileGambar3Ref, "gambar3")}
                  errorMessage={errors.gambar3}
                />
              </div>
              <div className="col-lg-6">
                <FileUpload
                  forInput="gambar4"
                  label="Gambar 4 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar4Ref}
                  onChange={() => handleFileChange(fileGambar4Ref, "gambar4")}
                  errorMessage={errors.gambar4}
                />
              </div>
              <div className="col-lg-6">
                <FileUpload
                  forInput="gambar5"
                  label="Gambar 5 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar5Ref}
                  onChange={() => handleFileChange(fileGambar5Ref, "gambar5")}
                  errorMessage={errors.gambar5}
                />
              </div>
              <div className="col-lg-6">
                <FileUpload
                  forInput="gambar6"
                  label="Gambar 6 (.jpg, .png)"
                  formatFile=".jpg,.png"
                  ref={fileGambar6Ref}
                  onChange={() => handleFileChange(fileGambar6Ref, "gambar6")}
                  errorMessage={errors.gambar6}
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