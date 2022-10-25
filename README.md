# Jest ve React Testing Library
En sonda olması lazım. Ama görünsün diye başa koydum : https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

React Testing Library;

- Provides a virtual DOM for tests
  - Renders components into virtual DOM
- Provides utilities for interacting with DOM - Seachs in virtual DOM
  (zaten `render` ve `screen` i de react testing library den import ediyoruz)

Jest is a test runner. Mean that Jest;

- Finds tests
- Runs tests
- Determines whether tests pass or fail

Although there are different test runners, Jest is recommended by R. Testing Library. Also Jest comes with create-react-app

## Types of Tests

1- Unit tests

it tests one unit code in isolation

2- Integration tests

it tests how multiple units work together

3- Functional tests

it tests a particular behaviour of software

4- Acceptance / End-to-end (E2E) tests

it use actual browser and server (Cypress, Selenium)

## React Testing Library Genel Felsefesi

1- Testleri kodun nasıl çalıştığına göre değil kullanıcılar nasıl kullanıyorsa öyle test etmek
2- Elementlere id ler ile değil ulaşma araçları (accessibility markers) ile ulaşma

## Render ve Screen

Aşağıdaki örnekte `render` Virtual DOM oluştururken, `screen` Virtual DOM'da elementlere global olarak ulaşmamızı sağlıyor.

```javascript
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

## Assertion Syntax

Gene yukarıdaki örneği alırsak:

- `expect`: Jest global, starts the assertion. (Assertion başlatıyor. Bir şeyin test edileceğini söylüyor)
- `linkElement`: Subject of the assertion. (virtual DOM'da test edeceğimiz elemen)
- `toBeInTheDocument()`: Matcher. Type of assertion. This matcher comes form Jest-DOM. Parantez içine girecek ifade de Matcher argument oluyor.
  (matcher ları bulmak için link: https://github.com/testing-library/jest-dom)

```javascript
expect(linkElement).toBeInTheDocument();
```

## Jest DOM

- create-react-app ile birlikte geliyor
- _src/setupTests.js imports Jest DOM before each test, makes matcher available_

## Jest Watch Mode

- Jest en başta default olarak Watch Mode da çalışıyor
- It watchs for changes in files since last commit
- Only run tests related to these files (that are changed since last commit). No changes, no tests.

## How does Jest Work?

Gene aynı örneğe bakacak olursak global `test` methodu iki argument alır
1- Testin ne olduğunu söyleyen bir string description. Burada 'renders learn react link'
2- test callback function

Error çıkmazsa test geçer

```javascript
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

## TDD (Test-Driven Development)

- Write tests befoe writing code, then write code accordingt to 'spec' set by tests
- "red-green" testing: Tests fail before code is written

Aşamaları şöyle:

1- önce boş bir functional componen yaz ve render edecek şekilde App.js e bağla
2- testleri yaz
3- testler fail olsun
4- kodu yaz
5- testler geçsin

## Accessibility and Findings Elements

Elementlere nasıl ulaşabileceğimiz anlatan yer:

https://testing-library.com/docs/queries/about/#priority

`getByRole` için rol tanımları aşağıdaki linkin 5.4 Definition of Roles başlığı altında:
https://www.w3.org/TR/wai-aria/#role_definitions

matcher ları bulmak için link:
https://github.com/testing-library/jest-dom

## logRoles() ile elementin rolünü görüp ona göre ulaşma

Eğer elementin rolunu ve name ini bilmiyorsak aşağıda olduğu gibi logRoles u import ederiz. Sonra renderladığımız component ı destructure yaparak içindeki `container` ı çıkarırız. (Container component ın içindeki bütün element leri kapsayan div). Sonra `logRoles(container)` dersek bütün element ler rolleri ile birlikte terminalde görülecekler. Oradan rolü ve name ini (varsa diğer şeylerini görüp) o şekilde ulaşıp test yapabiliriz

