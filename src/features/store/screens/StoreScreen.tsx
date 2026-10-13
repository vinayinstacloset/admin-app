import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import type { DashboardOutletContext } from "../../../layouts/DashboardLayout";
import SkusScreen from "../../skus/screens/SkusScreen";
import { storeApi } from "../api";
import type { StoreItem, StoreView } from "../types/store.types";
import {
  buildListingBreadcrumbs,
  STORE_CRUMB_LABEL,
} from "../../catalogue/utils/listingBreadcrumbs";
import {
  OrdersHeaderActions,
  OrdersView,
  ReviewsView,
  StoreDetailsView,
  StoreHeaderActions,
  StoreListView,
} from "../components";

async function exportStoreDetails() {
  const [details, products, sales] = await Promise.all([
    storeApi.getDetails(),
    storeApi.getProducts(),
    storeApi.getSales(),
  ]);

  const rows = [
    ["Field", "Value"],
    ["Store", details.name],
    ["Brand", details.brand],
    ["City", details.city],
    ["State", details.state],
    ["Address", details.address],
    ["Hours", details.hours],
    ["Status", details.status],
    ["Email", details.email],
    ["Phone", details.phone],
    ["Revenue", details.totalRevenue],
    ["Orders", details.totalOrders],
    ["SKUs", details.totalSkus],
    ["Fulfilment Rate", `${details.fulfilmentRate}%`],
    ["Rating", details.rating],
    ["Ratings Count", details.ratingsCount],
    ["Products", products.length],
    ["Sales Points", sales.length],
  ];
  downloadCsv("store-details.csv", rows);
}

async function exportStoreOrders() {
  const orders = await storeApi.getOrders();
  const rows = [
    [
      "Order",
      "Items",
      "Customer",
      "Location",
      "Rider",
      "Item",
      "Item Count",
      "Status",
      "Amount",
      "Age",
      "Action",
    ],
    ...orders.map((order) => [
      order.id,
      order.items,
      order.customer,
      order.customerLocation,
      order.rider,
      order.itemSummary,
      order.itemCounts,
      order.status,
      order.amount,
      order.age,
      order.action,
    ]),
  ];
  downloadCsv("orders.csv", rows);
}

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function StoreScreen() {
  const { setExtraCrumbs, setPageAction } =
    useOutletContext<DashboardOutletContext>();
  const {
    storeId = "store-1",
    gender,
    categoryId,
  } = useParams<{ storeId?: string; gender?: string; categoryId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  const basePath = `/admin-dashboard/store/${storeId}`;
  const path = location.pathname.replace(/\/$/, "");
  const isList = path === "/admin-dashboard/store";
  const view: StoreView = isList
    ? "list"
    : path.endsWith("/orders")
      ? "orders"
      : path.includes("/skus")
        ? "skus"
        : path.endsWith("/reviews")
          ? "reviews"
          : "details";

  useEffect(() => {
    if (view !== "skus") return;
    setExtraCrumbs(
      categoryId
        ? buildListingBreadcrumbs({
            context: "store",
            ownerId: storeId,
            gender,
            categoryId,
          })
        : [
            { label: "Store", to: "/admin-dashboard/store" },
            { label: STORE_CRUMB_LABEL, to: basePath },
            { label: "SKUS", to: `${basePath}/skus` },
          ],
    );
  }, [basePath, categoryId, gender, setExtraCrumbs, storeId, view]);

  useEffect(() => {
    if (view === "list") {
      setExtraCrumbs([{ label: "Store" }]);
      setPageAction(<StoreHeaderActions />);
    } else if (view === "details") {
      setExtraCrumbs([
        { label: "Store", to: "/admin-dashboard/store" },
        { label: "Nike – Bandra details" },
      ]);
      setPageAction(
        <StoreHeaderActions
          showStoreControls
          showMail
          onExport={exportStoreDetails}
          isOpen={isStoreOpen}
          onToggle={() => setIsStoreOpen((current) => !current)}
        />,
      );
    } else if (view === "orders") {
      setExtraCrumbs([
        { label: "Store", to: "/admin-dashboard/store" },
        { label: "Nike – Bandra details", to: basePath },
        { label: "Orders" },
      ]);
      setPageAction(
        <OrdersHeaderActions
          isOpen={isStoreOpen}
          onToggle={() => setIsStoreOpen((current) => !current)}
          onExport={exportStoreOrders}
        />,
      );
    } else if (view === "skus") {
      setPageAction(
        <StoreHeaderActions
          showStoreControls
          isOpen={isStoreOpen}
          onToggle={() => setIsStoreOpen((current) => !current)}
        />,
      );
    } else {
      setExtraCrumbs([
        { label: "Store", to: "/admin-dashboard/store" },
        { label: "Nike – Bandra details", to: basePath },
        { label: "Customer reviews" },
      ]);
      setPageAction(
        <StoreHeaderActions
          showStoreControls
          showMail
          isOpen={isStoreOpen}
          onToggle={() => setIsStoreOpen((current) => !current)}
        />,
      );
    }

    return () => {
      setPageAction(null);
    };
  }, [basePath, isStoreOpen, setExtraCrumbs, setPageAction, view]);

  const openDetails = (store: StoreItem) => {
    navigate(`/admin-dashboard/store/${store.id}`);
  };

  return (
    <div className="pb-8">
      {view === "list" && <StoreListView onDetails={openDetails} />}
      {view === "details" && (
        <StoreDetailsView
          onOrders={() => navigate(`${basePath}/orders`)}
          onReviews={() => navigate(`${basePath}/reviews`)}
          onSkus={() => navigate(`${basePath}/skus`)}
        />
      )}
      {view === "orders" && (
        <OrdersView
          source={{
            label: "Orders",
            to: `${basePath}/orders`,
            parentLabel: "Nike – Bandra details",
            parentTo: basePath,
            rootLabel: "Store",
            rootTo: "/admin-dashboard/store",
          }}
        />
      )}
      {view === "reviews" && <ReviewsView />}
      {view === "skus" && <SkusScreen />}
    </div>
  );
}
