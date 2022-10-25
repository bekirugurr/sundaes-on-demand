import React from 'react'
import SummaryForm from "./SummaryForm";
import { formatCurrency } from '../../utilities'
import { useOrderDetails } from '../../context/OrderDetail'

const OrderSummary = ({setOrderPhase}) => {
    const {totals, optionCounts } = useOrderDetails();

const scoopArray = Object.entries(optionCounts.scoops) //[["Chocolate", 2],["Vanilla",1] ...]
const scoopList = scoopArray.map(([key, value]) => (
  <li key={key} >
    {value} {key}
  </li>
))

const toppingArray = Object.keys(optionCounts.toppings) // ['M&Ms', 'Gummi bear'...]
const toppingList = toppingArray.map((key) => (
  <li key={key} >
     {key}
  </li>
))

  return (
    <div>
        <h1>Order Summary</h1>
        <h2>Scoops : {formatCurrency(totals.scoops)}</h2>
        <ul>{scoopList}</ul>
        <h2>Toppings : {formatCurrency(totals.toppings)}</h2>
        <ul>{toppingList}</ul>
        <h2>Total : {formatCurrency(totals.scoops + totals.toppings)}</h2>
        <SummaryForm setOrderPhase={setOrderPhase} />
    </div>
  )
}

export default OrderSummary