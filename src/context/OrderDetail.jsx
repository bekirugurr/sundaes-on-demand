import { createContext, useContext, useState } from "react";
import { pricePerItem } from "../constants";

const OrderDetails = createContext();

// Custom hook. It is check whether we're in a provider.If it's not throw an error, if we are in provider it'll return context value
export const useOrderDetails = () => {
  const contextValue = useContext(OrderDetails);
  if (!contextValue) {
    throw new Error(
      "userOrderDetails must be called from within an OrderDetailsProvider"
    );
  }
  return contextValue;
};

export const OrderDetailProvider = (props) => {
  const [optionCounts, setOptionCounts] = useState({
    scoops: {}, // exp: {Chocolate: 1, Vanilla: 2}
    toppings: {}, // exp: {Gummi Bears: 1}
  });

  //! Yeni ürün seçildiğinde veya sayısı değiştirildiğinde hangisinden kaç tane sipariş verildiğini güncelleme
  const updateItemCount = (itemName, newItemCount, optionType) => { 
    // make a copy of existing state
    const newOptionCounts = {...optionCounts}
    // updat the copy with the new information 
    newOptionCounts[optionType][itemName] = newItemCount
    // set the state with the updated copy
    setOptionCounts(newOptionCounts)
   }

   //! Birisi sipariş vereceğinde önceki order ın kayıtları silmemiz gerekiyor
   const resetOrder = () => {
    setOptionCounts({scoops:{}, toppings:{}}) 
   }
   
   //! Toplam fiyatı öğrenme 
   // utility function to derive totals from optionCounts state value
   const calculateTotal = (optionType) => {
    // get an array of counts for the option type (for example, [1, 2])
    const countsArray = Object.values(optionCounts[optionType])

    // total the values in the array of counts
    const totalCount = countsArray.reduce((total, value)=> total + value, 0)

    // multiply the total number of items by the price for this item type 
    return totalCount * pricePerItem[optionType]
   }

   const totals = {
    scoops: calculateTotal("scoops"),
    toppings: calculateTotal("toppings"),
   }
   

  const value = { optionCounts, totals, updateItemCount, resetOrder };
  return <OrderDetails.Provider value={value} {...props} />;
};
