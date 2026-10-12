import { useEffect, useState } from "react";
import { ImagePlus, Pencil, Trash2, Upload, X } from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { brandsApi } from "../api";
import { useBrands } from "../hooks";
import { isValidBrandName } from "../utils/brands.utils";
import type { Brand } from "../data/mockData";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle, focusStyle } from "../../../shared/utils/interactiveStyle";

type Modal = "add" | "edit" | "delete" | null;

export default function BrandsScreen() {
  const isMax1100 = useMediaQuery("(max-width: 1100px)");
  const isMax700 = useMediaQuery("(max-width: 700px)");
  const { setPageAction } = useDashboardOutletContext();
  const { brands, setBrands, isLoading } = useBrands();
  const [modal, setModal] = useState<Modal>(null);
  const [hoveredBrandId, setHoveredBrandId] = useState<string | number | null>(
    null,
  );
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
      <button
        style={{
          height: 31,
          padding: "0 16px",
          border: 0,
          borderRadius: 4,
          background: "#795033",
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
        }}
        onClick={openAdd}
      >
        Add Brand +
      </button>,
    );
    return () => setPageAction(null);
  }, [setPageAction]);

  return (
    <div style={{ color: "#2d2925" }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>
        Brand - 6
      </h2>
      <div
        style={{
          ...{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 17,
          },
          ...(isMax1100 ? { gridTemplateColumns: "repeat(3, 1fr)" } : {}),
          ...(isMax700 ? { gridTemplateColumns: "repeat(2, 1fr)" } : {}),
        }}
      >
        {isLoading ? (
          <div
            style={{
              gridColumn: "1/-1",
              padding: 40,
              textAlign: "center",
              color: "#888",
              background: "#fff",
              borderRadius: 12,
            }}
          >
            Loading brands…
          </div>
        ) : (
          brands.map((brand) => (
            <article
              key={brand.id}
              style={{
                position: "relative",
                background: "#fff",
                borderRadius: 13,
                overflow: "hidden",
              }}
              onMouseEnter={() => setHoveredBrandId(brand.id)}
              onMouseLeave={() => setHoveredBrandId(null)}
            >
              <button
                style={{
                  position: "absolute",
                  right: 13,
                  top: 11,
                  width: 24,
                  height: 24,
                  border: 0,
                  background: "transparent",
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  opacity: hoveredBrandId === brand.id ? 1 : 0,
                  zIndex: 2,
                  cursor: "pointer",
                }}
                aria-label={`Edit ${brand.name}`}
                onClick={() => openEdit(brand)}
              >
                <Pencil size={14} />
              </button>
              <button
                style={{
                  display: "block",
                  width: "100%",
                  border: 0,
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                }}
                type="button"
                onClick={() => openEdit(brand)}
                aria-label={`Open ${brand.name}`}
              >
                <div
                  style={{
                    height: 130,
                    margin: "5px 5px 0",
                    borderRadius: 9,
                    overflow: "hidden",
                    background: "#c58a5b",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={brand.image}
                    alt={brand.name}
                  />
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px 8px 14px",
                    fontSize: 14,
                    color: "#292522",
                  }}
                >
                  {brand.name}
                </div>
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
  const isMax700 = useMediaQuery("(max-width: 700px)");
  const selectImage = (file?: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return;
    setImage(URL.createObjectURL(file));
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(40, 35, 30, 0.28)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          ...{
            width: 405,
            background: "#fff",
            borderRadius: 15,
            padding: "17px 20px 20px",
            boxShadow: "0 15px 50px rgba(0, 0, 0, 0.12)",
          },
          ...(isMax700 ? { width: "min(405px, calc(100vw - 30px))" } : {}),
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          style={{
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 14,
          }}
        >
          <b>{mode === "add" ? "Add brand" : "Edit brand"}</b>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            {mode === "edit" && (
              <button
                style={{
                  border: 0,
                  display: "grid",
                  placeItems: "center",
                  padding: 3,
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  background: "#fff3f3",
                  color: "#ff6a6a",
                }}
                onClick={onDelete}
                aria-label="Delete brand"
              >
                <Trash2 size={17} />
              </button>
            )}
            <button
              style={{
                border: 0,
                background: "transparent",
                color: "#777",
                display: "grid",
                placeItems: "center",
                padding: 3,
                cursor: "pointer",
              }}
              onClick={onClose}
              aria-label="Close"
            >
              <X size={21} />
            </button>
          </div>
        </div>
        <div
          style={{ height: 1, background: "#ddd7d2", margin: "7px 0 20px" }}
        />
        <label
          style={{
            height: 150,
            border: "1px dashed #987b65",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 4,
            position: "relative",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {image ? (
            <div
              style={{
                position: "relative",
                height: 75,
                width: 115,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
                src={image}
                alt="Brand preview"
              />
              <button
                style={{
                  position: "absolute",
                  right: -7,
                  top: -6,
                  border: 0,
                  background: "#eee",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  display: "grid",
                  placeItems: "center",
                  color: "#888",
                  cursor: "pointer",
                }}
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
              <span
                style={{
                  height: 52,
                  minWidth: 92,
                  padding: "0 13px",
                  borderRadius: 4,
                  background: "#c98c5d",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  fontSize: 9,
                }}
              >
                <Upload size={17} /> Upload image
              </span>
            </>
          )}
          <span style={{ fontSize: 8, color: "#555", marginTop: 3 }}>
            Image ratio: (Width: 90 px)
          </span>
          <small style={{ fontSize: 6, color: "#777" }}>
            Only PNG, JPG and SVG formats are supported (Max. 2MB)
          </small>
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={(event) => selectImage(event.target.files?.[0])}
          />
        </label>
        <label style={{ display: "block", marginTop: 19 }}>
          <span
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 600,
              color: "#655d58",
              marginBottom: 8,
            }}
          >
            Brand name
          </span>
          <div
            style={{
              height: 36,
              border: "1px solid #aaa29c",
              display: "flex",
              alignItems: "center",
            }}
            {...focusStyle({ borderColor: "#795033" }, { borderColor: "" })}
          >
            <input
              style={{
                height: "100%",
                flex: 1,
                border: 0,
                outline: 0,
                padding: "0 12px",
                fontSize: 10,
                color: "#333",
              }}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter brand name"
            />
            {name && (
              <button
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#bbb",
                  padding: "0 9px",
                  display: "grid",
                  placeItems: "center",
                }}
                type="button"
                onClick={() => setName("")}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </label>
        {error && (
          <p style={{ fontSize: 9, color: "#e55757", margin: "6px 0 0" }}>
            {error}
          </p>
        )}
        <div
          style={{
            ...{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
              marginTop: 23,
            },
            ...(mode === "add" ? { gridTemplateColumns: "1fr" } : {}),
          }}
        >
          {mode === "edit" && (
            <button
              style={{
                height: 35,
                borderRadius: 5,
                fontSize: 10,
                fontWeight: 700,
                background: "#fff",
                border: "1px solid #5c514a",
                color: "#5c514a",
              }}
              onClick={onClose}
            >
              Cancel
            </button>
          )}
          <button
            style={{
              ...{
                height: 35,
                borderRadius: 5,
                fontSize: 10,
                fontWeight: 700,
                border: "1px solid #795033",
                background: "#795033",
                color: "#fff",
              },
              ...(!name.trim() || !image
                ? {
                    background: "#d9d9d9",
                    borderColor: "#d9d9d9",
                    color: "#fff",
                  }
                : {}),
            }}
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(40, 35, 30, 0.28)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseDown={onClose}
    >
      <div
        style={{ width: 360, background: "#fff", borderRadius: 9, padding: 24 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p style={{ textAlign: "center", fontSize: 11, margin: "0 0 20px" }}>
          Are you sure you want to delete “{brand.name}”?
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 9 }}>
          <button
            style={{
              width: 95,
              height: 31,
              borderRadius: 4,
              border: "1px solid #aaa",
              background: "#fff",
              fontSize: 10,
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            style={{
              width: 95,
              height: 31,
              borderRadius: 4,
              border: "1px solid #f56d6d",
              fontSize: 10,
              background: "#f56d6d",
              color: "#fff",
            }}
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
