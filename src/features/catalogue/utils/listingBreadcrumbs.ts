import type { Breadcrumb } from "../../../shared/components/layout/Topbar";
import { skuApi } from "../../skus/api/skuApi";
import { catalogueApi } from "../api";

/**
 * Where the product listing (gender > category) was opened from.
 * The breadcrumb always starts from that place so the trail stays clear:
 *
 *   store      Store > <store name> > SKUS > Men > Topwear
 *   vendor     Vendor > <vendor name> > SKUS > Men > Topwear
 *   catalogue  Catalogue > <catalogue name> > Men > Topwear
 *
 * Kids / Teens / GenZ also show the sub navigation:
 *
 *   ... > Teens > Boys > Topwear
 *   ... > Kids > Girls > Shoes
 */
export type ListingContext = "store" | "vendor" | "catalogue";

// Same labels that the store / vendor / catalogue pages already show.
export const STORE_CRUMB_LABEL = "Nike – Bandra details";
export const VENDOR_CRUMB_LABEL = "Rajesh Kumar details";
export const CATALOGUE_CRUMB_LABEL = "NIKE catalogue";

const GENDER_LABELS: Record<string, string> = {
  men: "Men",
  women: "Women",
  teens: "Teens",
  teen: "Teens",
  kids: "Kids",
  genz: "GenZ",
};

const SUB_NAVIGATION_LABELS: Record<string, string> = {
  boys: "Boys",
  girls: "Girls",
  unisex: "Unisex",
  infants: "Infants",
  addons: "Add-ons",
};

const SLUG_LABELS: Record<string, string> = {
  all: "All categories",
  lounge: "Loungewear",
  sports: "Sportswear",
  ethnic: "Ethnic Wear",
};

const titleCase = (value: string) =>
  value.replace(/\b\w/g, (letter) => letter.toUpperCase());

/** Finds the category name (Topwear, Shoes ...) for an id in the matching data source. */
function findCategoryName(context: ListingContext, categoryId: string) {
  const lists: Array<Array<{ id: string; name: string }>> = [];

  if (context === "catalogue") {
    for (const section of catalogueApi.listSections()) {
      if (section.categories) lists.push(section.categories);
      for (const tile of section.navigation ?? []) lists.push(tile.categories);
    }
  } else {
    for (const section of skuApi.getSections()) {
      if (section.categories) lists.push(section.categories);
      for (const tile of section.tiles ?? []) lists.push(tile.categories);
    }
  }

  for (const list of lists) {
    const match = list.find((item) => item.id === categoryId);
    if (match) return match.name;
  }

  // Fallback: build a readable name from the last part of the id.
  const slug = categoryId.toLowerCase().split("-").pop() ?? categoryId;
  return SLUG_LABELS[slug] ?? titleCase(slug);
}

interface ListingCrumbOptions {
  context: ListingContext;
  ownerId: string;
  gender?: string;
  categoryId?: string;
}

export function buildListingBreadcrumbs({
  context,
  ownerId,
  gender,
  categoryId,
}: ListingCrumbOptions): Breadcrumb[] {
  const genderKey = (gender ?? "men").toLowerCase();
  const genderLabel = GENDER_LABELS[genderKey] ?? titleCase(genderKey);
  const needsSubNavigation = ["kids", "teens", "teen", "genz"].includes(
    genderKey,
  );

  const trail: Breadcrumb[] = [];

  if (context === "store") {
    const storePath = `/admin-dashboard/store/${ownerId}`;
    trail.push(
      { label: "Store", to: "/admin-dashboard/store" },
      { label: STORE_CRUMB_LABEL, to: storePath },
      { label: "SKUS", to: `${storePath}/skus` },
    );
  } else if (context === "vendor") {
    const vendorPath = `/admin-dashboard/vendor/${ownerId}`;
    trail.push(
      { label: "Vendor", to: "/admin-dashboard/vendor" },
      { label: VENDOR_CRUMB_LABEL, to: vendorPath },
      { label: "SKUS", to: `${vendorPath}/skus` },
    );
  } else {
    trail.push(
      { label: "Catalogue", to: "/admin-dashboard/catalogue" },
      {
        label: CATALOGUE_CRUMB_LABEL,
        to: `/admin-dashboard/catalogue/store/${ownerId}`,
      },
    );
  }

  trail.push({ label: genderLabel });

  if (categoryId) {
    if (needsSubNavigation) {
      // ids look like kids-boys-shoes / teen-girls-topwear / genz-boys-1
      const subKey = categoryId.toLowerCase().split("-")[1];
      const subLabel = subKey ? SUB_NAVIGATION_LABELS[subKey] : undefined;
      if (subLabel) trail.push({ label: subLabel });
    }
    trail.push({ label: findCategoryName(context, categoryId) });
  }

  return trail;
}
