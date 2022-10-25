import { render, screen } from "@testing-library/react"; // test-utils den değil de buradan çağırmamızın sebebi: zaten App.js yi render edeceği ve provider ın zaten onun için olması. Bu yüzden provider ile sarmalamaya gerek yok
import userEvent from "@testing-library/user-event/";
import App from "../App";

//! baştan sona uygulamanın çalışmasını test ediyor
test("order phases for happy path", async () => {
  const user = userEvent.setup();
  //render app
  render(<App />);

  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2");

  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "1");

  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await user.click(cherriesCheckbox);

  //! find and click order button
  const orderButton = screen.getByRole("button", { name: "Order Sundae!" });
  await user.click(orderButton);

  //! check summary information based on order
  const scoopSubtotal = screen.getByText("Scoops :", { exact: false });
  expect(scoopSubtotal).toHaveTextContent("6.00");

  const toppingSubtotal = screen.getByText("Toppings :", { exact: false });
  expect(toppingSubtotal).toHaveTextContent("1.50");

  const grandTotal = screen.getByText("Total :", { exact: false });
  expect(grandTotal).toHaveTextContent("7.50");

  //! Yukarısının alternatifi

  /*     const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
    expect(summaryHeading).toBeInTheDocument();
  
    const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });
    expect(scoopsHeading).toBeInTheDocument();
  
    const toppingsHeading = screen.getByRole("heading", {
      name: "Toppings: $1.50",
    });
    expect(toppingsHeading).toBeInTheDocument(); */

  //! check summary option items
  //   expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  //   expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  //   expect(screen.getByText("Cherries")).toBeInTheDocument();

  //! accept term and conditions and click button to confirm order

  const agreeCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  await user.click(agreeCheckbox);

  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  await user.click(confirmButton);

  //! Expect "loading" button

  const loading = screen.getByText(/loading/i)
  expect(loading).toBeInTheDocument()

  //! check confirmation page text
  // this one is async because there is a POST request to server in between summary and confirmation pages
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  //! expect "loading" has disappeared

  const notLoading = screen.queryByText("loading")
  expect(notLoading).not.toBeInTheDocument()

  //! click "new order" button on confirmation page
  const newOrderButton = screen.getByRole("button", {
    name: /create new order/i,
  });
  await user.click(newOrderButton);

  //! check that scoops and toppings subtotals have been reset
  const initialScoopSubtotal = screen.getByText("Scoops total:", {
    exact: false,
  });
  expect(initialScoopSubtotal).toHaveTextContent("0.00");

  const initialToppingSubtotal = screen.getByText("Toppings total:", {
    exact: false,
  });
  expect(initialToppingSubtotal).toHaveTextContent("0.00");

  //* yukarının alternatifi
/*   const scoopsTotal = await screen.findByText("Scoops total: $0.00");
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = screen.getByText("Toppings total: $0.00");
  expect(toppingsTotal).toBeInTheDocument(); */

});