```javascript
import { render, screen } from '@testing-library/react';
import {logRoles} from '@testing-library/dom'

import App from './App';

test('button has correct initial color', () => {
  const { container } = render(<App/>);
  logRoles(container);

  //! Bunun terminaldeki çıktısı

  console.log
    button:

    Name "Change to blue":
    <button
      style="background-color: red;"
    />


});

```

// HACK: Aşağıdaki test kısmında eğer ilk satırdaki string ifadeyi alırsak elementi bulabilmesi için name kısmına tam ifadeyi girmemiz gerekiyor. Ama ikinci satırdaki gibi regex ile yazarsak içeriğin hepsini yazmamıza gerek yok. Bir kısmı uysa da element ile eşleştiriyor

```javascript
//! code bölümü
<button style={{ backgroundColor: "red" }} disabled={disabled}>
  Change to blue
</button>;

//! Test bölümü
const colorButton = screen.getByRole("button", { name: "Change to blue" });
const colorButton = screen.getByRole("button", { name: /change to /i });
```

## Component ın İçinde Olmayan Bir Function u Test Etme

Fonksiyonu tanımlaığımız yerde export ederiz. Test dosyasında bu fonksiyonu import ederiz ve burada aşağıdaki gibi test ederiz:

```javascript
test("Works for multiple inner capital letters", () => {
  expect(replaceCamelWithSpaces("MediumVioletRed")).toBe("Medium Violet Red");
});
```

# ESLint ve Prettier i Testte Kullanma

// HACK: Test için alttaki ESLint yüklemelerini yapmak lazım

ESLint zaten yüklü geliyor. Ama test için olan pluginlerini yüklemek için aşağıdaki kodları terminale giriyoruz:

`yarn add eslint-plugin-testing-library eslint-plugin-jest-dom`

Bunu yaptıktan sonra ESLint configirasyon bilgilerini bulunduğu `package.json` dan kesiyoruz ve `package.json` ile aynı dizinde oluşturduğumuz `.eslintrc.json` dosyası içine koyuyoruz ve istediğimiz diğer ayarları yapıyoruz.
Burada "extends": [... ] kısmı kuralları düzenliyor. "plugins": [... ] kısmı içine ise eslint ile ilgili yüklenen pluginleri yazıyoruz. Yani yukarıda `yarn add ...` ile yüklediklerimizi giriyoruz ve bazı ek düzenlemelerle birlikte şu hali alıyor:

{
"plugins": [
"react-app",
"react-app/jest",
"plugin:testing-library/react", //testing library plugin in kurallarını reacte özel olarak uygula diyor
"plugin:jest-dom/recommended" // jest dom plugin i için tavsiye edilen kuralları uygula diyor
]
}

.gitignore dosyasına `.eslintcache` ve `.vscode` satırlarını da ekliyoruz

<u>Bu yüklemeleri yaptıktan sonra ESLint bize bir hata olduğunu söylediğinde. Hatalı satıra gidip mouse u hatının üzerinde bekletince ESLint in küçük bir bölmesi açılıyor. O bölmede önce **"Quick fix ..."** e sonra da yeni çıkan bölmede **"Fix this ..."** ile başlayan satıra tıklayınca kendisi hatayı düzeltiyor</u>

# fireEvent yerine userEvent kullanma

- userEvent daha kullanışlı olduğu için fireEvent e tercih etmek lazımmış

- yüklerken `npm install @testing-library/user-event@^14` diyerek 14 veya sonraki uygun sürümü yükle diyoruz ki son 14 veya yukarı olması önemliymiş

- userEvent daime promise döner. o yüzden test methodunun arguement ı olan callback i async şekilde yazıyoruz ve userEvent i await ile kullanıyoruz
- user'ı kullanmak için `const user = userEvent.setup()` olarak user ı instance ı alıyor ve kullanıyoruz. Aşağıdaki gibi

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SummaryForm from "../SummaryForm";

