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
    gambar1: "",
    gambar2: "",
    jawaban1: "",
    jawaban2: "",
    jawaban3: "",
    jawaban4: "",
  });

  const fileGambar1Ref = useRef(null);
  const fileGambar2Ref = useRef(null);

  const userSchema = object({
    judul: string().max(100, "Maksimum 100 karakter").required("Harus diisi"),
    gambar1: string().required("Gambar 1 harus diunggah"),
    gambar2: string().required("Gambar 2 harus diunggah"),
    jawaban1: string().max(50, "Maksimum 50 karakter").required("Harus diisi"),
    jawaban2: string().max(50, "Maksimum 50 karakter").required("Harus diisi"),
    jawaban3: string().max(50, "Maksimum 50 karakter").required("Harus diisi"),
    jawaban4: string().max(50, "Maksimum 50 karakter").required("Harus diisi"),
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
          API_LINK + "MasterTebakGambar/CreateTebakGambar",
          formDataRef.current
        );

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal menyimpan data Tebak Gambar.");
        } else {
          SweetAlert("Sukses", "Data Tebak Gambar berhasil disimpan", "success");
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
            Tambah Data Tebak Gambar Baru
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
                <Input
                  type="text"
                  forInput="jawaban1"
                  label="Jawaban 1"
                  isRequired
                  value={formDataRef.current.jawaban1}
                  onChange={handleInputChange}
                  errorMessage={errors.jawaban1}
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="jawaban2"
                  label="Jawaban 2"
                  isRequired
                  value={formDataRef.current.jawaban2}
                  onChange={handleInputChange}
                  errorMessage={errors.jawaban2}
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="jawaban3"
                  label="Jawaban 3"
                  isRequired
                  value={formDataRef.current.jawaban3}
                  onChange={handleInputChange}
                  errorMessage={errors.jawaban3}
                />
              </div>
              <div className="col-lg-6">
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