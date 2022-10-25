import React, { useEffect, useState } from 'react'
import axios  from 'axios'
import ScoopOptions from './ScoopOptions'
import ToppingOptions from './ToppingOptions';
import AlertBanner from '../common/AlertBanner';
import Row from "react-bootstrap/Row";
import { pricePerItem } from '../../constants';
import { formatCurrency } from '../../utilities'
import { useOrderDetails } from '../../context/OrderDetail';


const Options = ({optionType}) => {
    const [items, setItems] = useState([])
    const [error, setError] = useState(false)
    const {totals} = useOrderDetails()  

    // optionType is 'scoops' or 'toppings'
    useEffect(() => {
        axios.get(`http://localhost:3030/${optionType}`)
        .then((response) => {
            setItems(response.data)
        }).catch((error) => {
            setError(true)
        });
      
    }, [optionType])

    if(error){
        return <AlertBanner />
    }

    const ItemComponent = optionType === 'scoops' ? ScoopOptions : ToppingOptions 
    const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase()

    const optionItems = items.map((item)=> <ItemComponent key={item.name} name={item.name} imagePath={item.imagePath} />)

    return (
    <>
        <h2>{title}</h2>
        <p>{formatCurrency(pricePerItem[optionType])} each </p>
        <p>{title} total: {formatCurrency(totals[optionType])} each </p>
        <Row>{optionItems}</Row>
    </>);

}

export default Options