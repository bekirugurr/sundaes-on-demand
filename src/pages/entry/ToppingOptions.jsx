// import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useOrderDetails } from "../../context/OrderDetail";


//updateItemCount = (itemName, newItemCount, optionType)
const ToppingOptions = ({name, imagePath}) => {
  // const [isChecked, setIsChecked] = useState(false)
  const {updateItemCount} = useOrderDetails();

  const handleChange = (e) => {
    updateItemCount(name, e.target.checked ? 1 : 0, 'toppings')
  }

// useEffect(() => {
//   if (isChecked) {
//     updateItemCount(name, 1, 'toppings')
//   }else{
//     updateItemCount(name, 0, 'toppings')
//   }
// }, [isChecked, name, updateItemCount])

  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: "center" }}>
      <img
        style={{ width: "75%" }}
        src={`http://localhost:3030/${imagePath}`}
        alt={`${name} topping`}
      />
      <Form.Group controlId={`${name}-topping-checkbox`}>
        <Form.Check type='checkbox' onChange={handleChange} label={name}/>
      </Form.Group>
      {/* <input type="checkbox" name={name} id={name} checked={isChecked} onChange={()=>setIsChecked(!isChecked)}/>
      <label htmlFor={name}>{name}</label> */}
    </Col>
    )
}

export default ToppingOptions