test("checkbox disables button on first click and enables on second click", async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);
  let checkBox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  let confirmButton = screen.getByRole("button", { name: /confirm order/i });

  await user.click(checkBox);
  expect(confirmButton).toBeEnabled();

  await user.click(checkBox);
  expect(confirmButton).toBeDisabled();
});
```

user eventlerine şu linkten ulaşabilirim: https://testing-library.com/docs/user-event/convenience

# screen in Query Metodları

// HACK: Aşağısı çok önemli

- Elementlere ulaşmak için kullanılan screen yöntemleridir.
- `get`, `query` ve `find` olmak üzere üç tanedir ve farklı durumlarda kullanılırlar.
  1- `get`: ulaşacağımız elemet DOM ağacında varsa kullanılır
  2- `query`: ulaşacağımız element DOM ağacında yoksa kullanılır
  3- `find`: ulaşacağımız element asynchoronously olarak ortaya çıkacaksa kullanılır

Bu üçüne de `command` diyelim. Kullanımları `command[All]By[QueryType]` şeklindedir

- birden fazla elemena ulaşılıyorsa `[All]` kullanılır. Ve bir arrar döndürür
- `QueryType`: Neye göre ulaşılacağını belirler
  - `Role` : En çok kullanılanı
  - `ALtText` : images lar için
  - `Text` : display elements
  - Form elements : `PlaceHolderText`, `LabelText`, `DisplayValue`

Bunlara kolayca ulaşılabilecek yermiş: https://testing-library.com/docs/react-testing-library/cheatsheet/

# Async İşlemleri Test Etme
## Mock Server Worker

Gerçek bir server a gereksinim duymadan mock/sahte bir server ile test yapmamızı sağlayan bir paket. Kendi sitesindeki şu linkte rest API ile kullanımı var. https://mswjs.io/docs/getting-started/mocks/rest-api . Kurulum ayarları:

1- `yarn add msw` ile yüklüyoruz

2- **src/mocks/handlers.js** dosyasını oluşturup aşağıdaki gibi önce import yapıyoruz ve sonra dönmesini istediğimiz responsu tanımlıyoruz:

```javascript
import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:3030/scoops", (req, res, ctx) => {
    return res(
      ctx.json([
        { name: "Chocolate", imagePath: "/images/chocolate.png" },
        { name: "Vanilla", imagePath: "/images/vanilla.png" },
      ])
    );
  }),
];
```

3- **src/mocks/server.js** dosyasını oluşturup içini aşağıdaki gibi dolduruyoruz:

```javascript
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);
```

4- src nin altında zaten bulunan `setupTests.js` dosyasına aşağıdakini yapıştırıyoruz/ekliyoruz :

````javascript
// src/setupTests.js
import { server } from './mocks/server.js'
// Establish API mocking before all tests.
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())```

````
// NOTE: `setupTests.js` ve `src/mocks/server.js` ayarlarını sadece bir def yapıyoruz. Ama `src/mocks/handlers.js` dosyasına her yapacağımız test için yeni handler ekliyoruz 

// HACK: number ve stringlerde `.toBe()` kullanılırken, array ve object lerde `.toEqual()` kullanılır 

## `await findBy`

Async bir istekte bulunduğumuz her kodun testinde `await findBy` kullanmalıyız 

(Ama bu her zaman yetmez. Bazen aşağıda anlatılan `waitFor` metoduyla birlikte kullanmak gerekiyor)

## `waitFor` metodu

Async işlemleri test ederken async respond u ile expect() assertion un sonucu bilgisayarın hızına bağlı olarak biri birinden önce gelebilir. Bu durumda test bazı bilgisayarlar error verirken bazılarında geçebilir. Bunu engellemek için bütün async işlemlerde `waitFor` metodunu kullanmalıyız. 

Bu metodu kullandığımızda test, test yapacağı async işlemlerinin sonuçlanmasını bekler ve sonuçlandıktan sonra çalışır. 

Aşağıda bu işlem gerektiği gibi uygulananca 2. işlem çalışmak için 1. işlemin tamamen sona ermesini bekliyor 

