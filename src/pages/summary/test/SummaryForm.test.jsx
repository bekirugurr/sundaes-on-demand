import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event"
import SummaryForm from "../SummaryForm";


test('initial conditions', () => { 
    render(<SummaryForm/>)
    let checkBox = screen.getByRole("checkbox", {name : /i agree to terms and conditions/i})
    let confirmButton = screen.getByRole("button", {name: /confirm order/i})

    expect(checkBox).not.toBeChecked()
    expect(confirmButton).toBeDisabled()
 })


test('checkbox disables button on first click and enables on second click', async () => { 
    const user = userEvent.setup()
    render(<SummaryForm/>)
    let checkBox = screen.getByRole("checkbox", {name : /terms and conditions/i})
    let confirmButton = screen.getByRole("button", {name: /confirm order/i})

    await user.click(checkBox)
    expect(confirmButton).toBeEnabled()

    await user.click(checkBox)
    expect(confirmButton).toBeDisabled()

 })

 test('popover respond to hover', async () => { 
    const user = userEvent.setup()
    render(<SummaryForm/>)
    
   // popover starts out hidden
   const nullPopover = screen.queryByText(/no ice cream will actually will be delivered/i)
   expect(nullPopover).not.toBeInTheDocument()

   // popover appears on mouseover of checkbox label
   const termsAndConditions = screen.getByText(/terms and conditions/i)
   await user.hover(termsAndConditions)
   const popover = screen.getByText(/no ice cream will actually will be delivered/i) //ilkende DOM da olmadığı için burada yeniden ulaşmamız lazım
   expect(popover).toBeInTheDocument()

   
   // popover disappear when we mouse out
   await user.unhover(termsAndConditions)
   expect(popover).not.toBeInTheDocument()
  })