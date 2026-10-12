import { useParams } from "react-router-dom";
import ExchangeDetailsScreen from "./ExchangeDetailsScreen";
import ExchangeListScreen from "../components/ExchangeListScreen";
import ExchangeStoreScreen from "../components/ExchangeStoreScreen";

export default function ExchangeScreen() {
  const { storeId, exchangeId } = useParams<{
    storeId?: string;
    exchangeId?: string;
  }>();
  if (exchangeId) return <ExchangeDetailsScreen />;
  if (storeId) return <ExchangeStoreScreen />;
  return <ExchangeListScreen />;
}