```javascript
  await waitFor (async () => {
    const alerts = await screen.findAllByRole("alert", { role: /alert/i }); // 1. işlem
    expect(alerts).toHaveLength(2);// 2. işlem
  });

```

## Belirli testleri çalıştırma
 1- Eğer sadece bir dosyadaki testleri çalıştırmak istiyorsak terminale **w>p** ye basıp çalıştırmak istediğimiz dosya isminin bir bölümünü giriyoruz. regex olarak sadece o dosya ismine denk gelecek bir giriş yapmamaz gerekiyor

 2- Bir dosyada birden fazla test varsa ve biz sadece birini çalıştırmak istiyorsak çalışmasını istediğimiz testi
 `test("string ifade", ()=>{})` den `test.only("string ifade", ()=>{})` e çeviriyoruz

 3- Bir dosyada birden fazla test varsa ve biz biri hariç diğerlerini çalıştırmak istiyorsak çalışmasını isteMEdiğimiz testi
 `test("string ifade", ()=>{})` den `test.skip("string ifade", ()=>{})` e çeviriyoruz

Yukarıdaki 1 ve 2 yi veya 1 ve 3 ü beraber kullanabiliriz. 

## input ları test ederken `clear()` ve `type()` kullanma

inputları test ederken o inputa ulaşıp önce `clear()` ile içini boşaltıyoruz ki test te kullanacağımız veriyi girmeden içinin boş olduğundan emin olalım. Sonra `type()` ile input içeriğine test te kullanacağımız metni yazıyoruz. 

```javascript
test('update scoop subtotel when scoop change', async () => { 
    const user = userEvent.setup()
    render(<Options optionType='scoops'/>)

    // update vanilla scoops to 1 and check the subtotal
    const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'})
    await user.clear(vanillaInput)//! clear ile silmemizin nedeni: o inputta ne olduğunu bilmiyoruz. O yüzden baştan bi siliyoruz
    await user.type(vanillaInput, "1")//! clear() ile sildiğimiz input içeriğine şimdi type() ile isteğimizi yazıyoruz ki test edebilelim. Yazılan string olmak zorunda 

})
```

# Testing Components Wrapped In A Provider

https://kentcdodds.com/blog/application-state-management-with-react

## Test edilecek component ı provider ile sarmalama

Context API veya Redux kullanılması farketmez, eğer state management kullanıyorsak test edeceğimiz component i renderlerken aşağıdaki gibi  provider ile sarmalayıp öyle renderlıyoruz. Bu da `render()` methodu için ikinci bir arguement olarak `{wrapper: OrderDetailProvider}` ın eklenmesiyle çözülüyor

```javascript
import { render, screen } from "@testing-library/react";
import { OrderDetailProvider } from "../../../context/OrderDetail";
import Options from '../Options'

test('update scoop subtotel when scoop change', async () => { 
    render(<Options optionType='scoops'/>, {wrapper: OrderDetailProvider})

```
-  Ama bu yöntemle her test dosyasında provider ı import etmek ve her test için render edilen component i sarmalamak lazım. Epey uzun bir iş. Bunu merkezi olarak yapmak daha basit. Bir sonraki adımda... 

##  default olarak provider ile sarmalama

https://testing-library.com/docs/react-testing-library/setup#custom-render

Normalde `- import { render, fireEvent } from '@testing-library/react'` şeklinde `render` ve `screen` methodlarını `'@testing-library/react'` dan import ediyor.

Ama testlerin hepsini provider ile merkezi bir yerde sarmalama için `test-utils.js` oluşturuyoruz, provider lı bir şekilde `render` methodunu override ediyoruz ve bu ikisini (render ve screen) `'@testing-library/react'` burası yerine `../test-utils'`dan aşağıdaki gibi import ediyoruz:

`import { render, fireEvent } from '../test-utils';`

Override işlemi: 

