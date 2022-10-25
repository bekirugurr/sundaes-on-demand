// import { render, screen } from "@testing-library/react";
import { render, screen } from "../../../test-utils/testing-library-utils";
import  userEvent  from "@testing-library/user-event/";
// import { OrderDetailProvider } from "../../../context/OrderDetail";
import Options from '../Options'
import OrderEntry from '../OrderEntry'

test('update scoop subtotal when scoop change', async () => { 
    const user = userEvent.setup()
    // render(<Options optionType='scoops'/>, {wrapper: OrderDetailProvider})
    render(<Options optionType='scoops'/>)

    // make sure totel starts out $0.00
    const scoopsSubtotal = screen.getByText("Scoops total: $", {exact: false})
    expect(scoopsSubtotal).toHaveTextContent('0.00')

    // update vanilla scoops to 1 and check the subtotal
    const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'})
    await user.clear(vanillaInput)//! clear ile silmemizin nedeni: o inputta ne olduğunu bilmiyoruz. O yüzden baştan bi siliyoruz
    await user.type(vanillaInput, "1")//! clear() ile sildiğimiz input içeriğine şimdi type() ile isteğimizi yazıyoruz ki test edebilelim. Yazılan string olmak zorunda 
    expect(scoopsSubtotal).toHaveTextContent('2.00')

    // update chocolate scoop to 2 and check the subtotal
    const chocolateInput = await screen.findByRole('spinbutton', {name: 'Chocolate'})
    await user.clear(chocolateInput)
    await user.type(chocolateInput, '2')
    expect(scoopsSubtotal).toHaveTextContent('6.00')
 })

 test('update topping subtotal when topping change', async () => { 
    const user = userEvent.setup()
    // render(<Options optionType='toppings'/>, {wrapper: OrderDetailProvider})
    render(<Options optionType='toppings'/>)

    // make sure totel starts out $0.00
    const toppingSubtotal = screen.getByText("Toppings total: $", {exact: false})
    expect(toppingSubtotal).toHaveTextContent('0.00')

    // add cherries and check the topping subtotal
    let cherriesCheckBox = await screen.findByRole("checkbox", {name : 'Cherries'})
    await user.click(cherriesCheckBox)
    expect(toppingSubtotal).toHaveTextContent('1.50')

    // add M&Ms and check the topping subtotal
    let mmsCheckBox = await screen.findByRole("checkbox", {name : 'M&Ms'})
    await user.click(mmsCheckBox)
    expect(toppingSubtotal).toHaveTextContent('3.00')

    // remove cherries and check the topping subtotal
    await user.click(cherriesCheckBox)
    expect(toppingSubtotal).toHaveTextContent('1.50')
  })

  describe("grand total", () => {
    test("grand total updates properly if scoop is added first", async () => {
      const user = userEvent.setup();
  
      // Test that the total starts out at $0.00
      render(<OrderEntry />);
      const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
      expect(grandTotal).toHaveTextContent("0.00");
  
      // update vanilla scoops to 2 and check grand total
      const vanillaInput = await screen.findByRole("spinbutton", {
        name: "Vanilla",
      });
      await user.clear(vanillaInput);
      await user.type(vanillaInput, "2");
      expect(grandTotal).toHaveTextContent("4.00");
  
      // add cherries and check grand total
      const cherriesCheckbox = await screen.findByRole("checkbox", {
        name: "Cherries",
      });
      await user.click(cherriesCheckbox);
      expect(grandTotal).toHaveTextContent("5.50");
    });
  
    test("grand total updates properly if topping is added first", async () => {
      const user = userEvent.setup();
      render(<OrderEntry />);
      const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
  
      // add cherries and check grand total
      const cherriesCheckbox = await screen.findByRole("checkbox", {
        name: "Cherries",
      });
      await user.click(cherriesCheckbox);
      expect(grandTotal).toHaveTextContent("1.50");
  
      // update vanilla scoops to 2 and check grand total
      const vanillaInput = await screen.findByRole("spinbutton", {
        name: "Vanilla",
      });
      await user.clear(vanillaInput);
      await user.type(vanillaInput, "2");
      expect(grandTotal).toHaveTextContent("5.50");
    });
  
    test("grand total updates properly if item is removed", async () => {
      const user = userEvent.setup();
      render(<OrderEntry />);
  
      // add cherries
      const cherriesCheckbox = await screen.findByRole("checkbox", {
        name: "Cherries",
      });
      await user.click(cherriesCheckbox);
      // grand total $1.50
  
      // update vanilla scoops to 2; grand total should be $5.50
      const vanillaInput = await screen.findByRole("spinbutton", {
        name: "Vanilla",
      });
      await user.clear(vanillaInput);
      await user.type(vanillaInput, "2");
  
      // remove 1 scoop of vanilla and check grand total
      await user.clear(vanillaInput);
      await user.type(vanillaInput, "1");
  
      // check grand total
      const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
      expect(grandTotal).toHaveTextContent("3.50");
  
      // remove cherries and check grand total
      await user.click(cherriesCheckbox);
      expect(grandTotal).toHaveTextContent("2.00");
    });
  });
 