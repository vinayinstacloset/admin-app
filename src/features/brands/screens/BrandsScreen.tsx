import "../styles/brands.css";
import { useEffect, useState } from "react";
import { ImagePlus, Pencil, Trash2, Upload, X } from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { brandsApi } from "../api";
import { useBrands } from "../hooks";
import { isValidBrandName } from "../utils/brands.utils";
import type { Brand } from "../data/mockData";

type Modal = "add" | "edit" | "delete" | null;

export default function BrandsScreen() {
  const { setPageAction } = useDashboardOutletContext();
  const { brands, setBrands, isLoading } = useBrands();
  const [modal, setModal] = useState<Modal>(null);
  const [selected, setSelected] = useState<Brand | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const openAdd = () => {
    setSelected(null);
    setName("");
    setImage("");
    setError("");
    setModal("add");
  };
  const openEdit = (brand: Brand) => {
    setSelected(brand);
    setName(brand.name);
    setImage(brand.image);
    setError("");
    setModal("edit");
  };
  const close = () => setModal(null);

  const save = async () => {
    if (!isValidBrandName(name)) {
      setError("Brand name is required");
      return;
    }
    if (!image) {
      setError("Brand image is required");
      return;
    }
    const value: Brand = {
      id: selected?.id ?? String(Date.now()),
      name: name.trim(),
      image,
    };
    if (selected) {
      const updated = await brandsApi.update(value);
      setBrands(
        brands.map((item) => (item.id === updated.id ? updated : item)),
      );
    } else {
      const created = await brandsApi.create(value);
      setBrands([...brands, created]);
    }
    close();
  };

  const remove = async () => {
    if (!selected) return;
    await brandsApi.remove(selected.id);
    setBrands(brands.filter((item) => item.id !== selected.id));
    close();
  };

  useEffect(() => {
    setPageAction(
      <button className="brand-add-btn" onClick={openAdd}>
        Add Brand +
      </button>,
    );
    return () => setPageAction(null);
  }, [setPageAction]);

  return (
    <div className="brands-page">
      <h1>Brands</h1>
      <h2>Brand - 6</h2>
      <div className="brand-grid">
        {isLoading ? (
          <div className="brand-loading">Loading brands…</div>
        ) : (
          brands.map((brand) => (
            <article key={brand.id} className="brand-card">
              <button
                className="brand-edit"
                aria-label={`Edit ${brand.name}`}
                onClick={() => openEdit(brand)}
              >
                <Pencil size={14} />
              </button>
              <button
                className="brand-card-click"
                type="button"
                onClick={() => openEdit(brand)}
                aria-label={`Open ${brand.name}`}
              >
                <div className="brand-image-wrap">
                  <img src={brand.image} alt={brand.name} />
                </div>
                <div className="brand-name">{brand.name}</div>
              </button>
            </article>
          ))
        )}
      </div>

      {(modal === "add" || modal === "edit") && (
        <BrandModal
          mode={modal}
          name={name}
          setName={setName}
          image={image}
          setImage={setImage}
          error={error}
          onClose={close}
          onSave={save}
          onDelete={modal === "edit" ? () => setModal("delete") : undefined}
        />
      )}
      {modal === "delete" && selected && (
        <DeleteModal
          brand={selected}
          onClose={() => setModal("edit")}
          onDelete={remove}
        />
      )}
    </div>
  );
}

function BrandModal({
  mode,
  name,
  setName,
  image,
  setImage,
  error,
  onClose,
  onSave,
  onDelete,
}: {
  mode: "add" | "edit";
  name: string;
  setName: (value: string) => void;
  image: string;
  setImage: (value: string) => void;
  error: string;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
}) {
  const selectImage = (file?: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return;
    setImage(URL.createObjectURL(file));
  };
  return (
    <div className="brand-modal-backdrop" onMouseDown={onClose}>
      <div
        className="brand-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="brand-modal-title">
          <b>{mode === "add" ? "Add brand" : "Edit brand"}</b>
          <div className="brand-modal-title-actions">
            {mode === "edit" && (
              <button
                className="brand-modal-delete"
                onClick={onDelete}
                aria-label="Delete brand"
              >
                <Trash2 size={17} />
              </button>
            )}
            <button onClick={onClose} aria-label="Close">
              <X size={21} />
            </button>
          </div>
        </div>
        <div className="brand-divider" />
        <label className="brand-upload-area">
          {image ? (
            <div className="brand-upload-preview">
              <img src={image} alt="Brand preview" />
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setImage("");
                }}
              >
                <X size={11} />
              </button>
            </div>
          ) : (
            <>
              <span className="brand-upload-button">
                <Upload size={17} /> Upload image
              </span>
            </>
          )}
          <span className="brand-upload-ratio">
            Image ratio: (Width: 90 px)
          </span>
          <small>Only PNG, JPG and SVG formats are supported (Max. 2MB)</small>
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={(event) => selectImage(event.target.files?.[0])}
          />
        </label>
        <label className="brand-input">
          <span>Brand name</span>
          <div className="brand-input-wrap">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter brand name"
            />
            {name && (
              <button type="button" onClick={() => setName("")}>
                <X size={13} />
              </button>
            )}
          </div>
        </label>
        {error && <p className="brand-error">{error}</p>}
        <div
          className={`brand-modal-actions ${mode === "add" ? "single" : ""}`}
        >
          {mode === "edit" && (
            <button className="brand-cancel-btn" onClick={onClose}>
              Cancel
            </button>
          )}
          <button
            className="brand-save-btn"
            disabled={!name.trim() || !image}
            onClick={onSave}
          >
            {mode === "add" ? "Save" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({
  brand,
  onClose,
  onDelete,
}: {
  brand: Brand;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="brand-modal-backdrop" onMouseDown={onClose}>
      <div
        className="brand-delete-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p>Are you sure you want to delete “{brand.name}”?</p>
        <div>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