```javascript
import {render} from '@testing-library/react'
import { OrderDetailProvider } from '../context/OrderDetail'

const renderWithContext = (ui, options) => render(ui, {wrapper: OrderDetailProvider, ...options})

// re-export everything
export * from '@testing-library/react'

// override render method
export {renderWithContext as render}
```

// NOTE: *byRole() da exact ({exact: false}) kullanımına izin vermiyor. Onun için *byRole de {name: 'uileauy'} ile yakalamaya çalışmak lazım. Ama name ile çağıracaksak biraz regex bilmeliyiz. exact te regex e çok ihtiyaç yok 

# Debuggin Tips

## `screen.debug()` 

???
## `logRoles()` ile elementin rolünü görüp ona göre ulaşma

Eğer elementin rolunu ve name ini bilmiyorsak aşağıda olduğu gibi logRoles u import ederiz. Sonra renderladığımız component ı destructure yaparak içindeki `container` ı çıkarırız. (Container component ın içindeki bütün element leri kapsayan div). Sonra `logRoles(container)` dersek bütün element ler rolleri ile birlikte terminalde görülecekler. Oradan rolü ve name ini (varsa diğer şeylerini görüp) o şekilde ulaşıp test yapabiliriz

```javascript
import { render, screen } from '@testing-library/react';
import {logRoles} from '@testing-library/dom'

import App from './App';

test('button has correct initial color', () => {
  const { container } = render(<App/>);
  logRoles(container);

  //! Bunun terminaldeki çıktısı

  console.log
    button:

    Name "Change to blue":
    <button
      style="background-color: red;"
    />


});

```

# Using Mock Function for Typescript
Eğer component prop olarak bir function içeriyorsa ve typescript (`test.jsx` değil de `test.tsx`)kullanıyorsak test ederken bu fonksiyonu `jest.fn()` ile mock etmemiz lazım. Bu da `render()` metodu içerisinde componentın `render(<orderEntry myFunction={jest.fn()}` şeklinde yazılması ile olur. Yoksa eslint typescript hatası verir. 

Eğer typescript kullanmıyorsak (test.jsx kullanıyorsak) `myFunction={jest.fn()}` prop unu eklememize gerek yok. Ama best pravtice olarak yazmakta fayda var. Typescrpit kullanıyorsak (test.tsx) hata almamak için yazmalıyız. 

# Standars Questions to Ask When Starting A Test
 // HACK: Alttakiler çok önemli. Her teste başlamadan önce cevaplanması gerekir 
- What to render? 
  - What is the smallest component that encompasses tests?
- Do we need to pass any props? 
- Do we need to wrap the component with a Provider (Context/Redux farketmez)? 
  - Does the provider get used? Is it already wrapped within the compenent? 
  - Context'ten (Redux kullanıyorsak store dan) bir fonksiyon veya variable çekiyorsak kullanmalıyız. Ama aşağıdaki parantezdeki App.js durumu varsam kullanmaya gerek yok. 
  
    (Mesela bu örnekte App.js i test ederken halihazırda içindeki herşeyi Provider sarmaladığı için kendimiz test ederken eklemedik. Ama OrderCompenent ı test ederken ya testing başında wrap yapacağız ya da merkezi olarak provider ile sarmalayacağız ve render method unu oradan çağıracağız.) 
- Where should the test go?
  - which file? New file needed? 

    (Burada demek istediği şu hangi `componentName.test.jsx` dosyası içinde test edeceğiz. Var olan test dosyaları içinde mi test edeceğiz? Yoksa yeni bir `componentName.test.jsx` dosyası oluşturacağız. Eğer unit test yapıyorsak testini yaptığımız component ın `test.jsx` file ını kullanırız. Ama functional/behavioral test yapıyorsak component olarak parent bir component seçip (mesela burada `App.js`) onun testini yapacağımız bir dosya oluştururuz. 
- What to test?
  - Tam olarak hangi eylemi, senaryoyu test edeceğiz?
- How to test?
  - What queries and events are we goin to use? 
- Do we need to `await`?
  - Is there anything async going on? 